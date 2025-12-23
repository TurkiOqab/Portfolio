'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function VerifyPendingPage() {
    const router = useRouter()
    const [isResending, setIsResending] = useState(false)
    const [resendMessage, setResendMessage] = useState<string | null>(null)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [userId, setUserId] = useState<string | null>(null)

    // Get user on mount
    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            }
        }
        getUser()
    }, [])

    // Poll for verification status
    const checkVerification = useCallback(async () => {
        if (!userId) return

        try {
            const response = await fetch(`/api/check-verification?userId=${userId}`, {
                credentials: 'include',
            })
            const data = await response.json()

            if (data.verified) {
                router.push('/onboarding')
            }
        } catch (err) {
            console.error('Error checking verification:', err)
        }
    }, [router, userId])

    useEffect(() => {
        if (!userId) return

        // Poll every 1.5 seconds for faster detection
        const interval = setInterval(checkVerification, 1500)

        // Also check immediately
        checkVerification()

        return () => clearInterval(interval)
    }, [userId, checkVerification])

    // Cooldown timer effect
    useEffect(() => {
        if (resendCooldown <= 0) return

        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleResendEmail = async () => {
        if (resendCooldown > 0) return

        setIsResending(true)
        setResendMessage(null)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setResendMessage('Please log in to resend verification email.')
                setIsResending(false)
                return
            }

            const response = await fetch('/api/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    userId: user.id,
                }),
            })

            if (response.ok) {
                setResendMessage('Verification email sent! Check your inbox.')
                setResendCooldown(60) // Start 60-second cooldown
            } else {
                const data = await response.json()
                setResendMessage(data.error || 'Failed to send email. Please try again.')
            }
        } catch {
            setResendMessage('Something went wrong. Please try again.')
        }

        setIsResending(false)
    }

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/5 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white">Dfolio</h1>
                    </Link>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
                    <p className="text-zinc-400 mb-4">
                        Please check your inbox and click the verification link to access your account.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mb-6">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Waiting for verification...</span>
                    </div>

                    {resendMessage && (
                        <div className={`p-3 rounded-xl mb-4 ${resendMessage.includes('sent') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            <p className="text-sm">{resendMessage}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={handleResendEmail}
                            disabled={isResending || resendCooldown > 0}
                            className="w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                'Resend verification email'
                            )}
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full py-3 text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            Sign out and use a different account
                        </button>
                    </div>

                    <p className="text-zinc-500 text-xs mt-6">
                        Check your spam folder if you don&apos;t see the email.
                    </p>
                </div>
            </div>
        </div>
    )
}
