/**
 * Validation utilities for user input
 */

/**
 * Validates a URL string
 * @param url - The URL to validate
 * @param allowedProtocols - Allowed protocols (default: https, http)
 * @returns true if valid, false otherwise
 */
export function isValidUrl(
    url: string,
    allowedProtocols: string[] = ['https:', 'http:']
): boolean {
    if (!url || url.trim() === '') return true // Empty is valid (optional field)

    try {
        const parsed = new URL(url)
        return allowedProtocols.includes(parsed.protocol)
    } catch {
        return false
    }
}

/**
 * Social media URL patterns
 */
const SOCIAL_PATTERNS: Record<string, RegExp> = {
    github: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/i,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w-]+\/?$/i,
}

/**
 * Validates a social media URL
 * @param url - The URL to validate
 * @param platform - The social platform (github, linkedin, twitter)
 * @returns true if valid or empty, false otherwise
 */
export function isValidSocialUrl(
    url: string,
    platform: 'github' | 'linkedin' | 'twitter'
): boolean {
    if (!url || url.trim() === '') return true // Empty is valid (optional field)

    const pattern = SOCIAL_PATTERNS[platform]
    if (!pattern) return false

    return pattern.test(url)
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns Sanitized string
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
    if (!input) return ''

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML brackets
        .slice(0, maxLength)
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns Error message if invalid, null if valid
 */
export function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return 'Password must be at least 8 characters'
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain an uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain a lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain a number'
    }
    return null
}

/**
 * Validates a project/portfolio URL
 * Only allows http/https protocols
 * @param url - The URL to validate
 * @returns true if valid or empty, false otherwise
 */
export function isValidProjectUrl(url: string): boolean {
    if (!url || url.trim() === '') return true // Empty is valid (optional field)

    // Block javascript:, data:, and other dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
    const lowerUrl = url.toLowerCase().trim()

    if (dangerousProtocols.some(p => lowerUrl.startsWith(p))) {
        return false
    }

    return isValidUrl(url, ['https:', 'http:'])
}
