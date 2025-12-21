'use client'

import { useRef, useState, useEffect } from 'react'
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiPostgresql,
  SiNextdotjs,
} from 'react-icons/si'

const skills = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
]

export default function PortfolioMockup() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [isTypingName, setIsTypingName] = useState(true)

  const nameText = "Hi, I'm John Doe"
  const titleText = "Full-Stack Developer"

  // Typing animation for the mockup
  useEffect(() => {
    const currentFullText = isTypingName ? nameText : titleText
    let currentIndex = 0
    let isDeleting = false

    const type = () => {
      if (!isDeleting && currentIndex <= currentFullText.length) {
        setTypedText(currentFullText.slice(0, currentIndex))
        currentIndex++
      } else if (isDeleting && currentIndex >= 0) {
        setTypedText(currentFullText.slice(0, currentIndex))
        currentIndex--
      }

      if (!isDeleting && currentIndex > currentFullText.length) {
        setTimeout(() => {
          isDeleting = true
          type()
        }, 1500)
        return
      }

      if (isDeleting && currentIndex < 0) {
        isDeleting = false
        setIsTypingName(!isTypingName)
        return
      }

      setTimeout(type, isDeleting ? 50 : 100)
    }

    type()
  }, [isTypingName])

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

  // Render typed text with accent on name
  const renderTypedText = () => {
    if (isTypingName) {
      const hiPart = "Hi, I'm "
      if (typedText.length <= hiPart.length) {
        return <span className="text-white">{typedText}</span>
      }
      return (
        <>
          <span className="text-white">{hiPart}</span>
          <span className="text-slate-400">{typedText.slice(hiPart.length)}</span>
        </>
      )
    }
    return <span className="text-slate-400">{typedText}</span>
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto perspective-1000">
      {/* Glow effect behind the mockup */}
      <div
        className="absolute inset-0 bg-slate-600/10 blur-3xl transition-opacity duration-500"
        style={{ opacity: isHovered ? 0.3 : 0.1 }}
      />

      {/* 3D Mockup Container */}
      <div
        ref={cardRef}
        className="relative transition-transform duration-200 ease-out cursor-pointer"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Browser Frame */}
        <div className="relative bg-zinc-900/90 rounded-2xl border border-zinc-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/80 border-b border-zinc-700/50">
            {/* Traffic lights */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            {/* URL Bar */}
            <div className="flex-1 mx-4">
              <div className="bg-zinc-900/80 rounded-lg px-4 py-1.5 text-sm text-zinc-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>devfolio.com/johndoe</span>
              </div>
            </div>
          </div>

          {/* Portfolio Content - Matching real Hero design */}
          <div className="p-8 md:p-12 bg-zinc-950 min-h-[380px] md:min-h-[420px]">
            <div className="text-center">
              {/* Main Heading with Typewriter */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight min-h-[2.5rem] md:min-h-[3rem]">
                {renderTypedText()}
                <span className="animate-pulse text-slate-400">|</span>
              </h3>

              {/* Bio */}
              <p className="text-base md:text-lg text-zinc-400 mb-8 max-w-xl mx-auto leading-relaxed">
                A passionate developer crafting beautiful digital experiences with modern technologies.
              </p>

              {/* Scrolling Tech Stack */}
              <div className="relative w-full overflow-hidden mb-8">
                <div className="flex animate-scroll">
                  {[...skills, ...skills, ...skills].map((skill, index) => {
                    const Icon = skill.icon
                    return (
                      <div
                        key={`${skill.name}-${index}`}
                        className="flex items-center gap-2 px-6 text-zinc-400 whitespace-nowrap"
                      >
                        <Icon className="w-5 h-5" style={{ color: skill.color }} />
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="px-6 py-3 bg-white rounded-full text-sm text-zinc-900 font-medium flex items-center gap-2">
                  View My Work
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="px-6 py-3 border border-zinc-700 rounded-full text-sm text-zinc-300 font-medium">
                  Contact Me
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)`,
            transform: 'translateZ(1px)',
          }}
        />
      </div>
    </div>
  )
}
