// Font configuration for portfolio themes

export interface FontConfig {
    id: string;
    name: string;
    displayName: string;
    category: string;
    preview: string;
    className: string;
}

// 5 curated minimal fonts for portfolios
export const fontList: FontConfig[] = [
    {
        id: "outfit",
        name: "Outfit",
        displayName: "Outfit",
        category: "Geometric",
        preview: "Clean lines, modern feel",
        className: "font-outfit",
    },
    {
        id: "plus-jakarta",
        name: "Plus Jakarta Sans",
        displayName: "Jakarta",
        category: "Professional",
        preview: "Polished and refined",
        className: "font-plus-jakarta",
    },
    {
        id: "dm-sans",
        name: "DM Sans",
        displayName: "DM Sans",
        category: "Elegant",
        preview: "Subtle and sophisticated",
        className: "font-dm-sans",
    },
    {
        id: "syne",
        name: "Syne",
        displayName: "Syne",
        category: "Creative",
        preview: "Bold and distinctive",
        className: "font-syne",
    },
    {
        id: "source-code",
        name: "Source Code Pro",
        displayName: "Source Code",
        category: "Monospace",
        preview: "Built for developers",
        className: "font-source-code",
    },
];

// Map old font IDs to new ones
const fontMigration: Record<string, string> = {
    'inter': 'outfit',
    'space-grotesk': 'outfit',
    'cabinet-grotesk': 'dm-sans',
    'clash-display': 'syne',
    'playfair': 'dm-sans',
    'unbounded': 'syne',
    'bebas-neue': 'syne',
};

export function getFont(fontId: string): FontConfig {
    const migratedId = fontMigration[fontId] || fontId;
    return fontList.find(f => f.id === migratedId) || fontList[0];
}
