import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    console.log('=== verify-email API called ===')

    try {
        // Check environment variables
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
            return NextResponse.json({ error: 'Database URL not configured' }, { status: 500 })
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
            return NextResponse.json({ error: 'Database service not configured' }, { status: 500 })
        }

        // Create Supabase admin client at runtime
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        const { token } = await request.json()
        console.log('Token received:', token ? 'present' : 'missing')

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        // Find the token in the database
        console.log('Looking up token in database...')
        const { data: tokenData, error: tokenError } = await supabaseAdmin
            .from('verification_tokens')
            .select('*')
            .eq('token', token)
            .single()

        if (tokenError) {
            console.error('Token lookup error:', tokenError)
            return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
        }

        if (!tokenData) {
            console.error('Token not found in database')
            return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 })
        }

        console.log('Token found, user_id:', tokenData.user_id)
        console.log('Token expires_at:', tokenData.expires_at)

        // Check if token is expired
        if (new Date(tokenData.expires_at) < new Date()) {
            console.log('Token has expired')
            // Delete expired token
            await supabaseAdmin
                .from('verification_tokens')
                .delete()
                .eq('token', token)

            return NextResponse.json({ error: 'Verification link has expired. Please sign up again.' }, { status: 400 })
        }

        // Update user's email_confirmed_at using admin API
        console.log('Updating user email confirmation status...')
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            tokenData.user_id,
            { email_confirm: true }
        )

        if (updateError) {
            console.error('Update error:', updateError)
            return NextResponse.json({ error: 'Failed to verify email: ' + updateError.message }, { status: 500 })
        }

        console.log('User email confirmed successfully')

        // Delete the used token
        const { error: deleteError } = await supabaseAdmin
            .from('verification_tokens')
            .delete()
            .eq('token', token)

        if (deleteError) {
            console.error('Error deleting token:', deleteError)
            // Not critical, continue
        }

        console.log('Verification complete')
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({
            error: 'Failed to verify email: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 })
    }
}
