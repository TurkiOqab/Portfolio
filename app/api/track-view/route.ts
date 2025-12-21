import { createClient } from '@/app/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/app/lib/rate-limit'

export async function POST(request: NextRequest) {
    try {
        // Rate limit by IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   'unknown'

        const rateLimitResult = rateLimit(`track-view:${ip}`, RATE_LIMITS.api)

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.resetIn.toString(),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            )
        }

        const { portfolioId, visitorId, referrer } = await request.json()

        if (!portfolioId || !visitorId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if this visitor already viewed this portfolio today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data: existingView } = await supabase
            .from('portfolio_views')
            .select('id')
            .eq('portfolio_id', portfolioId)
            .eq('visitor_id', visitorId)
            .gte('created_at', today.toISOString())
            .single()

        // Only insert if no view exists for today
        if (!existingView) {
            await supabase
                .from('portfolio_views')
                .insert({
                    portfolio_id: portfolioId,
                    visitor_id: visitorId,
                    referrer: referrer || null,
                })
        }

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { error: 'Failed to track view' },
            { status: 500 }
        )
    }
}
