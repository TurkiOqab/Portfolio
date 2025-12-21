/**
 * Client-side image compression utility
 * Compresses images before upload to reduce storage and improve load times
 */

export interface CompressionOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    type?: 'image/jpeg' | 'image/png' | 'image/webp'
}

const defaultOptions: CompressionOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    type: 'image/jpeg',
}

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with compressed file
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const opts = { ...defaultOptions, ...options }

    return new Promise((resolve, reject) => {
        // Skip compression for small files (< 100KB)
        if (file.size < 100 * 1024) {
            resolve(file)
            return
        }

        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
        }

        img.onload = () => {
            let { width, height } = img

            // Calculate new dimensions while maintaining aspect ratio
            if (width > opts.maxWidth! || height > opts.maxHeight!) {
                const ratio = Math.min(
                    opts.maxWidth! / width,
                    opts.maxHeight! / height
                )
                width = Math.round(width * ratio)
                height = Math.round(height * ratio)
            }

            canvas.width = width
            canvas.height = height

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height)

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'))
                        return
                    }

                    // Create new file from blob
                    const compressedFile = new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, '.jpg'),
                        { type: opts.type }
                    )

                    // Only use compressed version if it's smaller
                    if (compressedFile.size < file.size) {
                        resolve(compressedFile)
                    } else {
                        resolve(file)
                    }
                },
                opts.type,
                opts.quality
            )
        }

        img.onerror = () => {
            reject(new Error('Failed to load image'))
        }

        // Load image from file
        const reader = new FileReader()
        reader.onload = (e) => {
            img.src = e.target?.result as string
        }
        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }
        reader.readAsDataURL(file)
    })
}

/**
 * Compress image for avatar (smaller size, square crop)
 */
export async function compressAvatar(file: File): Promise<File> {
    return compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        type: 'image/jpeg',
    })
}

/**
 * Compress image for project thumbnail
 */
export async function compressProjectImage(file: File): Promise<File> {
    return compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        type: 'image/jpeg',
    })
}
