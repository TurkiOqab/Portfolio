/**
 * Shared date formatting utilities
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Format a date string (YYYY-MM) to display format (e.g., "Jan 2024")
 * Used for experience dates
 */
export function formatMonthYear(dateStr: string): string {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    if (!year || !month) return ''
    const monthIndex = parseInt(month) - 1
    if (monthIndex < 0 || monthIndex > 11) return ''
    return `${MONTHS[monthIndex]} ${year}`
}

/**
 * Format a date string or Date object to MM/YYYY format
 * Used for project dates
 */
export function formatProjectDate(dateString?: string): string {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
}

/**
 * Format a date for display with full month name
 */
export function formatFullDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}
