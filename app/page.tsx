import Link from 'next/link'
import LandingHero from './components/LandingHero'
import FeaturesCards from './components/FeaturesCards'
import PortfolioMockup from './components/PortfolioMockup'
import HowItWorks from './components/HowItWorks'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {/* Global Background */}
      <div className="fixed inset-0 bg-zinc-950 z-0" />

      {/* Subtle background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-slate-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-zinc-700/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.9)_70%)]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-zinc-900">D</span>
            <span className="text-white">Dfolio</span>
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
              className="px-5 py-2.5 bg-white text-zinc-900 font-medium rounded-full hover:bg-zinc-200 transition-all duration-300"
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
          <div className="relative p-12 md:p-16 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Build yours in <span className="text-slate-400">5 minutes</span>
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
                Join thousands of developers showcasing their work with Dfolio.
              </p>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-semibold rounded-full hover:bg-zinc-100 transition-all duration-300"
              >
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800/50 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Dfolio. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:support@dfolio.dev" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
