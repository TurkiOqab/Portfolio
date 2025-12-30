import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { logger } from '@/app/lib/logger'
import { rateLimit, RATE_LIMITS } from '@/app/lib/rate-limit-redis'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // Rate limit by IP to prevent email enumeration attacks
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   'unknown'

        const rateLimitResult = await rateLimit(`check-email:${ip}`, RATE_LIMITS.emailCheck)
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                    }
                }
            )
        }

        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const supabaseAdmin = getAdminClient()

        // Check if email exists using profiles table (indexed query)
        // This is much more efficient than listing all users
        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .ilike('email', email)
            .maybeSingle()

        if (error) {
            logger.error('Error checking email:', error)
            // Return error state instead of fail-open to prevent duplicate registrations
            return NextResponse.json({ error: 'Unable to verify email availability' }, { status: 503 })
        }

        return NextResponse.json({ available: !profile })
    } catch (error) {
        logger.error('Check email error:', error)
        // Return error state instead of fail-open to prevent duplicate registrations
        return NextResponse.json({ error: 'Unable to verify email availability' }, { status: 503 })
    }
}
