"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
    portfolioId: string;
}

function hasConsent(): boolean {
    if (typeof window === "undefined") return false;
    const consent = localStorage.getItem("cookie_consent");
    return consent === "accepted";
}

function getVisitorId(): string {
    if (typeof window === "undefined") return "";

    // Only create/store visitor ID if user has consented
    if (!hasConsent()) return "";

    let visitorId = localStorage.getItem("dfolio_visitor_id");
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("dfolio_visitor_id", visitorId);
    }
    return visitorId;
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
