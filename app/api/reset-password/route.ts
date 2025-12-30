import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { rateLimit, RATE_LIMITS } from '@/app/lib/rate-limit-redis'
import { logger } from '@/app/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { email, redirectTo } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Rate limit by email to prevent abuse
        const rateLimitResult = await rateLimit(`reset-password:${email.toLowerCase()}`, RATE_LIMITS.passwordReset)
        if (!rateLimitResult.success) {
            logger.warn('Rate limit exceeded for password reset:', { email })
            return NextResponse.json(
                { error: 'Too many password reset requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                    }
                }
            )
        }

        // Also rate limit by IP to prevent enumeration
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   'unknown'

        const ipRateLimitResult = await rateLimit(`reset-password-ip:${ip}`, { limit: 10, windowSeconds: 3600 })
        if (!ipRateLimitResult.success) {
            logger.warn('IP rate limit exceeded for password reset:', { ip })
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': ipRateLimitResult.resetIn.toString(),
                    }
                }
            )
        }

        const supabase = await createClient()

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        })

        if (error) {
            logger.error('Password reset error:', error)
            // Don't reveal if email exists or not - always return success
            // This prevents email enumeration
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Unexpected error in password reset:', error)
        return NextResponse.json(
            { error: 'Failed to process request. Please try again.' },
            { status: 500 }
        )
    }
}
