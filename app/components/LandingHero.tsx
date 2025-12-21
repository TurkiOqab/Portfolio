'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingHero() {
  const fullText = "Create your developer portfolio in minutes"
  const [displayedText, setDisplayedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

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
          <span className="text-slate-400">{accentPart}</span>
        </>
      )
    } else {
      const beforeAccent = displayedText.slice(0, accentStart)
      const accentPart = displayedText.slice(accentStart, accentEnd)
      const afterAccent = displayedText.slice(accentEnd)
      return (
        <>
          {beforeAccent}
          <span className="text-slate-400">{accentPart}</span>
          {afterAccent}
        </>
      )
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-16 z-10">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-full mb-8 transition-all duration-500 ${
            displayedText.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
          <span className="text-xs sm:text-sm text-zinc-300 font-medium whitespace-nowrap">Start for free</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm text-zinc-500 hidden sm:inline">No credit card required</span>
        </div>

        {/* Main Heading with Typing Effect */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight min-h-[1.2em] md:min-h-[2.4em]">
          {renderText()}
        </h1>

        {/* Subheading */}
        <p
          className={`text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Stand out to recruiters and clients with a stunning portfolio.
          No coding required. Just fill in your details and you&apos;re live.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-100 ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/signup"
            className="group px-8 py-4 bg-white text-zinc-900 font-semibold rounded-full hover:bg-zinc-100 transition-all duration-300 flex items-center gap-2"
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
            className="group px-8 py-4 border border-zinc-700 text-white font-medium rounded-full hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-300"
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

        {/* Social Proof */}
        <div
          className={`flex flex-wrap items-center justify-center gap-6 md:gap-8 text-zinc-500 text-sm transition-all duration-700 delay-200 ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-400">Fast & reliable</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-400">Custom URL</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-400">Mobile optimized</span>
          </div>
        </div>
      </div>
    </section>
  )
}
