import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

// Whitelist of allowed redirect paths
const ALLOWED_REDIRECT_PREFIXES = ['/dashboard', '/onboarding', '/']

function isValidRedirect(path: string): boolean {
    // Must start with single slash (not //) to prevent open redirect
    if (!path.startsWith('/') || path.startsWith('//')) {
        return false
    }
    // Check if path starts with an allowed prefix
    return ALLOWED_REDIRECT_PREFIXES.some(prefix =>
        path === prefix || path.startsWith(prefix + '/') || prefix === '/'
    )
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    // Validate redirect to prevent open redirect attacks
    const safeRedirect = isValidRedirect(next) ? next : '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Check if user has completed onboarding (has a portfolio)
            const { data: portfolio } = await supabase
                .from('portfolios')
                .select('id')
                .eq('user_id', data.user.id)
                .single()

            // New users without a portfolio should go to onboarding
            if (!portfolio) {
                return NextResponse.redirect(`${origin}/onboarding`)
            }

            return NextResponse.redirect(`${origin}${safeRedirect}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
