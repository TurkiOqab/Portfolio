'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { themeList, ThemeConfig, getTheme } from '@/app/lib/themes'
import { fontList, FontConfig, getFont } from '@/app/lib/fonts'

interface ThemeFontSelectorProps {
    initialTheme: string
    initialFont: string
    userId: string
}

export default function ThemeFontSelector({ initialTheme, initialFont, userId }: ThemeFontSelectorProps) {
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
            setTimeout(() => setMessage(null), 2000)
        }

        setIsSaving(false)
    }

    return (
        <div className="space-y-6">
            {/* Theme Selection */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-zinc-400">Theme</h3>
                    {message && (
                        <span className={`text-xs ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {message.text}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-9 gap-2">
                    {themeList.map((t) => (
                        <ThemeButton
                            key={t.id}
                            theme={t}
                            isSelected={selectedTheme === t.id}
                            onClick={() => handleThemeChange(t.id)}
                            disabled={isSaving}
                        />
                    ))}
                </div>
            </div>

            {/* Font Selection */}
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Font</h3>
                <div className="grid grid-cols-5 gap-2">
                    {fontList.map((f) => (
                        <FontButton
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

function ThemeButton({ theme, isSelected, onClick, disabled }: {
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
            title={theme.name}
            className={`relative aspect-square rounded-lg border-2 transition-all duration-200 ${
                isSelected
                    ? 'border-white scale-110 z-10'
                    : 'border-zinc-700 hover:border-zinc-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLightMode ? (
                <div className="w-full h-full rounded-md bg-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-zinc-900" />
                </div>
            ) : (
                <div className={`w-full h-full rounded-md bg-gradient-to-br ${theme.primaryGradient}`} />
            )}
            {isSelected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    )
}

function FontButton({ font, isSelected, onClick, disabled }: {
    font: FontConfig
    isSelected: boolean
    onClick: () => void
    disabled: boolean
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg border transition-all duration-200 text-left ${
                isSelected
                    ? 'border-white bg-white/5'
                    : 'border-zinc-700 hover:border-zinc-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className={`${font.className} text-sm text-white font-medium`}>
                {font.displayName}
            </span>
        </button>
    )
}
