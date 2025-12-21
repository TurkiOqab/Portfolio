import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'DevFolio - Create your professional developer portfolio'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
                    backgroundImage: 'radial-gradient(circle at 25% 25%, #1e293b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #27272a 0%, transparent 50%)',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                            borderRadius: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 48,
                            fontWeight: 'bold',
                            color: 'white',
                            marginRight: 20,
                        }}
                    >
                        D
                    </div>
                    <span
                        style={{
                            fontSize: 64,
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        DevFolio
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 36,
                        color: '#a1a1aa',
                        marginBottom: 60,
                        textAlign: 'center',
                        maxWidth: 800,
                    }}
                >
                    Create your professional developer portfolio in minutes
                </div>

                {/* Features */}
                <div
                    style={{
                        display: 'flex',
                        gap: 40,
                    }}
                >
                    {['Beautiful Themes', 'Easy Setup', 'Free Forever'].map((feature) => (
                        <div
                            key={feature}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                color: '#71717a',
                                fontSize: 24,
                            }}
                        >
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            {feature}
                        </div>
                    ))}
                </div>

                {/* URL */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 20,
                        color: '#52525b',
                    }}
                >
                    devfolio.app
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
