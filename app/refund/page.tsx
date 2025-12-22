import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Refund Policy | Dfolio',
    description: 'Refund Policy for Dfolio - Learn about our refund and cancellation policies.',
}

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-zinc-950 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />

            {/* Header */}
            <header className="relative z-10 border-b border-zinc-800/50">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-white">
                        Dfolio
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
                <p className="text-zinc-400 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <div className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">14-Day Money-Back Guarantee</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We offer a full refund within 14 days of purchase, no questions asked. If you&apos;re not
                            satisfied with Dfolio for any reason, simply request a refund and we&apos;ll process it promptly.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">How to Request a Refund</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            To request a refund, email us at{' '}
                            <a href="mailto:support@dfolio.dev" className="text-white hover:underline">support@dfolio.dev</a>
                            {' '}with your account email address. Refunds are typically processed within 5-7 business
                            days and will be credited to your original payment method.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">Subscription Cancellation</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            You may cancel your subscription at any time. Your subscription will remain active until
                            the end of your current billing period, and you will not be charged for subsequent periods.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            If you have questions about our refund policy, please contact us at{' '}
                            <a href="mailto:support@dfolio.dev" className="text-white hover:underline">
                                support@dfolio.dev
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
