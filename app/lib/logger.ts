/**
 * Simple logger utility that only logs in development mode
 * In production, only errors are logged to avoid performance overhead
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
    /**
     * Log debug information (development only)
     */
    debug: (...args: unknown[]) => {
        if (isDevelopment) {
            console.log('[DEBUG]', ...args)
        }
    },

    /**
     * Log general info (development only)
     */
    info: (...args: unknown[]) => {
        if (isDevelopment) {
            console.log('[INFO]', ...args)
        }
    },

    /**
     * Log warnings (always logged)
     */
    warn: (...args: unknown[]) => {
        console.warn('[WARN]', ...args)
    },

    /**
     * Log errors (always logged)
     */
    error: (...args: unknown[]) => {
        console.error('[ERROR]', ...args)
    },
}
