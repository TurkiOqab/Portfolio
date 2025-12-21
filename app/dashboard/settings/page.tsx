'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'
import { getTheme, ThemeConfig } from '@/app/lib/themes'

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showEmailEdit, setShowEmailEdit] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [isPublished, setIsPublished] = useState(true)
    const [theme, setTheme] = useState<ThemeConfig>(getTheme('violet'))
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        const loadSettings = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Set email from user auth
            if (user.email) {
                setEmail(user.email)
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            const { data: portfolio } = await supabase
                .from('portfolios')
                .select('is_published, theme')
                .eq('user_id', user.id)
                .single()

            if (profile) setUsername(profile.username)
            if (portfolio) {
                setIsPublished(portfolio.is_published)
                setTheme(getTheme(portfolio.theme || 'violet'))
            }

            setIsLoading(false)
        }

        loadSettings()
    }, [router, supabase])

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Update visibility
        const { error } = await supabase
            .from('portfolios')
            .update({ is_published: isPublished })
            .eq('user_id', user.id)

        if (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' })
        } else {
            setMessage({ type: 'success', text: 'Settings saved successfully!' })
        }

        setIsSaving(false)
    }

    const handleUpdateEmail = async () => {
        if (!newEmail.trim()) {
            setMessage({ type: 'error', text: 'Please enter a new email address' })
            return
        }

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(newEmail)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' })
            return
        }

        if (newEmail === email) {
            setMessage({ type: 'error', text: 'New email is the same as current email' })
            return
        }

        setIsUpdatingEmail(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({ email: newEmail })

            if (error) {
                throw error
            }

            setMessage({
                type: 'success',
                text: 'Confirmation email sent! Please check both your old and new email addresses to confirm the change.'
            })
            setShowEmailEdit(false)
            setNewEmail('')
        } catch (error) {
            console.error('Failed to update email:', error)
            const err = error as { message?: string }
            setMessage({
                type: 'error',
                text: err.message || 'Failed to update email. Please try again.'
            })
        }

        setIsUpdatingEmail(false)
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        setMessage(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setMessage({ type: 'error', text: 'Unable to verify user session' })
                setIsDeleting(false)
                return
            }

            // Delete portfolio and projects (cascade)
            const { error: portfolioError } = await supabase
                .from('portfolios')
                .delete()
                .eq('user_id', user.id)

            if (portfolioError) {
                console.error('Failed to delete portfolio:', portfolioError)
                throw new Error('Failed to delete portfolio data')
            }

            // Delete profile
            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', user.id)

            if (profileError) {
                console.error('Failed to delete profile:', profileError)
                throw new Error('Failed to delete profile data')
            }

            // Sign out
            await supabase.auth.signOut()

            router.push('/')
        } catch (error) {
            console.error('Account deletion failed:', error)
            setMessage({
                type: 'error',
                text: 'Failed to delete account. Please try again or contact support.'
            })
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${theme.accentColor.replace('bg-', 'border-')}`} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
            {/* Grain texture overlay */}
            <div className="grain-overlay" />

            {/* Global Background Effects */}
            <div className="fixed inset-0 bg-zinc-950 z-0" />

            {/* Enhanced gradient mesh background - themed */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${theme.orb1} rounded-full blur-3xl animate-float`} />
                <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] ${theme.orb2} rounded-full blur-3xl animate-float-delayed`} />
            </div>

            {/* Grid Pattern */}
            <div
                className="fixed inset-0 opacity-[0.04] z-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Radial gradient overlay for depth */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.8)_70%)]" />

            {/* Header */}
            <header className="relative z-10 bg-zinc-950/70 border-b border-zinc-800/30 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="group text-2xl font-bold text-white flex items-center gap-2">
                        <span className={`w-8 h-8 bg-gradient-to-br ${theme.primaryGradient} rounded-lg flex items-center justify-center text-sm font-bold ${theme.shadowColor} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>D</span>
                        <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">DevFolio</span>
                    </Link>
                    <Link href="/dashboard" className={`text-sm ${theme.textAccent} hover:text-white transition-colors flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Section */}
                <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6">Profile</h2>

                    <div className="mb-6">
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">Username</label>
                        <div className={`px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl ${theme.textAccent}`}>
                            {username}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">Username cannot be changed</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">Email</label>
                        {!showEmailEdit ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-300">
                                        {email}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowEmailEdit(true)
                                            setNewEmail('')
                                        }}
                                        className={`px-4 py-3 text-sm ${theme.textAccent} border border-zinc-700/50 rounded-xl hover:border-zinc-600 hover:bg-zinc-800/50 transition-all`}
                                    >
                                        Change
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email address"
                                    className={`w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all`}
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleUpdateEmail}
                                        disabled={isUpdatingEmail}
                                        className={`px-4 py-2 ${theme.accentColor} ${theme.buttonText} text-sm rounded-lg transition-colors disabled:opacity-50 hover:opacity-90`}
                                    >
                                        {isUpdatingEmail ? 'Sending...' : 'Update Email'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowEmailEdit(false)
                                            setNewEmail('')
                                        }}
                                        className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    A confirmation email will be sent to both addresses
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visibility Section */}
                <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6">Visibility</h2>

                    <label className="flex items-center justify-between cursor-pointer p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:border-zinc-600/50 transition-all">
                        <div>
                            <p className="text-white font-medium">Public Portfolio</p>
                            <p className="text-sm text-zinc-400 mt-1">When disabled, your portfolio won&apos;t be visible to others</p>
                        </div>
                        <button
                            onClick={() => setIsPublished(!isPublished)}
                            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${isPublished ? theme.accentColor : 'bg-zinc-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${isPublished ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </label>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full mb-8 py-3.5 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-semibold rounded-xl transition-all disabled:opacity-50 ${theme.shadowColor} shadow-lg hover:shadow-xl hover:scale-[1.01]`}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>

                {/* Danger Zone */}
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-red-300">
                                Are you sure? This will permanently delete your account and portfolio.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-500 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800/50 hover:border-zinc-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
