import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// Create a simple Supabase client for edge runtime (no cookies needed for public data)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const alt = 'Portfolio'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

// Theme colors for OG images (hex values since we can't use Tailwind)
const themeColors: Record<string, { primary: string; accent: string; orb: string }> = {
    violet: { primary: '#7c3aed', accent: '#a78bfa', orb: 'rgba(124, 58, 237, 0.2)' },
    blue: { primary: '#2563eb', accent: '#60a5fa', orb: 'rgba(37, 99, 235, 0.2)' },
    emerald: { primary: '#059669', accent: '#34d399', orb: 'rgba(5, 150, 105, 0.2)' },
    rose: { primary: '#e11d48', accent: '#fb7185', orb: 'rgba(225, 29, 72, 0.2)' },
    cyan: { primary: '#0891b2', accent: '#22d3ee', orb: 'rgba(8, 145, 178, 0.2)' },
    orange: { primary: '#ea580c', accent: '#fb923c', orb: 'rgba(234, 88, 12, 0.2)' },
    slate: { primary: '#64748b', accent: '#94a3b8', orb: 'rgba(71, 85, 105, 0.2)' },
    white: { primary: '#ffffff', accent: '#e4e4e7', orb: 'rgba(255, 255, 255, 0.1)' },
}

function getThemeColors(themeId: string) {
    return themeColors[themeId] || themeColors.slate
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params

    // Fetch profile and portfolio
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()

    if (!profile) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 48,
                        background: '#09090b',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#71717a',
                    }}
                >
                    Portfolio Not Found
                </div>
            ),
            { ...size }
        )
    }

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('name, title, bio, avatar_url, theme')
        .eq('user_id', profile.id)
        .single()

    const name = portfolio?.name || username
    const title = portfolio?.title || 'Developer'
    const avatarUrl = portfolio?.avatar_url
    const initial = name.charAt(0).toUpperCase()
    const colors = getThemeColors(portfolio?.theme || 'slate')

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#09090b',
                    position: 'relative',
                }}
            >
                {/* Theme-colored gradient orbs */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        left: '50px',
                        width: '500px',
                        height: '500px',
                        background: `radial-gradient(circle, ${colors.orb} 0%, transparent 70%)`,
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-100px',
                        right: '50px',
                        width: '400px',
                        height: '400px',
                        background: `radial-gradient(circle, ${colors.orb} 0%, transparent 70%)`,
                        borderRadius: '50%',
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    {/* Avatar */}
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            width={120}
                            height={120}
                            style={{
                                borderRadius: '60px',
                                border: `3px solid ${colors.primary}40`,
                                marginBottom: '28px',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '60px',
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 48,
                                fontWeight: 'bold',
                                color: 'white',
                                marginBottom: '28px',
                            }}
                        >
                            {initial}
                        </div>
                    )}

                    {/* Name */}
                    <div
                        style={{
                            fontSize: 56,
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: '12px',
                            textAlign: 'center',
                            letterSpacing: '-1px',
                        }}
                    >
                        {name}
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 28,
                            color: colors.accent,
                            marginBottom: '32px',
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </div>

                    {/* Accent line */}
                    <div
                        style={{
                            width: 60,
                            height: 3,
                            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                            borderRadius: 2,
                        }}
                    />
                </div>

                {/* Footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: 18,
                        color: '#52525b',
                    }}
                >
                    <span style={{ color: colors.accent }}>dfolio.dev</span>
                    <span>/</span>
                    <span>{username}</span>
                </div>
            </div>
        ),
        { ...size }
    )
}
