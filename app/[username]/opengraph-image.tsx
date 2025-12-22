import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export const alt = 'Portfolio'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

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
        .select('name, title, bio, skills')
        .eq('user_id', profile.id)
        .single()

    const title = portfolio?.title || 'Developer'
    const bio = portfolio?.bio || 'A passionate developer crafting digital experiences.'
    const skills = (portfolio?.skills || ['JavaScript', 'React', 'Node.js']).slice(0, 6)

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0c0c0c',
                    padding: '40px',
                }}
            >
                {/* Browser Window */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#18181b',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #27272a',
                    }}
                >
                    {/* Browser Chrome */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px 20px',
                            backgroundColor: '#1f1f23',
                            borderBottom: '1px solid #27272a',
                            gap: '12px',
                        }}
                    >
                        {/* Traffic Lights */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#ef4444' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#eab308' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#22c55e' }} />
                        </div>
                        {/* URL Bar */}
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#27272a',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                marginLeft: '20px',
                                marginRight: '20px',
                            }}
                        >
                            <span style={{ color: '#22c55e', marginRight: '8px', fontSize: '14px' }}>🔒</span>
                            <span style={{ color: '#a1a1aa', fontSize: '14px' }}>dfolio.dev/{username}</span>
                        </div>
                    </div>

                    {/* Browser Content */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 60px',
                            backgroundColor: '#09090b',
                        }}
                    >
                        {/* Title */}
                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: '20px',
                                textAlign: 'center',
                                letterSpacing: '-2px',
                            }}
                        >
                            {title}
                        </div>

                        {/* Bio */}
                        <div
                            style={{
                                fontSize: 24,
                                color: '#a1a1aa',
                                textAlign: 'center',
                                maxWidth: '800px',
                                marginBottom: '40px',
                                lineHeight: 1.4,
                            }}
                        >
                            {bio.length > 100 ? bio.substring(0, 100) + '...' : bio}
                        </div>

                        {/* Skills */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '16px',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                marginBottom: '40px',
                            }}
                        >
                            {skills.map((skill: string) => (
                                <div
                                    key={skill}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#d4d4d8',
                                        fontSize: '18px',
                                    }}
                                >
                                    <span>{skill}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '16px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '14px 28px',
                                    backgroundColor: 'white',
                                    color: '#09090b',
                                    borderRadius: '50px',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                }}
                            >
                                View My Work
                                <span style={{ marginLeft: '4px' }}>→</span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '14px 28px',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    borderRadius: '50px',
                                    fontSize: '18px',
                                    fontWeight: 500,
                                    border: '1px solid #3f3f46',
                                }}
                            >
                                Contact Me
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}
