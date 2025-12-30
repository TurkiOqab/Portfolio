/**
 * Simple in-memory rate limiter
 * Note: In production with multiple instances, use Redis instead
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    limit: number
    /** Time window in seconds */
    windowSeconds: number
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    resetIn: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Result with success status and remaining requests
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now()
    const windowMs = config.windowSeconds * 1000
    const key = identifier

    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetTime) {
        // First request or window expired
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + windowMs,
        })
        return {
            success: true,
            remaining: config.limit - 1,
            resetIn: config.windowSeconds,
        }
    }

    if (entry.count >= config.limit) {
        // Rate limit exceeded
        return {
            success: false,
            remaining: 0,
            resetIn: Math.ceil((entry.resetTime - now) / 1000),
        }
    }

    // Increment count
    entry.count++
    return {
        success: true,
        remaining: config.limit - entry.count,
        resetIn: Math.ceil((entry.resetTime - now) / 1000),
    }
}

// Preset configurations for common use cases
export const RATE_LIMITS = {
    // Auth endpoints: 5 attempts per minute
    auth: { limit: 5, windowSeconds: 60 },
    // API endpoints: 60 requests per minute
    api: { limit: 60, windowSeconds: 60 },
    // Signup: 3 attempts per hour
    signup: { limit: 3, windowSeconds: 3600 },
    // Password reset: 3 attempts per hour
    passwordReset: { limit: 3, windowSeconds: 3600 },
    // Email verification: 3 attempts per hour per email
    emailVerification: { limit: 3, windowSeconds: 3600 },
    // CV parsing: 10 attempts per hour per user (expensive API call)
    cvParsing: { limit: 10, windowSeconds: 3600 },
    // Email check: 20 requests per minute per IP (prevent enumeration)
    emailCheck: { limit: 20, windowSeconds: 60 },
    // Token verification: 10 attempts per minute per IP (prevent brute-force)
    tokenVerification: { limit: 10, windowSeconds: 60 },
} as const
