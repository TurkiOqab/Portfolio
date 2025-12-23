'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { validatePassword } from '@/app/lib/validation'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
    const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [signupSuccess, setSignupSuccess] = useState(false)

    const checkUsername = async (value: string) => {
        if (value.length < 3) {
            setUsernameStatus('idle')
            return
        }

        setUsernameStatus('checking')

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', value.toLowerCase())
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking username:', error)
                setUsernameStatus('available')
                return
            }

            setUsernameStatus(data ? 'taken' : 'available')
        } catch (err) {
            console.error('Failed to check username:', err)
            setUsernameStatus('available')
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
        setUsername(value)

        const timeoutId = setTimeout(() => checkUsername(value), 500)
        return () => clearTimeout(timeoutId)
    }

    const checkEmail = async (value: string) => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
            setEmailStatus('idle')
            return
        }

        setEmailStatus('checking')

        try {
            const response = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value }),
            })

            const data = await response.json()
            setEmailStatus(data.available ? 'available' : 'taken')
        } catch (err) {
            console.error('Failed to check email:', err)
            setEmailStatus('idle')
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)

        const timeoutId = setTimeout(() => checkEmail(value), 500)
        return () => clearTimeout(timeoutId)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (username.length < 3) {
            setError('Username must be at least 3 characters')
            return
        }

        if (usernameStatus === 'taken') {
            setError('Username is already taken')
            return
        }

        if (emailStatus === 'taken') {
            setError('This email is already registered. Please sign in instead.')
            return
        }

        if (!acceptedTerms) {
            setError('Please accept the Terms of Service and Privacy Policy')
            return
        }

        const passwordError = validatePassword(password)
        if (passwordError) {
            setError(passwordError)
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        const supabase = createClient()

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username.toLowerCase(),
                    terms_accepted_at: new Date().toISOString(),
                    privacy_accepted_at: new Date().toISOString(),
                }
            }
        })

        if (authError) {
            if (authError.message.toLowerCase().includes('already registered') ||
                authError.message.toLowerCase().includes('already been registered') ||
                authError.message.toLowerCase().includes('user already exists')) {
                setError('This email is already registered. Please sign in instead.')
            } else {
                setError(authError.message)
            }
            setIsLoading(false)
            return
        }

        if (!authData.user) {
            setError('Failed to create account. Please try again.')
            setIsLoading(false)
            return
        }

        // Send verification email via Resend
        try {
            const response = await fetch('/api/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    userId: authData.user.id,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                console.error('Failed to send verification email:', data.error)
                // Still show success - user was created, they can request new email later
            }
        } catch (err) {
            console.error('Failed to send verification email:', err)
        }

        setIsLoading(false)
        setSignupSuccess(true)
    }

    // Poll for verification status when signup is successful
    const checkVerification = useCallback(async () => {
        try {
            const response = await fetch('/api/check-verification')
            const data = await response.json()

            if (data.verified) {
                router.push('/onboarding')
            }
        } catch (err) {
            console.error('Error checking verification:', err)
        }
    }, [router])

    useEffect(() => {
        if (!signupSuccess) return

        // Poll every 3 seconds
        const interval = setInterval(checkVerification, 3000)

        // Also check immediately
        checkVerification()

        return () => clearInterval(interval)
    }, [signupSuccess, checkVerification])

    if (signupSuccess) {
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
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                        <p className="text-zinc-400 mb-6">
                            We&apos;ve sent a verification link to <span className="text-white">{email}</span>.
                            Click the link to verify your account.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mb-4">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Waiting for verification...</span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-zinc-500 text-sm">
                                Didn&apos;t receive the email? Check your spam folder.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block text-white hover:text-zinc-300 transition-colors text-sm"
                            >
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/5 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white">
                            Dfolio
                        </h1>
                    </Link>
                    <p className="text-zinc-500 mt-2">Create your portfolio in minutes</p>
                </div>

                {/* Signup Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-400 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                    dfolio.dev/
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                    className="w-full pl-32 pr-10 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all"
                                    placeholder="yourname"
                                />
                                {usernameStatus === 'checking' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-zinc-400 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    </div>
                                )}
                                {usernameStatus === 'available' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                                {usernameStatus === 'taken' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {usernameStatus === 'taken' && (
                                <p className="text-red-400 text-xs mt-1">This username is already taken</p>
                            )}
                            {usernameStatus === 'available' && (
                                <p className="text-emerald-400 text-xs mt-1">Username is available!</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    className="w-full px-4 pr-10 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all"
                                    placeholder="you@example.com"
                                />
                                {emailStatus === 'checking' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-zinc-400 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    </div>
                                )}
                                {emailStatus === 'available' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                                {emailStatus === 'taken' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {emailStatus === 'taken' && (
                                <p className="text-red-400 text-xs mt-1">This email is already registered</p>
                            )}
                            {emailStatus === 'available' && (
                                <p className="text-emerald-400 text-xs mt-1">Email is available!</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full px-4 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-zinc-500 text-xs mt-1">Min 8 chars with uppercase, lowercase, and number</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-400 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full px-4 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Terms Acceptance */}
                        <div className="flex items-start gap-3">
                            <div className="relative mt-0.5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div
                                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                                    className="w-5 h-5 rounded border-2 border-zinc-600 bg-zinc-800 cursor-pointer peer-checked:bg-white peer-checked:border-white transition-all flex items-center justify-center"
                                >
                                    {acceptedTerms && (
                                        <svg className="w-3 h-3 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <label htmlFor="terms" className="text-sm text-zinc-400 cursor-pointer">
                                I agree to the{' '}
                                <Link href="/terms" className="text-white hover:underline" target="_blank">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-white hover:underline" target="_blank">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || usernameStatus === 'taken' || emailStatus === 'taken' || !acceptedTerms || (confirmPassword !== '' && password !== confirmPassword)}
                            className="w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-zinc-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white hover:text-zinc-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
