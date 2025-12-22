'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { themeList, ThemeConfig, getTheme } from '@/app/lib/themes'
import { fontList, FontConfig, getFont } from '@/app/lib/fonts'

interface ThemeFontSelectorProps {
    initialTheme: string
    initialFont: string
    userId: string
    portfolioName?: string
}

function LivePreview({ theme, font, name }: { theme: ThemeConfig; font: FontConfig; name: string }) {
    const isLightMode = theme.mode === 'light'

    return (
        <div className={`relative ${isLightMode ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-950 border-zinc-800'} rounded-2xl overflow-hidden border ${font.className}`}>
            {/* Background orbs */}
            <div className={`absolute top-0 left-1/4 w-48 h-48 ${theme.orb1} rounded-full blur-3xl`} />
            <div className={`absolute bottom-0 right-1/4 w-48 h-48 ${theme.orb2} rounded-full blur-3xl`} />

            {/* Content */}
            <div className="relative z-10 p-6">
                {/* Hero section mockup */}
                <div className="text-center mb-4">
                    <div className={`w-12 h-12 ${isLightMode ? 'bg-zinc-300' : 'bg-zinc-800'} rounded-full mx-auto mb-3`} />
                    <h2 className={`text-xl font-bold ${isLightMode ? 'text-zinc-900' : `bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}`}>
                        {name || "Your Name"}
                    </h2>
                    <p className={`${isLightMode ? 'text-zinc-600' : theme.textMuted} text-xs mt-1`}>Full Stack Developer</p>
                </div>

                {/* Skills mockup */}
                <div className="flex justify-center gap-1.5 mb-4">
                    {["React", "Node.js", "TypeScript"].map((skill) => (
                        <span
                            key={skill}
                            className={`px-2 py-0.5 text-[10px] rounded-full ${isLightMode ? 'bg-zinc-200 text-zinc-700 border border-zinc-300' : 'bg-zinc-800/50 text-zinc-400'}`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Button mockup */}
                <div className="flex justify-center">
                    <div className={`px-4 py-1.5 ${isLightMode ? 'bg-zinc-900' : `bg-gradient-to-r ${theme.primaryGradient}`} rounded-lg ${theme.shadowColor} shadow-lg`}>
                        <span className={`${theme.buttonText} text-xs font-medium`}>Contact Me</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ThemePreview({ theme, isSelected, onClick, disabled }: {
    theme: ThemeConfig
    isSelected: boolean
    onClick: () => void
    disabled: boolean
}) {
    const isLightMode = theme.mode === 'light'

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                ? 'border-white bg-zinc-800/50 scale-105'
                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:scale-102'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

            {/* Mini preview or color swatches */}
            {isLightMode ? (
                <div className="w-full h-8 rounded-lg bg-gradient-to-r from-white via-zinc-100 to-zinc-200 border border-zinc-300 mb-2" />
            ) : (
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${theme.primaryGradient} mb-2`} />
            )}

            {/* Theme info */}
            <h3 className="font-medium text-white text-sm">{theme.name}</h3>
        </button>
    )
}

function FontPreview({ font, isSelected, onClick, disabled }: {
    font: FontConfig
    isSelected: boolean
    onClick: () => void
    disabled: boolean
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${isSelected
                ? 'border-white bg-white/5'
                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    )
}

export default function ThemeFontSelector({ initialTheme, initialFont, userId, portfolioName }: ThemeFontSelectorProps) {
    const router = useRouter()
    const supabase = createClient()
    const [selectedTheme, setSelectedTheme] = useState(initialTheme)
    const [selectedFont, setSelectedFont] = useState(initialFont)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const theme = getTheme(selectedTheme)
    const font = getFont(selectedFont)

    const handleThemeChange = async (themeId: string) => {
        setSelectedTheme(themeId)
        await saveChanges(themeId, selectedFont)
    }

    const handleFontChange = async (fontId: string) => {
        setSelectedFont(fontId)
        await saveChanges(selectedTheme, fontId)
    }

    const saveChanges = async (themeId: string, fontId: string) => {
        setIsSaving(true)
        setMessage(null)

        const { error } = await supabase
            .from('portfolios')
            .update({ theme: themeId, font: fontId })
            .eq('user_id', userId)

        if (error) {
            setMessage({ type: 'error', text: 'Failed to save changes' })
        } else {
            setMessage({ type: 'success', text: 'Saved!' })
            router.refresh()
            setTimeout(() => setMessage(null), 2000)
        }

        setIsSaving(false)
    }

    return (
        <div className="space-y-8">
            {/* Live Preview */}
            <div className="transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-zinc-500">
                        Preview: <span className={`font-medium ${theme.textAccent}`}>{theme.name}</span> theme with <span className="font-medium text-white">{font.displayName}</span> font
                    </p>
                    {message && (
                        <span className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {message.text}
                        </span>
                    )}
                </div>
                <LivePreview theme={theme} font={font} name={portfolioName || ''} />
            </div>

            {/* Theme Selection Grid */}
            <div>
                <p className="text-sm text-zinc-400 mb-3">Select a color theme:</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                    {themeList.map((t) => (
                        <ThemePreview
                            key={t.id}
                            theme={t}
                            isSelected={selectedTheme === t.id}
                            onClick={() => handleThemeChange(t.id)}
                            disabled={isSaving}
                        />
                    ))}
                </div>
            </div>

            {/* Font Selection Grid */}
            <div>
                <p className="text-sm text-zinc-400 mb-4">Select a font:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {fontList.map((f) => (
                        <FontPreview
                            key={f.id}
                            font={f}
                            isSelected={selectedFont === f.id}
                            onClick={() => handleFontChange(f.id)}
                            disabled={isSaving}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
