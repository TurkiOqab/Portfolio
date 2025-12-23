import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        // Find the token in the database
        const { data: tokenData, error: tokenError } = await supabaseAdmin
            .from('verification_tokens')
            .select('*')
            .eq('token', token)
            .single()

        if (tokenError || !tokenData) {
            return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
        }

        // Check if token is expired
        if (new Date(tokenData.expires_at) < new Date()) {
            // Delete expired token
            await supabaseAdmin
                .from('verification_tokens')
                .delete()
                .eq('token', token)

            return NextResponse.json({ error: 'Verification link has expired. Please sign up again.' }, { status: 400 })
        }

        // Update user's email_confirmed_at using admin API
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            tokenData.user_id,
            { email_confirm: true }
        )

        if (updateError) {
            console.error('Update error:', updateError)
            return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
        }

        // Delete the used token
        await supabaseAdmin
            .from('verification_tokens')
            .delete()
            .eq('token', token)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
    }
}
