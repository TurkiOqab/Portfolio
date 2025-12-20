'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/client'

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
                .select('is_published')
                .eq('user_id', user.id)
                .single()

            if (profile) setUsername(profile.username)
            if (portfolio) setIsPublished(portfolio.is_published)

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
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="bg-zinc-900/50 border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        DevFolio
                    </Link>
                    <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
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
                <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>

                    <div className="mb-4">
                        <label className="block text-sm text-zinc-400 mb-2">Username</label>
                        <div className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-300">
                            {username}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Username cannot be changed</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-zinc-400 mb-2">Email</label>
                        {!showEmailEdit ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-300">
                                        {email}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowEmailEdit(true)
                                            setNewEmail('')
                                        }}
                                        className="px-4 py-3 text-sm text-violet-400 hover:text-violet-300 border border-zinc-700 rounded-xl hover:border-violet-500/50 transition-colors"
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
                                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleUpdateEmail}
                                        disabled={isUpdatingEmail}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
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
                <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Visibility</h2>

                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-white font-medium">Public Portfolio</p>
                            <p className="text-sm text-zinc-400">When disabled, your portfolio won&apos;t be visible to others</p>
                        </div>
                        <button
                            onClick={() => setIsPublished(!isPublished)}
                            className={`relative w-14 h-8 rounded-full transition-colors ${isPublished ? 'bg-violet-600' : 'bg-zinc-700'
                                }`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                        </button>
                    </label>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full mb-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>

                {/* Danger Zone */}
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-red-300">
                                Are you sure? This will permanently delete your account and portfolio.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors"
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
