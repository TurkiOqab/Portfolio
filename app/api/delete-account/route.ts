import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/app/lib/supabase/server'
import { getAdminClient } from '@/app/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function DELETE() {
    try {
        // Get current user from session
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Get admin client for user deletion
        const supabaseAdmin = getAdminClient()

        // Delete verification tokens
        await supabaseAdmin
            .from('verification_tokens')
            .delete()
            .eq('user_id', user.id)

        // Get portfolio for cascade deletes
        const { data: portfolio } = await supabaseAdmin
            .from('portfolios')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (portfolio) {
            // Delete analytics data
            await supabaseAdmin
                .from('portfolio_views')
                .delete()
                .eq('portfolio_id', portfolio.id)

            await supabaseAdmin
                .from('portfolio_likes')
                .delete()
                .eq('portfolio_id', portfolio.id)

            // Delete projects
            await supabaseAdmin
                .from('projects')
                .delete()
                .eq('portfolio_id', portfolio.id)

            // Delete portfolio
            await supabaseAdmin
                .from('portfolios')
                .delete()
                .eq('user_id', user.id)
        }

        // Delete profile
        await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', user.id)

        // Delete the auth user (this is the key fix!)
        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

        if (deleteUserError) {
            console.error('Failed to delete auth user:', deleteUserError)
            return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Account deletion error:', error)
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
}
