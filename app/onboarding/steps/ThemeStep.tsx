"use client";

import { PortfolioData } from "../../types";
import { themeList, ThemeConfig } from "../../lib/themes";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

function ThemePreview({ theme, isSelected, onClick }: {
    theme: ThemeConfig;
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                    ? 'border-white bg-zinc-800/50'
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
                }`}
        >
            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Theme preview card */}
            <div className="mb-4 p-4 bg-zinc-950 rounded-xl overflow-hidden">
                {/* Mini orbs */}
                <div className="relative h-20">
                    <div className={`absolute top-0 left-0 w-12 h-12 ${theme.orb1} rounded-full blur-xl`} />
                    <div className={`absolute bottom-0 right-0 w-12 h-12 ${theme.orb2} rounded-full blur-xl`} />

                    {/* Sample content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <div className={`h-2 w-16 bg-gradient-to-r ${theme.primaryGradient} rounded-full mb-2`} />
                        <div className={`h-1.5 w-10 ${theme.textAccent} bg-current rounded-full opacity-50`} />
                    </div>
                </div>

                {/* Timeline preview */}
                <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 ${theme.timelineDot} rounded-full`} />
                    <div className="h-0.5 flex-1 bg-zinc-700 rounded-full" />
                </div>
            </div>

            {/* Theme info */}
            <h3 className="font-semibold text-white mb-1">{theme.name}</h3>
            <p className="text-sm text-zinc-400">{theme.description}</p>
        </button>
    );
}

export default function ThemeStep({ data, updateData }: StepProps) {
    const selectedTheme = data.theme || 'violet';

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
                    Pick a color theme that represents you
                </p>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themeList.map((theme) => (
                    <ThemePreview
                        key={theme.id}
                        theme={theme}
                        isSelected={selectedTheme === theme.id}
                        onClick={() => updateData({ theme: theme.id })}
                    />
                ))}
            </div>

            {/* Preview hint */}
            <p className="text-center text-zinc-500 text-sm">
                You can always change this later from your dashboard
            </p>
        </div>
    );
}
