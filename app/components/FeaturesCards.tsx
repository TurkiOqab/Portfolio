'use client'

import { useState, useEffect } from 'react'

const features = [
  {
    title: 'Lightning Fast Setup',
    description: 'Be live in under 5 minutes. Our guided wizard makes it simple to create a stunning portfolio that showcases your work professionally.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/25',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    title: 'Your Own URL',
    description: 'Get a personalized URL like devfolio.com/yourname that you can share anywhere. Make it easy for recruiters and clients to find you.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    gradient: 'from-cyan-500 to-blue-500',
    shadow: 'shadow-cyan-500/25',
    glowColor: 'rgba(6, 182, 212, 0.15)',
  },
  {
    title: 'Beautiful Designs',
    description: 'Modern, responsive designs that look great on any device. No design skills needed — just fill in your details and watch your portfolio come to life.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/25',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
]

export default function FeaturesCards() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    // Stagger the appearance of each card
    features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index])
      }, index * 400) // 400ms delay between each card
    })
  }, [])

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

        {/* Cards - Stacked Vertically */}
        <div className="space-y-6">
          {features.map((feature, index) => {
            const isVisible = visibleCards.includes(index)

            return (
              <div
                key={index}
                className="transition-all duration-700 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                }}
              >
                <div
                  className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-14 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300"
                  style={{
                    boxShadow: `0 25px 50px -12px ${feature.glowColor}`,
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg ${feature.shadow}`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-zinc-400 text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
