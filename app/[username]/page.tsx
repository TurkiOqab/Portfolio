import { createClient } from '@/app/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTheme } from '@/app/lib/themes'
import { getFont } from '@/app/lib/fonts'
import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/Hero'
import EducationSection from '@/app/components/Education'
import ExperienceSection from '@/app/components/Experience'
import Projects from '@/app/components/Projects'
import Footer from '@/app/components/Footer'
import ViewTracker from '@/app/components/ViewTracker'

// Force dynamic rendering to check authentication on each request
export const dynamic = 'force-dynamic'

// Sanitize string for JSON-LD to prevent script injection
function sanitizeForJsonLd(value: string | undefined | null): string | undefined {
    if (!value) return undefined

    const sanitized = value
        // Remove script tags (case-insensitive, handles variations)
        .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
        // Remove standalone script tags
        .replace(/<\s*\/?\s*script[^>]*>/gi, '')
        // Remove event handlers (onclick, onload, onerror, etc.)
        .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
        // Remove dangerous URL schemes
        .replace(/javascript\s*:/gi, '')
        .replace(/vbscript\s*:/gi, '')
        .replace(/data\s*:/gi, '')
        // Escape sequences that could break out of script context
        // This is critical for JSON-LD in <script> tags
        .replace(/<\//g, '<\\/')

    return sanitized.trim()
}

interface PageProps {
    params: Promise<{ username: string }>
}

export default async function PortfolioPage({ params }: PageProps) {
    const { username } = await params
    const supabase = await createClient()

    // Get current logged-in user
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Fetch profile with portfolio
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()

    if (!profile) {
        notFound()
    }

    // Check if current user is the owner
    const isOwner = currentUser?.id === profile.id

    // Fetch portfolio for this user
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', profile.id)
        .single()

    if (!portfolio) {
        // User exists but hasn't completed onboarding
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Portfolio Coming Soon</h1>
                    <p className="text-zinc-400">@{username} is setting up their portfolio</p>
                </div>
            </div>
        )
    }

    // Get theme and font
    const theme = getTheme(portfolio.theme || 'slate')
    const font = getFont(portfolio.font || 'outfit')

    // Fetch projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('display_order', { ascending: true })

    // Transform data for components
    const portfolioData = {
        name: portfolio.name,
        title: portfolio.title || '',
        bio: portfolio.bio || '',
        skills: portfolio.skills || [],
        education: portfolio.education || [],
        experience: portfolio.experience || [],
        projects: (projects || []).map(p => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            tags: p.tags || [],
            imageUrl: p.image_url || undefined,
            liveUrl: p.live_url || undefined,
            githubUrl: p.github_url || undefined,
            startDate: p.start_date || undefined,
            endDate: p.end_date || undefined,
        })),
        contact: portfolio.contact || { email: '' },
    }

    // JSON-LD structured data for person/portfolio (sanitized to prevent XSS)
    const personJsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: sanitizeForJsonLd(portfolio.name),
        description: sanitizeForJsonLd(portfolio.bio),
        url: `https://dfolio.dev/${username}`,
        image: sanitizeForJsonLd(portfolio.avatar_url),
        jobTitle: sanitizeForJsonLd(portfolio.title),
        sameAs: [
            sanitizeForJsonLd(portfolioData.contact.github),
            sanitizeForJsonLd(portfolioData.contact.linkedin),
            sanitizeForJsonLd(portfolioData.contact.twitter),
        ].filter(Boolean),
    }

    const isLightMode = theme.mode === 'light';

    return (
        <div className={`min-h-screen ${theme.bgPrimary} relative overflow-x-hidden ${font.className}`}>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />

            {/* Track views for non-owners */}
            {!isOwner && <ViewTracker portfolioId={portfolio.id} />}

            {/* Global Background Effects - using transform for GPU acceleration to prevent mobile scroll artifacts */}
            <div className={`fixed inset-0 ${isLightMode ? 'bg-gradient-to-br from-white via-zinc-50 to-white' : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'} z-0 transform-gpu`} />
            <div className={`fixed top-1/4 left-1/4 w-96 h-96 ${theme.orb1} rounded-full blur-3xl animate-pulse z-0 pointer-events-none hidden sm:block`} />
            <div className={`fixed bottom-1/4 right-1/4 w-96 h-96 ${theme.orb2} rounded-full blur-3xl animate-pulse z-0 pointer-events-none hidden sm:block`} />

            {/* Grid Pattern - hidden on mobile to prevent scroll artifacts */}
            <div
                className={`fixed inset-0 ${isLightMode ? 'opacity-30' : 'opacity-10'} z-0 pointer-events-none hidden sm:block`}
                style={{
                    backgroundImage: isLightMode
                        ? `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`
                        : `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10">
                <Navbar theme={theme} isOwner={isOwner} />
                <main>
                    <Hero
                        name={portfolioData.name}
                        title={portfolioData.title}
                        bio={portfolioData.bio}
                        skills={portfolioData.skills}
                        theme={theme}
                    />
                    <EducationSection education={portfolioData.education} theme={theme} />
                    <ExperienceSection experience={portfolioData.experience} theme={theme} />
                    <Projects projects={portfolioData.projects} theme={theme} />
                </main>
                <Footer contact={portfolioData.contact} name={portfolioData.name} theme={theme} cvUrl={portfolio.cv_url} portfolioId={portfolio.id} username={username} isOwner={isOwner} />
            </div>
        </div>
    )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const { username } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()

    if (!profile) {
        return { title: 'Not Found | Dfolio' }
    }

    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('name, title, bio, avatar_url')
        .eq('user_id', profile.id)
        .single()

    const title = portfolio ? `${portfolio.name} | Dfolio` : `@${username} | Dfolio`
    const description = portfolio?.bio || `Check out ${username}'s developer portfolio on Dfolio`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'profile',
            url: `https://dfolio.dev/${username}`,
            siteName: 'Dfolio',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    }
}
