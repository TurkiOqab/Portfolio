// Font configuration for portfolio themes

export interface FontConfig {
    id: string;
    name: string;
    displayName: string;
    category: string;
    preview: string;
    className: string;
}

// 10 carefully selected fonts for portfolios
export const fontList: FontConfig[] = [
    {
        id: "inter",
        name: "Inter",
        displayName: "Inter",
        category: "Modern & Clean",
        preview: "The quick brown fox jumps",
        className: "font-inter",
    },
    {
        id: "space-grotesk",
        name: "Space Grotesk",
        displayName: "Space Grotesk",
        category: "Tech & Futuristic",
        preview: "The quick brown fox jumps",
        className: "font-space-grotesk",
    },
    {
        id: "syne",
        name: "Syne",
        displayName: "Syne",
        category: "Bold & Creative",
        preview: "The quick brown fox jumps",
        className: "font-syne",
    },
    {
        id: "outfit",
        name: "Outfit",
        displayName: "Outfit",
        category: "Geometric & Minimal",
        preview: "The quick brown fox jumps",
        className: "font-outfit",
    },
    {
        id: "plus-jakarta",
        name: "Plus Jakarta Sans",
        displayName: "Jakarta Sans",
        category: "Professional",
        preview: "The quick brown fox jumps",
        className: "font-plus-jakarta",
    },
    {
        id: "cabinet-grotesk",
        name: "DM Sans",
        displayName: "DM Sans",
        category: "Elegant & Readable",
        preview: "The quick brown fox jumps",
        className: "font-dm-sans",
    },
    {
        id: "clash-display",
        name: "Bebas Neue",
        displayName: "Bebas Neue",
        category: "Display & Impact",
        preview: "The quick brown fox jumps",
        className: "font-bebas-neue",
    },
    {
        id: "source-code",
        name: "Source Code Pro",
        displayName: "Source Code",
        category: "Developer & Mono",
        preview: "The quick brown fox jumps",
        className: "font-source-code",
    },
    {
        id: "playfair",
        name: "Playfair Display",
        displayName: "Playfair",
        category: "Elegant & Serif",
        preview: "The quick brown fox jumps",
        className: "font-playfair",
    },
    {
        id: "unbounded",
        name: "Unbounded",
        displayName: "Unbounded",
        category: "Unique & Expressive",
        preview: "The quick brown fox jumps",
        className: "font-unbounded",
    },
];

export function getFont(fontId: string): FontConfig {
    return fontList.find(f => f.id === fontId) || fontList[0];
}
