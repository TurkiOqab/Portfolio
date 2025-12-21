import { ImageResponse } from 'next/og'
import { createClient } from '@/app/lib/supabase/server'

export const runtime = 'edge'

export const alt = 'Portfolio'
export const size = {
    width: 1200,
    height: 600,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const supabase = await createClient()

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
                        background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
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
        .select('name, title, bio, avatar_url')
        .eq('user_id', profile.id)
        .single()

    const name = portfolio?.name || username
    const title = portfolio?.title || 'Developer'
    const avatarUrl = portfolio?.avatar_url

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
                    background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)',
                    position: 'relative',
                }}
            >
                {/* Background gradient orbs */}
                <div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '10%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
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
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt={name}
                            width={120}
                            height={120}
                            style={{
                                borderRadius: '60px',
                                border: '4px solid rgba(139, 92, 246, 0.5)',
                                marginBottom: '20px',
                            }}
                        />
                    )}

                    {/* Name */}
                    <div
                        style={{
                            fontSize: 56,
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '8px',
                            textAlign: 'center',
                        }}
                    >
                        {name}
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 28,
                            background: 'linear-gradient(90deg, #a78bfa, #c084fc)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </div>

                    {/* DevFolio branding */}
                    <div
                        style={{
                            fontSize: 18,
                            color: '#71717a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span style={{ color: '#a78bfa' }}>DevFolio</span>
                        <span>|</span>
                        <span>@{username}</span>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}
