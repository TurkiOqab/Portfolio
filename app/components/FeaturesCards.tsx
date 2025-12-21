'use client'

import { useRef, useState, useEffect } from 'react'

const features = [
  {
    title: 'Lightning Fast Setup',
    description: 'Be live in under 5 minutes. Our guided wizard makes it simple to create a stunning portfolio that showcases your work professionally.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Your Own URL',
    description: 'Get a personalized URL like dfolio.dev/yourname that you can share anywhere. Make it easy for recruiters and clients to find you.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: 'Beautiful Designs',
    description: 'Modern, responsive designs that look great on any device. No design skills needed — just fill in your details and watch your portfolio come to life.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
]

export default function FeaturesCards() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [displayedDesc, setDisplayedDesc] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  // Typing effect for title and description
  useEffect(() => {
    const feature = features[activeIndex]
    let titleIndex = 0
    let descIndex = 0
    let phase: 'title' | 'desc' | 'pause' | 'clear' = 'title'

    setDisplayedTitle('')
    setDisplayedDesc('')
    setIsTyping(true)

    const type = () => {
      if (phase === 'title') {
        if (titleIndex <= feature.title.length) {
          setDisplayedTitle(feature.title.slice(0, titleIndex))
          titleIndex++
          setTimeout(type, 25)
        } else {
          phase = 'desc'
          setTimeout(type, 50)
        }
      } else if (phase === 'desc') {
        if (descIndex <= feature.description.length) {
          setDisplayedDesc(feature.description.slice(0, descIndex))
          descIndex++
          setTimeout(type, 5)
        } else {
          phase = 'pause'
          setIsTyping(false)
          setTimeout(type, 2000)
        }
      } else if (phase === 'pause') {
        phase = 'clear'
        setIsTyping(true)
        setTimeout(type, 30)
      } else if (phase === 'clear') {
        if (descIndex > 0 || titleIndex > 0) {
          if (descIndex > 0) {
            descIndex = Math.max(0, descIndex - 8)
            setDisplayedDesc(feature.description.slice(0, descIndex))
          } else {
            titleIndex = Math.max(0, titleIndex - 3)
            setDisplayedTitle(feature.title.slice(0, titleIndex))
          }
          setTimeout(type, 8)
        } else {
          setActiveIndex((prev) => (prev + 1) % features.length)
        }
      }
    }

    const timeout = setTimeout(type, 200)
    return () => clearTimeout(timeout)
  }, [activeIndex])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateYValue = (mouseX / (rect.width / 2)) * 12
    const rotateXValue = -(mouseY / (rect.height / 2)) * 12

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const currentFeature = features[activeIndex]

  return (
    <section id="features" className="py-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need to shine
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            From your first portfolio to landing your dream job, we&apos;ve got you covered.
          </p>
        </div>

        {/* 3D Card Container */}
        <div className="relative w-full max-w-3xl mx-auto">
          {/* Subtle glow effect */}
          <div
            className="absolute inset-0 bg-slate-600/10 blur-3xl transition-all duration-700"
            style={{ opacity: isHovered ? 0.3 : 0.1 }}
          />

          {/* 3D Tilt Container */}
          <div
            ref={cardRef}
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Glass Card */}
            <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-3xl p-10 md:p-14 shadow-2xl min-h-[280px] md:min-h-[260px]">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center transition-all duration-500">
                  <div className="text-zinc-900">{currentFeature.icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 min-h-[2.25rem]">
                    {displayedTitle}
                    {isTyping && displayedDesc.length === 0 && (
                      <span className="animate-pulse text-slate-400">|</span>
                    )}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed min-h-[4.5rem]">
                    {displayedDesc}
                    {isTyping && displayedDesc.length > 0 && (
                      <span className="animate-pulse text-slate-400">|</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Feature navigation">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className="h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    style={{
                      width: index === activeIndex ? '2.5rem' : '0.5rem',
                      backgroundColor: index === activeIndex ? 'rgb(255, 255, 255)' : 'rgb(63, 63, 70)',
                    }}
                    aria-label={`Go to feature: ${feature.title}`}
                    aria-selected={index === activeIndex}
                    role="tab"
                  />
                ))}
              </div>
            </div>

            {/* Reflection effect */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.02) 50%, transparent 55%)`,
                transform: 'translateZ(1px)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
