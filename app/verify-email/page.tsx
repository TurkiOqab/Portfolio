'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setErrorMessage('No verification token provided')
            return
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch('/api/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                })

                const data = await response.json()

                if (!response.ok) {
                    setStatus('error')
                    setErrorMessage(data.error || 'Verification failed')
                    return
                }

                setStatus('success')
            } catch {
                setStatus('error')
                setErrorMessage('Something went wrong. Please try again.')
            }
        }

        verifyEmail()
    }, [token])

    return (
        <>
            {status === 'verifying' && (
                <>
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-zinc-400 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verifying your email</h2>
                    <p className="text-zinc-400">Please wait...</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Email verified!</h2>
                    <p className="text-zinc-400 mb-6">
                        Your email has been verified. You can close this tab and return to where you signed up.
                    </p>
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 mb-6">
                        <p className="text-zinc-300 text-sm">
                            The page where you signed up will automatically redirect you to get started.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                        Or sign in on this device
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verification failed</h2>
                    <p className="text-zinc-400 mb-6">{errorMessage}</p>
                    <div className="space-y-3">
                        <Link
                            href="/signup"
                            className="inline-block w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all duration-300"
                        >
                            Sign up again
                        </Link>
                        <Link
                            href="/login"
                            className="inline-block text-zinc-400 hover:text-white transition-colors text-sm"
                        >
                            Back to login
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}

function LoadingState() {
    return (
        <>
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-zinc-400 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
            <p className="text-zinc-400">Please wait...</p>
        </>
    )
}

export default function VerifyEmailPage() {
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
                    <Suspense fallback={<LoadingState />}>
                        <VerifyEmailContent />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
