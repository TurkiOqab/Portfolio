'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isRateLimited, setIsRateLimited] = useState(false)
    const attemptCount = useRef(0)
    const lockoutUntil = useRef<number | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Client-side rate limiting
        const now = Date.now()
        if (lockoutUntil.current && now < lockoutUntil.current) {
            const remainingSeconds = Math.ceil((lockoutUntil.current - now) / 1000)
            setError(`Too many attempts. Please try again in ${remainingSeconds} seconds.`)
            setIsRateLimited(true)
            return
        }

        // Reset lockout if expired
        if (lockoutUntil.current && now >= lockoutUntil.current) {
            lockoutUntil.current = null
            attemptCount.current = 0
            setIsRateLimited(false)
        }

        setIsLoading(true)

        const supabase = createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            attemptCount.current++

            // After 5 failed attempts, lock for 60 seconds
            if (attemptCount.current >= 5) {
                lockoutUntil.current = Date.now() + 60000
                setError('Too many failed attempts. Please try again in 60 seconds.')
                setIsRateLimited(true)
            } else {
                setError('Invalid email or password')
            }
            setIsLoading(false)
            return
        }

        // Reset on success
        attemptCount.current = 0
        router.push('/dashboard')
        router.refresh()
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
                    <p className="text-zinc-500 mt-2">Welcome back</p>
                </div>

                {/* Login Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-zinc-500 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-white hover:text-zinc-300 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
