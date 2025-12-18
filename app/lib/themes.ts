// Portfolio Theme Configurations
// Each theme defines colors used throughout the portfolio

export interface ThemeConfig {
    id: string;
    name: string;
    description: string;
    // Primary gradient for headings, buttons, accents
    primaryGradient: string;
    primaryGradientHover: string;
    // Accent color for highlights
    accentColor: string;
    accentColorHover: string;
    // Text accent color
    textAccent: string;
    // Timeline dot color
    timelineDot: string;
    // Glowing orb colors (background effects)
    orb1: string;
    orb2: string;
    // Shadow color for buttons
    shadowColor: string;
}

export const themes: Record<string, ThemeConfig> = {
    violet: {
        id: 'violet',
        name: 'Violet Dreams',
        description: 'Classic purple and violet tones',
        primaryGradient: 'from-violet-600 to-purple-600',
        primaryGradientHover: 'from-violet-500 to-purple-500',
        accentColor: 'bg-violet-600',
        accentColorHover: 'bg-violet-500',
        textAccent: 'text-violet-400',
        timelineDot: 'bg-violet-500',
        orb1: 'bg-violet-600/20',
        orb2: 'bg-purple-600/20',
        shadowColor: 'shadow-purple-500/25',
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Breeze',
        description: 'Cool cyan and blue waves',
        primaryGradient: 'from-cyan-600 to-blue-600',
        primaryGradientHover: 'from-cyan-500 to-blue-500',
        accentColor: 'bg-cyan-600',
        accentColorHover: 'bg-cyan-500',
        textAccent: 'text-cyan-400',
        timelineDot: 'bg-cyan-500',
        orb1: 'bg-cyan-600/20',
        orb2: 'bg-blue-600/20',
        shadowColor: 'shadow-blue-500/25',
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset Glow',
        description: 'Warm orange and pink hues',
        primaryGradient: 'from-orange-500 to-pink-600',
        primaryGradientHover: 'from-orange-400 to-pink-500',
        accentColor: 'bg-orange-500',
        accentColorHover: 'bg-orange-400',
        textAccent: 'text-orange-400',
        timelineDot: 'bg-orange-500',
        orb1: 'bg-orange-600/20',
        orb2: 'bg-pink-600/20',
        shadowColor: 'shadow-orange-500/25',
    },
    forest: {
        id: 'forest',
        name: 'Forest Mist',
        description: 'Natural emerald and teal greens',
        primaryGradient: 'from-emerald-600 to-teal-600',
        primaryGradientHover: 'from-emerald-500 to-teal-500',
        accentColor: 'bg-emerald-600',
        accentColorHover: 'bg-emerald-500',
        textAccent: 'text-emerald-400',
        timelineDot: 'bg-emerald-500',
        orb1: 'bg-emerald-600/20',
        orb2: 'bg-teal-600/20',
        shadowColor: 'shadow-emerald-500/25',
    },
    rose: {
        id: 'rose',
        name: 'Rose Garden',
        description: 'Elegant pink and rose tones',
        primaryGradient: 'from-pink-600 to-rose-600',
        primaryGradientHover: 'from-pink-500 to-rose-500',
        accentColor: 'bg-pink-600',
        accentColorHover: 'bg-pink-500',
        textAccent: 'text-pink-400',
        timelineDot: 'bg-pink-500',
        orb1: 'bg-pink-600/20',
        orb2: 'bg-rose-600/20',
        shadowColor: 'shadow-pink-500/25',
    },
    amber: {
        id: 'amber',
        name: 'Golden Hour',
        description: 'Rich amber and yellow golds',
        primaryGradient: 'from-amber-500 to-yellow-600',
        primaryGradientHover: 'from-amber-400 to-yellow-500',
        accentColor: 'bg-amber-500',
        accentColorHover: 'bg-amber-400',
        textAccent: 'text-amber-400',
        timelineDot: 'bg-amber-500',
        orb1: 'bg-amber-600/20',
        orb2: 'bg-yellow-600/20',
        shadowColor: 'shadow-amber-500/25',
    },
};

export const themeList = Object.values(themes);

export function getTheme(themeId: string): ThemeConfig {
    return themes[themeId] || themes.violet;
}
