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
                        <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We want you to be completely satisfied with Dfolio. This policy outlines our refund
                            and cancellation terms for our subscription services.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">7-Day Money-Back Guarantee</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            If you are not satisfied with your Dfolio subscription, you may request a full refund
                            within 7 days of your initial purchase. This guarantee applies to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>First-time subscribers only</li>
                            <li>The initial subscription payment</li>
                            <li>Requests made within 7 days of purchase</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">Subscription Cancellation</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You may cancel your subscription at any time:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Your subscription will remain active until the end of your current billing period</li>
                            <li>You will not be charged for subsequent billing periods</li>
                            <li>No partial refunds are provided for unused time in the current billing period</li>
                            <li>Your portfolio will revert to the free plan features after the subscription ends</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">Refunds After 7 Days</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            After the 7-day guarantee period, refunds are generally not provided. However, we may
                            consider refunds on a case-by-case basis for:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Extended service outages caused by Dfolio</li>
                            <li>Accidental duplicate charges</li>
                            <li>Technical issues preventing access to paid features</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">Non-Refundable Items</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            The following are not eligible for refunds:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Subscription renewals (please cancel before renewal date)</li>
                            <li>Accounts terminated for Terms of Service violations</li>
                            <li>Refund requests made after 7 days from initial purchase</li>
                            <li>Partial month refunds for cancelled subscriptions</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">How to Request a Refund</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            To request a refund:
                        </p>
                        <ol className="list-decimal list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Email us at <a href="mailto:support@dfolio.dev" className="text-white hover:underline">support@dfolio.dev</a></li>
                            <li>Include your account email address</li>
                            <li>Provide the reason for your refund request</li>
                            <li>Include your payment date and amount</li>
                        </ol>
                        <p className="text-zinc-400 leading-relaxed mt-4">
                            We aim to process refund requests within 5-7 business days. Approved refunds will be
                            credited to your original payment method.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We reserve the right to modify this refund policy at any time. Changes will be effective
                            immediately upon posting to this page. Your continued use of Dfolio after changes
                            constitutes acceptance of the updated policy.
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
