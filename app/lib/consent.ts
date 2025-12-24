/**
 * Shared consent and visitor ID utilities
 * Used by ViewTracker and LikeButton components
 */

/**
 * Check if user has accepted cookie consent
 */
export function hasConsent(): boolean {
    if (typeof window === "undefined") return false;
    const consent = localStorage.getItem("cookie_consent");
    return consent === "accepted";
}

/**
 * Get or create a visitor ID for analytics
 * Only creates/stores if user has consented
 */
export function getVisitorId(): string {
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
