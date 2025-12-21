import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | Dfolio',
    description: 'Privacy Policy for Dfolio - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />

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
                <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-zinc-400 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <div className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            When you use Dfolio, we collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Account information (email address, username)</li>
                            <li>Portfolio content (name, bio, skills, projects, education, experience)</li>
                            <li>Contact information you choose to display on your portfolio</li>
                            <li>Files you upload (profile pictures, CVs, project images)</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Create and maintain your portfolio</li>
                            <li>Provide portfolio analytics (views, likes)</li>
                            <li>Send important service updates</li>
                            <li>Improve and develop our services</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Your public portfolio information is visible to anyone who visits your portfolio URL.
                            We do not sell your personal information to third parties. We may share information
                            with service providers who assist us in operating our platform (e.g., hosting, analytics).
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage and Security</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We use industry-standard security measures to protect your data. Your information is
                            stored securely using Supabase infrastructure. While we strive to protect your personal
                            information, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Access your personal data</li>
                            <li>Update or correct your information</li>
                            <li>Delete your account and associated data</li>
                            <li>Export your portfolio data</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Analytics</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We use essential cookies for authentication and session management. We collect
                            anonymous analytics data to understand how our service is used and to improve
                            the user experience.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Policy</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of any
                            significant changes by posting a notice on our website or sending you an email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at{' '}
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
