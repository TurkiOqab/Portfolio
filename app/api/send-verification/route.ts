import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { logger } from '@/app/lib/logger'
import { rateLimit, RATE_LIMITS } from '@/app/lib/rate-limit-redis'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    logger.debug('send-verification API called')

    try {
        // Check environment variables
        if (!process.env.RESEND_API_KEY) {
            logger.error('RESEND_API_KEY is not set')
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)

        // Get Supabase admin client (throws if env vars not set)
        const supabaseAdmin = getAdminClient()

        const { email, userId } = await request.json()
        logger.debug('Request body:', { email, userId: userId ? 'present' : 'missing' })

        // Validate required fields first
        if (!email || !userId) {
            logger.error('Missing email or userId')
            return NextResponse.json({ error: 'Email and userId are required' }, { status: 400 })
        }

        // Rate limit by email to prevent email bombing (after validation)
        const rateLimitResult = await rateLimit(`send-verification:${email}`, RATE_LIMITS.emailVerification)
        if (!rateLimitResult.success) {
            logger.warn('Rate limit exceeded for email verification:', { email })
            return NextResponse.json(
                { error: 'Too many verification requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                    }
                }
            )
        }

        // Verify that the userId is a real user and the email matches
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

        if (userError || !userData?.user) {
            logger.error('Invalid userId:', userError)
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        if (userData.user.email !== email) {
            logger.error('Email mismatch for userId')
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        logger.debug('Generated token, expires at:', expiresAt.toISOString())

        // Delete any existing tokens for this user
        const { error: deleteError } = await supabaseAdmin
            .from('verification_tokens')
            .delete()
            .eq('user_id', userId)

        if (deleteError) {
            logger.warn('Error deleting old tokens:', deleteError)
            // Continue anyway - this is not critical
        }

        // Store the token with email
        const { error: tokenError } = await supabaseAdmin
            .from('verification_tokens')
            .insert({
                user_id: userId,
                email,
                token,
                expires_at: expiresAt.toISOString(),
            })

        if (tokenError) {
            logger.error('Token storage error:', tokenError)
            return NextResponse.json({ error: 'Failed to create verification token: ' + tokenError.message }, { status: 500 })
        }
        logger.debug('Token stored successfully')

        // Build verification URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const verificationUrl = `${baseUrl}/verify-email?token=${token}`
        logger.debug('Verification URL base:', baseUrl)

        // Send email via Resend
        logger.debug('Sending email via Resend to:', email)
        const { data, error } = await resend.emails.send({
            from: 'Dfolio <noreply@dfolio.dev>',
            to: email,
            subject: 'Verify your Dfolio account',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #18181b; border-radius: 16px; border: 1px solid #27272a;">
                                    <tr>
                                        <td style="padding: 40px;">
                                            <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: bold; color: #ffffff; text-align: center;">
                                                Dfolio
                                            </h1>
                                            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #ffffff;">
                                                Verify your email
                                            </h2>
                                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #a1a1aa;">
                                                Thanks for signing up! Click the button below to verify your email address and get started with your portfolio.
                                            </p>
                                            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #09090b; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 12px;">
                                                Verify Email
                                            </a>
                                            <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                                                This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
                                            </p>
                                            <hr style="margin: 32px 0; border: none; border-top: 1px solid #27272a;">
                                            <p style="margin: 0; font-size: 12px; color: #52525b;">
                                                If the button doesn't work, copy this link:<br>
                                                <a href="${verificationUrl}" style="color: #a1a1aa; word-break: break-all;">${verificationUrl}</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        })

        if (error) {
            logger.error('Resend error:', error)
            return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 })
        }

        logger.debug('Email sent successfully:', data)
        return NextResponse.json({ success: true, data })
    } catch (error) {
        logger.error('Unexpected error:', error)
        return NextResponse.json({
            error: 'Failed to send verification email: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 })
    }
}
