'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const slogans = [
  'Portfolios for Developers',
  'Show Your Code Story',
  'Where Code Meets Design',
  'Stand Out. Get Hired.',
]

export default function RotatingSlogan() {
  const [displayText, setDisplayText] = useState('')
  const currentIndexRef = useRef(0)
  const isTypingRef = useRef(true)

  const tick = useCallback(() => {
    const currentSlogan = slogans[currentIndexRef.current]

    if (isTypingRef.current) {
      setDisplayText(prev => {
        if (prev.length < currentSlogan.length) {
          return currentSlogan.slice(0, prev.length + 1)
        }
        return prev
      })
    } else {
      setDisplayText(prev => {
        if (prev.length > 0) {
          return prev.slice(0, -1)
        }
        return prev
      })
    }
  }, [])

  useEffect(() => {
    const currentSlogan = slogans[currentIndexRef.current]

    if (isTypingRef.current) {
      if (displayText.length < currentSlogan.length) {
        const timeout = setTimeout(tick, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          isTypingRef.current = false
          tick()
        }, 2500)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(tick, 30)
        return () => clearTimeout(timeout)
      } else {
        currentIndexRef.current = (currentIndexRef.current + 1) % slogans.length
        isTypingRef.current = true
        tick()
      }
    }
  }, [displayText, tick])

  return (
    <span className="inline-flex items-center">
      {displayText}
      <span className="ml-0.5 w-[2px] h-4 bg-zinc-400 animate-pulse" />
    </span>
  )
}
