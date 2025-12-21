/**
 * Clipboard utility functions
 */

/**
 * Copies text to clipboard with fallback for older browsers
 * @param text - The text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
    } catch (err) {
        console.error('Failed to copy to clipboard:', err)
        return false
    }
}

/**
 * Gets the full URL for a relative path
 * @param path - The relative path
 * @returns Full URL with origin
 */
export function getFullUrl(path: string): string {
    if (typeof window === 'undefined') return path
    return `${window.location.origin}${path}`
}
