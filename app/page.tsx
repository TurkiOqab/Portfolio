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

      {/* Global Background Effects - Fixed to cover entire page */}
      <div className="fixed inset-0 bg-zinc-950 z-0" />

      {/* Enhanced gradient mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-600/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/6 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-violet-500/5 rounded-full blur-3xl animate-glow" />
      </div>

      {/* Grid Pattern - Fixed with enhanced visibility */}
      <div
        className="fixed inset-0 opacity-[0.04] z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.8)_70%)]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow duration-300">D</span>
            <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">DevFolio</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white transition-colors px-4 py-2 font-medium relative after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:bg-violet-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02]"
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
          <div className="relative p-12 md:p-16 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Background glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-violet-600/20 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Build yours in <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">5 minutes</span>
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
                Join thousands of developers showcasing their work with DevFolio.
              </p>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-semibold rounded-full hover:bg-zinc-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-zinc-900 shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02]"
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
