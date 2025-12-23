import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        // Check if email exists in auth.users
        const { data, error } = await supabaseAdmin.auth.admin.listUsers()

        if (error) {
            console.error('Error checking email:', error)
            return NextResponse.json({ available: true }) // Fail open
        }

        const emailExists = data.users.some(
            user => user.email?.toLowerCase() === email.toLowerCase()
        )

        return NextResponse.json({ available: !emailExists })
    } catch (error) {
        console.error('Check email error:', error)
        return NextResponse.json({ available: true }) // Fail open
    }
}
