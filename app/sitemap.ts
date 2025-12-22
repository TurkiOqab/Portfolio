import { createClient } from '@/app/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dfolio.dev'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/refund`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Dynamic portfolio pages
    try {
        const supabase = await createClient()

        const { data: portfolios } = await supabase
            .from('portfolios')
            .select(`
                updated_at,
                profiles!inner(username)
            `)
            .eq('is_published', true)

        const portfolioPages: MetadataRoute.Sitemap = (portfolios || []).map((portfolio) => {
            const profiles = portfolio.profiles as unknown as { username: string }
            return {
                url: `${baseUrl}/${profiles.username}`,
                lastModified: new Date(portfolio.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }
        })

        return [...staticPages, ...portfolioPages]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return staticPages
    }
}
