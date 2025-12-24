"use client";

import { useEffect } from "react";
import { hasConsent, getVisitorId } from "../lib/consent";

interface ViewTrackerProps {
    portfolioId: string;
}

export default function ViewTracker({ portfolioId }: ViewTrackerProps) {
    useEffect(() => {
        const trackView = async () => {
            // Respect user cookie consent preference
            if (!hasConsent()) return;

            const visitorId = getVisitorId();
            if (!visitorId) return;

            try {
                await fetch("/api/track-view", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        portfolioId,
                        visitorId,
                        referrer: document.referrer || null,
                    }),
                });
            } catch {
                // Silently fail - view tracking should not affect user experience
            }
        };

        trackView();
    }, [portfolioId]);

    // This component doesn't render anything
    return null;
}
