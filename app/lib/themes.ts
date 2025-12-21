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
    // Button text color (for primary buttons)
    buttonText: string;
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
        name: 'Violet',
        description: 'Classic purple tones',
        primaryGradient: 'from-violet-600 to-violet-600',
        primaryGradientHover: 'from-violet-500 to-violet-500',
        accentColor: 'bg-violet-600',
        accentColorHover: 'bg-violet-500',
        textAccent: 'text-violet-400',
        buttonText: 'text-white',
        timelineDot: 'bg-violet-500',
        orb1: 'bg-violet-600/10',
        orb2: 'bg-violet-600/10',
        shadowColor: 'shadow-violet-500/20',
    },
    blue: {
        id: 'blue',
        name: 'Blue',
        description: 'Professional blue',
        primaryGradient: 'from-blue-600 to-blue-600',
        primaryGradientHover: 'from-blue-500 to-blue-500',
        accentColor: 'bg-blue-600',
        accentColorHover: 'bg-blue-500',
        textAccent: 'text-blue-400',
        buttonText: 'text-white',
        timelineDot: 'bg-blue-500',
        orb1: 'bg-blue-600/10',
        orb2: 'bg-blue-600/10',
        shadowColor: 'shadow-blue-500/20',
    },
    emerald: {
        id: 'emerald',
        name: 'Emerald',
        description: 'Fresh green',
        primaryGradient: 'from-emerald-600 to-emerald-600',
        primaryGradientHover: 'from-emerald-500 to-emerald-500',
        accentColor: 'bg-emerald-600',
        accentColorHover: 'bg-emerald-500',
        textAccent: 'text-emerald-400',
        buttonText: 'text-white',
        timelineDot: 'bg-emerald-500',
        orb1: 'bg-emerald-600/10',
        orb2: 'bg-emerald-600/10',
        shadowColor: 'shadow-emerald-500/20',
    },
    rose: {
        id: 'rose',
        name: 'Rose',
        description: 'Elegant pink',
        primaryGradient: 'from-rose-600 to-rose-600',
        primaryGradientHover: 'from-rose-500 to-rose-500',
        accentColor: 'bg-rose-600',
        accentColorHover: 'bg-rose-500',
        textAccent: 'text-rose-400',
        buttonText: 'text-white',
        timelineDot: 'bg-rose-500',
        orb1: 'bg-rose-600/10',
        orb2: 'bg-rose-600/10',
        shadowColor: 'shadow-rose-500/20',
    },
    cyan: {
        id: 'cyan',
        name: 'Cyan',
        description: 'Cool cyan',
        primaryGradient: 'from-cyan-600 to-cyan-600',
        primaryGradientHover: 'from-cyan-500 to-cyan-500',
        accentColor: 'bg-cyan-600',
        accentColorHover: 'bg-cyan-500',
        textAccent: 'text-cyan-400',
        buttonText: 'text-white',
        timelineDot: 'bg-cyan-500',
        orb1: 'bg-cyan-600/10',
        orb2: 'bg-cyan-600/10',
        shadowColor: 'shadow-cyan-500/20',
    },
    orange: {
        id: 'orange',
        name: 'Orange',
        description: 'Warm orange',
        primaryGradient: 'from-orange-600 to-orange-600',
        primaryGradientHover: 'from-orange-500 to-orange-500',
        accentColor: 'bg-orange-600',
        accentColorHover: 'bg-orange-500',
        textAccent: 'text-orange-400',
        buttonText: 'text-white',
        timelineDot: 'bg-orange-500',
        orb1: 'bg-orange-600/10',
        orb2: 'bg-orange-600/10',
        shadowColor: 'shadow-orange-500/20',
    },
    slate: {
        id: 'slate',
        name: 'Slate',
        description: 'Neutral gray',
        primaryGradient: 'from-slate-600 to-slate-600',
        primaryGradientHover: 'from-slate-500 to-slate-500',
        accentColor: 'bg-slate-600',
        accentColorHover: 'bg-slate-500',
        textAccent: 'text-slate-400',
        buttonText: 'text-white',
        timelineDot: 'bg-slate-500',
        orb1: 'bg-slate-600/10',
        orb2: 'bg-slate-600/10',
        shadowColor: 'shadow-slate-500/20',
    },
    white: {
        id: 'white',
        name: 'White',
        description: 'Clean monochrome',
        primaryGradient: 'from-white to-zinc-200',
        primaryGradientHover: 'from-zinc-100 to-zinc-300',
        accentColor: 'bg-white',
        accentColorHover: 'bg-zinc-100',
        textAccent: 'text-white',
        buttonText: 'text-zinc-900',
        timelineDot: 'bg-white',
        orb1: 'bg-white/5',
        orb2: 'bg-zinc-300/5',
        shadowColor: 'shadow-white/20',
    },
};

export const themeList = Object.values(themes);

// Map old theme IDs to new ones
const themeMigration: Record<string, string> = {
    // Old gradient themes
    ocean: 'cyan',
    sunset: 'orange',
    forest: 'emerald',
    amber: 'orange',
    // Old minimal themes
    minimal_violet: 'violet',
    minimal_blue: 'blue',
    minimal_emerald: 'emerald',
    minimal_rose: 'rose',
    minimal_cyan: 'cyan',
    minimal_orange: 'orange',
    minimal_red: 'rose',
    minimal_slate: 'slate',
    // Old monochrome themes
    pure_white: 'white',
    pure_black: 'slate',
};

export function getTheme(themeId: string): ThemeConfig {
    // Check if it's an old theme ID that needs migration
    const migratedId = themeMigration[themeId] || themeId;
    return themes[migratedId] || themes.violet;
}
