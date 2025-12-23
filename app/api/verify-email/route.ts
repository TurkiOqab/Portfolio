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
        console.log('Token email:', tokenData.email)
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

        // Get email from token data (no need to look up user)
        const userEmail = tokenData.email
        if (!userEmail) {
            console.error('No email stored in token')
            return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
        }

        // Update user's email_verified in profiles table
        console.log('Updating email_verified in profiles...')
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', tokenData.user_id)

        if (updateError) {
            console.error('Update error:', updateError)
            return NextResponse.json({ error: 'Failed to verify email: ' + updateError.message }, { status: 500 })
        }

        console.log('User email verified successfully')

        // Generate a magic link for auto-login
        console.log('Generating magic link for auto-login...')
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: userEmail,
        })

        if (linkError) {
            console.error('Magic link generation error:', linkError)
            // Still return success - user can manually log in
            // Delete the used token
            await supabaseAdmin
                .from('verification_tokens')
                .delete()
                .eq('token', token)

            return NextResponse.json({ success: true, autoLogin: false })
        }

        console.log('Magic link generated successfully')

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

        // Return the token hash for client-side auto-login
        return NextResponse.json({
            success: true,
            autoLogin: true,
            tokenHash: linkData.properties.hashed_token,
            email: userEmail
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({
            error: 'Failed to verify email: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 })
    }
}
