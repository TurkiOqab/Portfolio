import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pricing | Dfolio',
    description: 'Dfolio is currently free for all users. Create your developer portfolio today.',
}

const features = [
    'Custom portfolio page',
    'Unlimited projects',
    'AI-powered CV import',
    'All themes & fonts included',
    'dfolio.dev/username URL',
    'Mobile responsive design',
    'Education & experience sections',
    'Project showcases',
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />

            {/* Header */}
            <header className="relative z-10 border-b border-zinc-800/50">
                <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-white">
                        Dfolio
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm px-4 py-2 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Free for now
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        We&apos;re in early access. Enjoy full access to all features while we grow.
                    </p>
                </div>

                {/* Single Pricing Card */}
                <div className="max-w-md mx-auto">
                    <div className="relative rounded-2xl p-8 bg-white text-zinc-900 shadow-2xl shadow-white/10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="px-4 py-1 bg-zinc-900 text-white text-sm font-medium rounded-full">
                                Early Access
                            </span>
                        </div>

                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold mb-2 text-zinc-900">
                                All Features
                            </h2>
                            <p className="text-zinc-600">
                                Everything you need to showcase your work
                            </p>
                        </div>

                        <div className="mb-6 text-center">
                            <span className="text-5xl font-bold text-zinc-900">
                                $0
                            </span>
                            <span className="text-zinc-600 ml-2">
                                for now
                            </span>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5 flex-shrink-0 text-zinc-900"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-zinc-700">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/signup"
                            className="block w-full py-3 rounded-xl font-medium text-center transition-all bg-zinc-900 text-white hover:bg-zinc-800"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-12 text-center">
                    <p className="text-zinc-500 text-sm max-w-md mx-auto">
                        We may introduce paid plans in the future, but early users will always be taken care of.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-6 border-t border-zinc-800/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-zinc-500 text-sm">
                        © {new Date().getFullYear()} Dfolio. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6 text-sm text-zinc-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
