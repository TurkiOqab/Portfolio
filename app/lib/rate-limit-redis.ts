/**
 * Redis-based rate limiter for production use
 *
 * This module provides a scalable rate limiting solution that:
 * 1. Uses Redis when UPSTASH_REDIS_REST_URL is configured
 * 2. Falls back to in-memory rate limiting for development
 *
 * To enable Redis rate limiting:
 * 1. Create a free Upstash Redis database at https://upstash.com
 * 2. Add these environment variables:
 *    - UPSTASH_REDIS_REST_URL
 *    - UPSTASH_REDIS_REST_TOKEN
 */

import { rateLimit as inMemoryRateLimit, RateLimitConfig, RateLimitResult, RATE_LIMITS } from './rate-limit'

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const isRedisConfigured = REDIS_URL && REDIS_TOKEN

/**
 * Redis-based rate limit check using Upstash REST API
 */
async function redisRateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    if (!REDIS_URL || !REDIS_TOKEN) {
        // Fallback to in-memory if Redis not configured
        return inMemoryRateLimit(identifier, config)
    }

    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const windowMs = config.windowSeconds * 1000

    try {
        // Use Upstash REST API for atomic operations
        const response = await fetch(`${REDIS_URL}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${REDIS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                // Get current count
                ['GET', key],
                // Increment count
                ['INCR', key],
                // Set expiry if key is new
                ['EXPIRE', key, config.windowSeconds, 'NX'],
                // Get TTL
                ['TTL', key],
            ]),
        })

        if (!response.ok) {
            console.error('Redis rate limit error:', await response.text())
            return inMemoryRateLimit(identifier, config)
        }

        const results = await response.json()
        const currentCount = results[0]?.result ? parseInt(results[0].result) : 0
        const newCount = results[1]?.result || 1
        const ttl = results[3]?.result || config.windowSeconds

        if (newCount > config.limit) {
            return {
                success: false,
                remaining: 0,
                resetIn: ttl,
            }
        }

        return {
            success: true,
            remaining: config.limit - newCount,
            resetIn: ttl,
        }
    } catch (error) {
        console.error('Redis rate limit error:', error)
        // Fallback to in-memory on error
        return inMemoryRateLimit(identifier, config)
    }
}

/**
 * Rate limit function that uses Redis when available, in-memory otherwise
 */
export async function rateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    if (isRedisConfigured) {
        return redisRateLimit(identifier, config)
    }
    return inMemoryRateLimit(identifier, config)
}

/**
 * Check if Redis is being used for rate limiting
 */
export function isUsingRedis(): boolean {
    return !!isRedisConfigured
}

// Re-export rate limit configurations
export { RATE_LIMITS }
export type { RateLimitConfig, RateLimitResult }
