import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service | DevFolio',
    description: 'Terms of Service for DevFolio - Read the terms and conditions for using our platform.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />

            {/* Header */}
            <header className="relative z-10 border-b border-zinc-800/50">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-white">
                        DevFolio
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
                <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-zinc-400 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <div className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            By accessing or using DevFolio, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            DevFolio provides a platform for developers to create and host professional portfolio
                            websites. We offer tools to showcase your skills, projects, and experience to potential
                            employers and clients.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            To use DevFolio, you must:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Be at least 13 years of age</li>
                            <li>Not share your account with others</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. User Content</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You retain ownership of the content you create on DevFolio. By posting content, you grant
                            us a license to display it on your public portfolio. You are responsible for ensuring your
                            content:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Does not violate any laws or regulations</li>
                            <li>Does not infringe on intellectual property rights</li>
                            <li>Does not contain malicious code or harmful content</li>
                            <li>Is accurate and not misleading</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Activities</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Use the service for any illegal purposes</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                            <li>Create fake or misleading profiles</li>
                            <li>Scrape or collect user data without permission</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            The DevFolio platform, including its design, features, and code, is owned by us and
                            protected by intellectual property laws. You may not copy, modify, or distribute our
                            platform without permission.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We reserve the right to suspend or terminate your account if you violate these terms.
                            You may delete your account at any time through the settings page. Upon termination,
                            your portfolio and associated data will be deleted.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            DevFolio is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
                            that the service will be uninterrupted, secure, or error-free. We are not responsible
                            for any decisions made based on your portfolio content.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            To the maximum extent permitted by law, DevFolio shall not be liable for any indirect,
                            incidental, special, or consequential damages arising from your use of the service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We may update these terms from time to time. Continued use of the service after changes
                            constitutes acceptance of the new terms. We will notify users of significant changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Contact</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            If you have questions about these Terms of Service, please contact us at{' '}
                            <a href="mailto:support@devfolio.app" className="text-white hover:underline">
                                support@devfolio.app
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
