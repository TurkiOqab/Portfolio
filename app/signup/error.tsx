'use client'

import Link from 'next/link'

export default function SignupError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/5 rounded-full blur-3xl" />

            <div className="relative z-10 text-center max-w-md">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Signup Error</h1>
                <p className="text-zinc-400 mb-6">
                    Something went wrong while creating your account. Please try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
