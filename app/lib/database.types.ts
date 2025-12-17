// Database types for DevFolio

export interface Profile {
    id: string
    username: string
    created_at: string
    updated_at: string
}

export interface Portfolio {
    id: string
    user_id: string
    name: string
    title: string | null
    bio: string | null
    skills: string[]
    contact: ContactInfo
    theme: string
    is_published: boolean
    created_at: string
    updated_at: string
}

export interface PortfolioProject {
    id: string
    portfolio_id: string
    title: string
    description: string | null
    tags: string[]
    live_url: string | null
    github_url: string | null
    display_order: number
    created_at: string
}

export interface ContactInfo {
    email: string
    github?: string
    linkedin?: string
    twitter?: string
}

// Database response types with joins
export interface ProfileWithPortfolio extends Profile {
    portfolios: Portfolio | null
}

export interface PortfolioWithProjects extends Portfolio {
    projects: PortfolioProject[]
}

// Full portfolio data for display
export interface FullPortfolioData {
    profile: Profile
    portfolio: Portfolio
    projects: PortfolioProject[]
}
