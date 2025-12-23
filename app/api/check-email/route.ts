import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/app/lib/supabase/admin'
import { logger } from '@/app/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
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
