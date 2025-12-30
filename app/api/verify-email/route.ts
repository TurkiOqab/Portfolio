import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { logger } from '@/app/lib/logger'
import { rateLimit, RATE_LIMITS } from '@/app/lib/rate-limit-redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    logger.debug('verify-email API called')

    try {
        // Rate limit by IP to prevent token brute-force attacks
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   'unknown'

        const rateLimitResult = await rateLimit(`verify-email:${ip}`, RATE_LIMITS.tokenVerification)
        if (!rateLimitResult.success) {
            logger.warn('Rate limit exceeded for token verification:', { ip })
            return NextResponse.json(
                { error: 'Too many verification attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                    }
                }
            )
        }

        // Get Supabase admin client (throws if env vars not set)
        const supabaseAdmin = getAdminClient()

        const { token } = await request.json()
        logger.debug('Token received:', token ? 'present' : 'missing')

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        // Find the token in the database
        logger.debug('Looking up token in database...')
        const { data: tokenData, error: tokenError } = await supabaseAdmin
            .from('verification_tokens')
            .select('*')
            .eq('token', token)
            .single()

        if (tokenError) {
            logger.error('Token lookup error:', tokenError)
            return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
        }

        if (!tokenData) {
            logger.error('Token not found in database')
            return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
        }

        logger.debug('Token found, user_id:', tokenData.user_id)

        // Check if token is expired
        if (new Date(tokenData.expires_at) < new Date()) {
            logger.debug('Token has expired')
            await supabaseAdmin
                .from('verification_tokens')
                .delete()
                .eq('token', token)

            return NextResponse.json({ error: 'Verification link has expired. Please sign up again.' }, { status: 400 })
        }

        // Update user's email_verified in profiles table
        logger.debug('Updating email_verified in profiles...')
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', tokenData.user_id)

        if (updateError) {
            logger.error('Update error:', updateError)
            return NextResponse.json({ error: 'Failed to verify email: ' + updateError.message }, { status: 500 })
        }

        logger.debug('User email verified successfully')

        // Delete the used token
        await supabaseAdmin
            .from('verification_tokens')
            .delete()
            .eq('token', token)

        logger.debug('Verification complete')
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Unexpected error:', error)
        return NextResponse.json({
            error: 'Failed to verify email: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 })
    }
}
