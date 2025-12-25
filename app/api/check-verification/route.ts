import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Require authenticated session - no userId parameter to prevent enumeration
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ verified: false, error: 'Not authenticated' }, { status: 401 })
        }

        // Check if user's email is verified in profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('email_verified')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            verified: profile?.email_verified === true
        })
    } catch (error) {
        console.error('Check verification error:', error)
        return NextResponse.json({ verified: false, error: 'Failed to check verification' }, { status: 500 })
    }
}
