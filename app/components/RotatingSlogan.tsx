'use client'

import { useState, useEffect } from 'react'

const slogans = [
  'Portfolios for Developers',
  'Show Your Code Story',
  'Your Work, Beautifully Presented',
  'Where Code Meets Design',
  'Stand Out. Get Hired.',
]

export default function RotatingSlogan() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentSlogan = slogans[currentIndex]

    if (isTyping) {
      if (displayText.length < currentSlogan.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentSlogan.slice(0, displayText.length + 1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2500)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        setCurrentIndex((prev) => (prev + 1) % slogans.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentIndex])

  return (
    <span className="inline-flex items-center">
      {displayText}
      <span className="ml-0.5 w-[2px] h-4 bg-zinc-400 animate-pulse" />
    </span>
  )
}
