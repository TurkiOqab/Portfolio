'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

    const checkUsername = async (value: string) => {
        if (value.length < 3) {
            setUsernameStatus('idle')
            return
        }

        setUsernameStatus('checking')
        const supabase = createClient()

        const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', value.toLowerCase())
            .single()

        setUsernameStatus(data ? 'taken' : 'available')
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
        setUsername(value)

        // Debounce username check
        const timeoutId = setTimeout(() => checkUsername(value), 500)
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

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        const supabase = createClient()

        // Sign up the user with username in metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username.toLowerCase(),
                }
            }
        })

        if (authError) {
            // Check for duplicate email error
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

        router.push('/onboarding')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            DevFolio
                        </h1>
                    </Link>
                    <p className="text-zinc-400 mt-2">Create your portfolio in minutes</p>
                </div>

                {/* Signup Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                    devfolio.com/
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                    className="w-full pl-32 pr-10 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
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
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                placeholder="••••••••"
                            />
                            <p className="text-zinc-500 text-xs mt-1">Minimum 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || usernameStatus === 'taken'}
                            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <p className="text-zinc-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
