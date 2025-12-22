import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Dfolio - Create your professional developer portfolio'
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
                    position: 'relative',
                }}
            >
                {/* Subtle gradient orbs */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-200px',
                        left: '100px',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(71, 85, 105, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-200px',
                        right: '100px',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(63, 63, 70, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
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
                    {/* Brand */}
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 700,
                            color: 'white',
                            letterSpacing: '-2px',
                            marginBottom: 24,
                        }}
                    >
                        Dfolio
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 32,
                            color: '#a1a1aa',
                            textAlign: 'center',
                            maxWidth: 700,
                            lineHeight: 1.4,
                        }}
                    >
                        Developer portfolios, done right.
                    </div>

                    {/* Accent line */}
                    <div
                        style={{
                            width: 80,
                            height: 4,
                            background: 'linear-gradient(to right, #64748b, #475569)',
                            borderRadius: 2,
                            marginTop: 48,
                        }}
                    />
                </div>

                {/* URL */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 48,
                        fontSize: 18,
                        color: '#52525b',
                        letterSpacing: '0.5px',
                    }}
                >
                    dfolio.dev
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
