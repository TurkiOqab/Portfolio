import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pricing | Dfolio',
    description: 'Simple, transparent pricing for Dfolio. Start free, upgrade when you need more.',
}

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
            'Custom portfolio page',
            'Up to 3 projects',
            'Basic analytics',
            'dfolio.dev/username URL',
            'All themes included',
        ],
        cta: 'Get Started',
        ctaLink: '/signup',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$5',
        period: '/month',
        description: 'For developers who want more',
        features: [
            'Everything in Free',
            'Unlimited projects',
            'Advanced analytics',
            'Custom domain support',
            'Priority support',
            'Remove Dfolio branding',
            'CV/Resume upload',
        ],
        cta: 'Upgrade to Pro',
        ctaLink: '/signup',
        highlighted: true,
    },
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
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Start free and upgrade when you need more. No hidden fees, cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 ${
                                plan.highlighted
                                    ? 'bg-white text-zinc-900 shadow-2xl shadow-white/10'
                                    : 'bg-zinc-900/50 border border-zinc-800 text-white'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-zinc-900 text-white text-sm font-medium rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-zinc-900' : 'text-white'}`}>
                                    {plan.name}
                                </h2>
                                <p className={plan.highlighted ? 'text-zinc-600' : 'text-zinc-400'}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-6">
                                <span className={`text-5xl font-bold ${plan.highlighted ? 'text-zinc-900' : 'text-white'}`}>
                                    {plan.price}
                                </span>
                                <span className={plan.highlighted ? 'text-zinc-600' : 'text-zinc-400'}>
                                    {plan.period}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <svg
                                            className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-zinc-900' : 'text-white'}`}
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
                                        <span className={plan.highlighted ? 'text-zinc-700' : 'text-zinc-300'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.ctaLink}
                                className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
                                    plan.highlighted
                                        ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                                        : 'bg-white text-zinc-900 hover:bg-zinc-200'
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ or Trust Elements */}
                <div className="mt-20 text-center">
                    <p className="text-zinc-500 mb-4">
                        14-day money-back guarantee. No questions asked.
                    </p>
                    <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure payments
                        </span>
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel anytime
                        </span>
                    </div>
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
                        <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
