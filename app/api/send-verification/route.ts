import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    console.log('=== send-verification API called ===')

    try {
        // Check environment variables
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not set')
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
            return NextResponse.json({ error: 'Database service not configured' }, { status: 500 })
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
            return NextResponse.json({ error: 'Database URL not configured' }, { status: 500 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)

        // Create Supabase admin client at runtime
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        const { email, userId } = await request.json()
        console.log('Request body:', { email, userId: userId ? 'present' : 'missing' })

        if (!email || !userId) {
            console.error('Missing email or userId')
            return NextResponse.json({ error: 'Email and userId are required' }, { status: 400 })
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        console.log('Generated token, expires at:', expiresAt.toISOString())

        // Delete any existing tokens for this user
        const { error: deleteError } = await supabaseAdmin
            .from('verification_tokens')
            .delete()
            .eq('user_id', userId)

        if (deleteError) {
            console.error('Error deleting old tokens:', deleteError)
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
            console.error('Token storage error:', tokenError)
            return NextResponse.json({ error: 'Failed to create verification token: ' + tokenError.message }, { status: 500 })
        }
        console.log('Token stored successfully')

        // Build verification URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const verificationUrl = `${baseUrl}/verify-email?token=${token}`
        console.log('Verification URL base:', baseUrl)

        // Send email via Resend
        console.log('Sending email via Resend to:', email)
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
            console.error('Resend error:', error)
            return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 })
        }

        console.log('Email sent successfully:', data)
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({
            error: 'Failed to send verification email: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 })
    }
}
