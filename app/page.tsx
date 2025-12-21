import Link from 'next/link'
import LandingHero from './components/LandingHero'
import FeaturesCards from './components/FeaturesCards'
import PortfolioMockup from './components/PortfolioMockup'
import HowItWorks from './components/HowItWorks'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Global Background Effects - Fixed to cover entire page */}
      <div className="fixed inset-0 bg-zinc-950 z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Grid Pattern - Fixed */}
      <div
        className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            DevFolio
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white transition-colors px-4 py-2 font-medium"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-violet-600 text-white font-medium rounded-full hover:bg-violet-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Typing Effect */}
      <LandingHero />

      {/* Portfolio Mockup Preview */}
      <section className="py-16 md:py-24 px-6 relative z-10">
        <PortfolioMockup />
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <FeaturesCards />

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Build yours in 5 minutes
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of developers showcasing their work with DevFolio.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-zinc-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} DevFolio. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
