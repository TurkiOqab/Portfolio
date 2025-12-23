import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Change to your verified domain
            to: email,
            subject: 'Test Email from dfolio',
            html: '<h1>Test Email</h1><p>If you receive this, Resend is working!</p>',
        })

        if (error) {
            console.error('Resend error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
}
