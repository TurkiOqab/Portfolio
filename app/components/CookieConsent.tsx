'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already consented
        const hasConsent = localStorage.getItem('cookie_consent')
        if (!hasConsent) {
            // Small delay to prevent flash on page load
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted')
        localStorage.setItem('cookie_consent_date', new Date().toISOString())
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined')
        localStorage.setItem('cookie_consent_date', new Date().toISOString())
        // Clear any existing tracking data
        localStorage.removeItem('devfolio_visitor_id')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-zinc-300">
                        We use cookies and similar technologies to track portfolio views and likes.{' '}
                        <Link href="/privacy#cookies" className="text-white underline hover:no-underline">
                            Learn more
                        </Link>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 text-sm bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}
