import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Magic bytes for file type detection
const FILE_SIGNATURES: Record<string, { bytes: number[]; offset?: number }[]> = {
    // Images
    'image/jpeg': [{ bytes: [0xFF, 0xD8, 0xFF] }],
    'image/png': [{ bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],
    'image/gif': [{ bytes: [0x47, 0x49, 0x46, 0x38] }], // GIF87a or GIF89a
    'image/webp': [{ bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }],
    // PDF
    'application/pdf': [{ bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
}

// Allowed file types for each upload type
const ALLOWED_TYPES: Record<string, string[]> = {
    avatar: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    cv: ['application/pdf'],
}

// Max file sizes in bytes
const MAX_SIZES: Record<string, number> = {
    avatar: 5 * 1024 * 1024, // 5MB
    cv: 10 * 1024 * 1024, // 10MB
}

function checkMagicBytes(buffer: ArrayBuffer, expectedType: string): boolean {
    const signatures = FILE_SIGNATURES[expectedType]
    if (!signatures) return false

    const uint8Array = new Uint8Array(buffer)

    return signatures.every(sig => {
        const offset = sig.offset || 0
        return sig.bytes.every((byte, index) => uint8Array[offset + index] === byte)
    })
}

function detectFileType(buffer: ArrayBuffer): string | null {
    for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
        const uint8Array = new Uint8Array(buffer)
        const matches = signatures.every(sig => {
            const offset = sig.offset || 0
            return sig.bytes.every((byte, index) => uint8Array[offset + index] === byte)
        })
        if (matches) return mimeType
    }
    return null
}

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const uploadType = formData.get('type') as string | null // 'avatar' or 'cv'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (!uploadType || !ALLOWED_TYPES[uploadType]) {
            return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
        }

        // Check file size
        const maxSize = MAX_SIZES[uploadType]
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB` },
                { status: 400 }
            )
        }

        // Check declared MIME type
        const allowedTypes = ALLOWED_TYPES[uploadType]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` },
                { status: 400 }
            )
        }

        // Read file bytes for magic byte verification
        const buffer = await file.arrayBuffer()

        // Verify magic bytes match declared type
        const detectedType = detectFileType(buffer)

        if (!detectedType) {
            return NextResponse.json(
                { error: 'Could not verify file type. File may be corrupted or invalid.' },
                { status: 400 }
            )
        }

        if (!allowedTypes.includes(detectedType)) {
            return NextResponse.json(
                { error: 'File content does not match declared type. Upload rejected for security.' },
                { status: 400 }
            )
        }

        // Additional check: verify declared type matches detected type
        if (file.type !== detectedType) {
            // Allow some flexibility for image subtypes
            const isImageMismatch = file.type.startsWith('image/') && detectedType.startsWith('image/')
            if (!isImageMismatch) {
                return NextResponse.json(
                    { error: 'File type mismatch detected. Upload rejected for security.' },
                    { status: 400 }
                )
            }
        }

        // For SVG files, check for embedded scripts (if we ever allow SVG)
        // Currently SVG is not in allowed types, so this is defense in depth
        if (detectedType === 'image/svg+xml') {
            const text = new TextDecoder().decode(buffer)
            if (/<script/i.test(text) || /on\w+\s*=/i.test(text) || /javascript:/i.test(text)) {
                return NextResponse.json(
                    { error: 'SVG contains potentially malicious content' },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json({
            valid: true,
            detectedType,
            size: file.size,
        })
    } catch (error) {
        console.error('File validation error:', error)
        return NextResponse.json(
            { error: 'Failed to validate file' },
            { status: 500 }
        )
    }
}
