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

function LivePreview({ theme, font, name, isLoading }: { theme: ThemeConfig; font: FontConfig; name: string; isLoading: boolean }) {
    const isLightMode = theme.mode === 'light'

    return (
        <div className={`relative ${isLightMode ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-950 border-zinc-800'} rounded-2xl overflow-hidden border ${font.className}`}>
            {/* Loading overlay */}
            {isLoading && (
                <div className={`absolute inset-0 z-20 flex items-center justify-center ${isLightMode ? 'bg-white/80' : 'bg-zinc-950/80'} backdrop-blur-sm`}>
                    <div className="flex flex-col items-center gap-3">
                        <svg className={`w-8 h-8 animate-spin ${isLightMode ? 'text-zinc-600' : 'text-white'}`} fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className={`text-sm font-medium ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'}`}>Applying changes...</span>
                    </div>
                </div>
            )}

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

function ThemePreview({ theme, isSelected, onClick, disabled, parentLightMode }: {
    theme: ThemeConfig
    isSelected: boolean
    onClick: () => void
    disabled: boolean
    parentLightMode: boolean
}) {
    const isLightTheme = theme.mode === 'light'

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                ? parentLightMode ? 'border-zinc-900 bg-zinc-200/50 scale-105' : 'border-white bg-zinc-800/50 scale-105'
                : parentLightMode ? 'border-zinc-300 bg-white/50 hover:border-zinc-400 hover:scale-102' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:scale-102'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className={`w-6 h-6 ${parentLightMode ? 'bg-zinc-900' : 'bg-white'} rounded-full flex items-center justify-center shadow-lg`}>
                        <svg className={`w-4 h-4 ${parentLightMode ? 'text-white' : 'text-zinc-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Mini preview or color swatches */}
            {isLightTheme ? (
                <div className="w-full h-8 rounded-lg bg-gradient-to-r from-white via-zinc-100 to-zinc-200 border border-zinc-300 mb-2" />
            ) : (
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${theme.primaryGradient} mb-2`} />
            )}

            {/* Theme info */}
            <h3 className={`font-medium ${parentLightMode ? 'text-zinc-900' : 'text-white'} text-sm`}>{theme.name}</h3>
        </button>
    )
}

function FontPreview({ font, isSelected, onClick, disabled, parentLightMode }: {
    font: FontConfig
    isSelected: boolean
    onClick: () => void
    disabled: boolean
    parentLightMode: boolean
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${isSelected
                ? parentLightMode ? 'border-zinc-900 bg-zinc-200/30' : 'border-white bg-white/5'
                : parentLightMode ? 'border-zinc-300 bg-white/50 hover:border-zinc-400 hover:bg-white/80' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className={`w-6 h-6 ${parentLightMode ? 'bg-zinc-900' : 'bg-white'} rounded-full flex items-center justify-center shadow-lg`}>
                        <svg className={`w-4 h-4 ${parentLightMode ? 'text-white' : 'text-zinc-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Large font name as preview */}
            <div className={`${font.className} text-2xl font-semibold ${parentLightMode ? 'text-zinc-900' : 'text-white'} mb-3`}>
                {font.displayName}
            </div>

            {/* Sample text in the font */}
            <p className={`${font.className} text-sm ${parentLightMode ? 'text-zinc-600' : 'text-zinc-400'} mb-4 leading-relaxed`}>
                {font.preview}
            </p>

            {/* Category tag */}
            <span className={`inline-block px-2.5 py-1 text-xs rounded-full ${isSelected
                ? parentLightMode ? 'bg-zinc-900/10 text-zinc-900' : 'bg-white/10 text-white'
                : parentLightMode ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}`}>
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
    const isLightMode = theme.mode === 'light'

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

        // Add minimum delay for visual feedback
        const [{ error }] = await Promise.all([
            supabase
                .from('portfolios')
                .update({ theme: themeId, font: fontId })
                .eq('user_id', userId),
            new Promise(resolve => setTimeout(resolve, 600)) // Minimum 600ms loading
        ])

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
                    <p className={`text-sm ${isLightMode ? 'text-zinc-600' : 'text-zinc-500'}`}>
                        Preview: <span className={`font-medium ${theme.textAccent}`}>{theme.name}</span> theme with <span className={`font-medium ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>{font.displayName}</span> font
                    </p>
                    {message && (
                        <span className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {message.text}
                        </span>
                    )}
                </div>
                <LivePreview theme={theme} font={font} name={portfolioName || ''} isLoading={isSaving} />
            </div>

            {/* Theme Selection Grid */}
            <div>
                <p className={`text-sm ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} mb-3`}>Select a color theme:</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                    {themeList.map((t) => (
                        <ThemePreview
                            key={t.id}
                            theme={t}
                            isSelected={selectedTheme === t.id}
                            onClick={() => handleThemeChange(t.id)}
                            disabled={isSaving}
                            parentLightMode={isLightMode}
                        />
                    ))}
                </div>
            </div>

            {/* Font Selection Grid */}
            <div>
                <p className={`text-sm ${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} mb-4`}>Select a font:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {fontList.map((f) => (
                        <FontPreview
                            key={f.id}
                            font={f}
                            isSelected={selectedFont === f.id}
                            onClick={() => handleFontChange(f.id)}
                            disabled={isSaving}
                            parentLightMode={isLightMode}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
