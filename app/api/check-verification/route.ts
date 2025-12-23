import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        // Get userId from query param (fallback for when session cookies aren't ready)
        const { searchParams } = new URL(request.url)
        const userIdParam = searchParams.get('userId')

        // Try to get user from session first
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Use session user if available, otherwise use provided userId
        const userId = user?.id || userIdParam

        if (!userId) {
            return NextResponse.json({ verified: false, error: 'Not authenticated' }, { status: 401 })
        }

        // For userId param (no session), use admin client to bypass RLS
        if (!user && userIdParam) {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
                return NextResponse.json({ verified: false, error: 'Server configuration error' }, { status: 500 })
            }

            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY,
                { auth: { autoRefreshToken: false, persistSession: false } }
            )

            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('email_verified')
                .eq('id', userId)
                .single()

            return NextResponse.json({
                verified: profile?.email_verified === true
            })
        }

        // Check if user's email is verified in profiles (using session)
        const { data: profile } = await supabase
            .from('profiles')
            .select('email_verified')
            .eq('id', userId)
            .single()

        return NextResponse.json({
            verified: profile?.email_verified === true
        })
    } catch (error) {
        console.error('Check verification error:', error)
        return NextResponse.json({ verified: false, error: 'Failed to check verification' }, { status: 500 })
    }
}
