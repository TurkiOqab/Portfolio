'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingHero() {
  const fullText = "Create your developer portfolio in minutes"
  const [displayedText, setDisplayedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    // Typing animation - plays on every page load
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, 50) // Speed of typing (ms per character)

    return () => clearInterval(typingInterval)
  }, [])

  // Function to render text with accent styling for "developer portfolio"
  const renderText = () => {
    const accentStart = fullText.indexOf('developer portfolio')
    const accentEnd = accentStart + 'developer portfolio'.length

    if (displayedText.length <= accentStart) {
      return <>{displayedText}</>
    } else if (displayedText.length <= accentEnd) {
      const beforeAccent = displayedText.slice(0, accentStart)
      const accentPart = displayedText.slice(accentStart)
      return (
        <>
          {beforeAccent}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">{accentPart}</span>
        </>
      )
    } else {
      const beforeAccent = displayedText.slice(0, accentStart)
      const accentPart = displayedText.slice(accentStart, accentEnd)
      const afterAccent = displayedText.slice(accentEnd)
      return (
        <>
          {beforeAccent}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">{accentPart}</span>
          {afterAccent}
        </>
      )
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-16 z-10">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl animate-glow pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge with enhanced styling */}
        <div
          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/80 border border-zinc-700/50 rounded-full mb-8 transition-all duration-500 backdrop-blur-sm ${
            displayedText.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-sm text-zinc-300 font-medium">Start for free</span>
          <span className="text-zinc-600">•</span>
          <span className="text-sm text-zinc-400">No credit card required</span>
        </div>

        {/* Main Heading with Typing Effect */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight min-h-[1.2em] md:min-h-[2.4em]">
          {renderText()}
          <span className={`inline-block w-[3px] h-[0.9em] bg-violet-500 ml-1 align-middle ${isTypingComplete ? 'animate-pulse' : ''}`} />
        </h1>

        {/* Subheading - Fades in after typing completes */}
        <p
          className={`text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Stand out to recruiters and clients with a stunning portfolio.
          No coding required. Just fill in your details and you&apos;re live.
        </p>

        {/* CTA Buttons - Fade in after typing completes */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-100 ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/signup"
            className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
          >
            Create Your Portfolio
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            href="#features"
            className="group px-8 py-4 border border-zinc-700 text-white font-medium rounded-full hover:bg-zinc-800/50 hover:border-zinc-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950 hover:scale-[1.02]"
          >
            See How It Works
            <svg
              className="w-4 h-4 inline-block ml-2 group-hover:translate-y-0.5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>

        {/* Social Proof - Fades in after typing completes with staggered animation */}
        <div
          className={`flex flex-wrap items-center justify-center gap-6 md:gap-8 text-zinc-500 text-sm transition-all duration-700 delay-200 ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-300">Fast & reliable</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-300">Custom URL</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-300">Mobile optimized</span>
          </div>
        </div>
      </div>
    </section>
  )
}
