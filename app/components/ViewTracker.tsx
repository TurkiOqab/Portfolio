"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
    portfolioId: string;
}

function getVisitorId(): string {
    if (typeof window === "undefined") return "";

    let visitorId = localStorage.getItem("devfolio_visitor_id");
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("devfolio_visitor_id", visitorId);
    }
    return visitorId;
}

export default function ViewTracker({ portfolioId }: ViewTrackerProps) {
    useEffect(() => {
        const trackView = async () => {
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
