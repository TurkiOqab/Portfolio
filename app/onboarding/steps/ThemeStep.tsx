"use client";

import { PortfolioData } from "../../types";
import { themeList, ThemeConfig, getTheme } from "../../lib/themes";
import { fontList, FontConfig, getFont } from "../../lib/fonts";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

function LivePreview({ theme, font, name }: { theme: ThemeConfig; font: FontConfig; name: string }) {
    return (
        <div className={`relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 ${font.className}`}>
            {/* Background orbs */}
            <div className={`absolute top-0 left-1/4 w-64 h-64 ${theme.orb1} rounded-full blur-3xl`} />
            <div className={`absolute bottom-0 right-1/4 w-64 h-64 ${theme.orb2} rounded-full blur-3xl`} />

            {/* Content */}
            <div className="relative z-10 p-8">
                {/* Hero section mockup */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto mb-4" />
                    <h2 className={`text-2xl font-bold bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
                        {name || "Your Name"}
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">Full Stack Developer</p>
                </div>

                {/* Skills mockup */}
                <div className="flex justify-center gap-2 mb-6">
                    {["React", "Node.js", "TypeScript"].map((skill) => (
                        <span
                            key={skill}
                            className={`px-3 py-1 text-xs rounded-full ${theme.accentColor}/20 ${theme.textAccent}`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Experience timeline mockup */}
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${theme.timelineDot} rounded-full`} />
                    <div className="flex-1">
                        <div className="h-2 w-24 bg-zinc-700 rounded mb-1" />
                        <div className="h-1.5 w-16 bg-zinc-800 rounded" />
                    </div>
                </div>

                {/* Button mockup */}
                <div className="mt-6 flex justify-center">
                    <div className={`px-6 py-2 bg-gradient-to-r ${theme.primaryGradient} rounded-lg ${theme.shadowColor} shadow-lg`}>
                        <span className="text-white text-sm font-medium">Contact Me</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThemePreview({ theme, isSelected, onClick }: {
    theme: ThemeConfig;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                    ? 'border-white bg-zinc-800/50 scale-105'
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:scale-102'
                }`}
        >
            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Color swatches */}
            <div className="flex gap-1 mb-2">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.primaryGradient}`} />
                <div className={`w-6 h-6 rounded-full ${theme.orb1}`} />
                <div className={`w-6 h-6 rounded-full ${theme.orb2}`} />
            </div>

            {/* Theme info */}
            <h3 className="font-medium text-white text-sm">{theme.name}</h3>
        </button>
    );
}

function FontPreview({ font, isSelected, onClick }: {
    font: FontConfig;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${isSelected
                    ? 'border-white bg-white/5'
                    : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
                }`}
        >
            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Large font name as preview */}
            <div className={`${font.className} text-2xl font-semibold text-white mb-3`}>
                {font.displayName}
            </div>

            {/* Sample text in the font */}
            <p className={`${font.className} text-sm text-zinc-400 mb-4 leading-relaxed`}>
                {font.preview}
            </p>

            {/* Category tag */}
            <span className={`inline-block px-2.5 py-1 text-xs rounded-full ${isSelected ? 'bg-white/10 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                {font.category}
            </span>
        </button>
    );
}

export default function ThemeStep({ data, updateData }: StepProps) {
    const selectedThemeId = data.theme || 'violet';
    const selectedTheme = getTheme(selectedThemeId);
    const selectedFontId = data.font || 'outfit';
    const selectedFont = getFont(selectedFontId);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Choose your{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        style
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Pick a color theme and font that represents you
                </p>
            </div>

            {/* Live Preview */}
            <div className="transition-all duration-500">
                <p className="text-sm text-zinc-500 mb-2 text-center">
                    Preview: <span className={`font-medium ${selectedTheme.textAccent}`}>{selectedTheme.name}</span> theme with <span className="font-medium text-violet-400">{selectedFont.displayName}</span> font
                </p>
                <LivePreview theme={selectedTheme} font={selectedFont} name={data.name} />
            </div>

            {/* Theme Selection Grid */}
            <div>
                <p className="text-sm text-zinc-400 mb-3">Select a color theme:</p>
                <div className="grid grid-cols-4 gap-3">
                    {themeList.map((theme) => (
                        <ThemePreview
                            key={theme.id}
                            theme={theme}
                            isSelected={selectedThemeId === theme.id}
                            onClick={() => updateData({ theme: theme.id })}
                        />
                    ))}
                </div>
            </div>

            {/* Font Selection Grid */}
            <div>
                <p className="text-sm text-zinc-400 mb-4">Select a font:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {fontList.map((font) => (
                        <FontPreview
                            key={font.id}
                            font={font}
                            isSelected={selectedFontId === font.id}
                            onClick={() => updateData({ font: font.id })}
                        />
                    ))}
                </div>
            </div>

            {/* Hint */}
            <p className="text-center text-zinc-500 text-sm">
                You can always change this later from your dashboard
            </p>
        </div>
    );
}
