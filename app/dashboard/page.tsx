import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getFont } from '@/app/lib/fonts'
import { getTheme } from '@/app/lib/themes'
import ProfileAvatar from '@/app/components/ProfileAvatar'
import CopyLinkButton from '@/app/components/CopyLinkButton'
import ThemeFontSelector from '@/app/components/ThemeFontSelector'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    // Get portfolio
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const portfolioUrl = profile ? `/${profile.username}` : null

    // If no portfolio, redirect to onboarding
    if (!portfolio) {
        redirect('/onboarding')
    }

    // Get like count
    const { count: likeCount } = await supabase
        .from('portfolio_likes')
        .select('*', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)

    // Get view count (total)
    const { count: viewCount } = await supabase
        .from('portfolio_views')
        .select('*', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)

    // Get views this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const { count: weeklyViewCount } = await supabase
        .from('portfolio_views')
        .select('*', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)
        .gte('created_at', oneWeekAgo.toISOString())

    // Get views last week (for comparison)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const { count: lastWeekViewCount } = await supabase
        .from('portfolio_views')
        .select('*', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString())

    // Calculate trend percentage
    const currentWeek = weeklyViewCount || 0
    const lastWeek = lastWeekViewCount || 0
    const trendPercent = lastWeek > 0
        ? Math.round(((currentWeek - lastWeek) / lastWeek) * 100)
        : currentWeek > 0 ? 100 : 0

    // Get font configuration
    const font = getFont(portfolio.font || 'outfit')

    // Get theme configuration
    const theme = getTheme(portfolio.theme || 'slate')

    return (
        <div className={`min-h-screen bg-zinc-950 ${font.className}`}>
            {/* Subtle gradient background */}
            <div className="fixed inset-0 z-0">
                <div className={`absolute top-0 right-0 w-[800px] h-[600px] ${theme.orb1} rounded-full blur-[128px] opacity-30`} />
                <div className={`absolute bottom-0 left-0 w-[600px] h-[400px] ${theme.orb2} rounded-full blur-[128px] opacity-20`} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-zinc-800/50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-white">
                        Dfolio
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/settings"
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
                            title="Settings"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 hover:bg-zinc-800/50 rounded-lg"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Profile Section */}
                <div className="mb-10">
                    <div className="flex items-start gap-5">
                        <ProfileAvatar
                            avatarUrl={portfolio.avatar_url}
                            name={portfolio.name}
                            theme={theme}
                            size="lg"
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-white mb-1">
                                {portfolio.name}
                            </h1>
                            {portfolio.title && (
                                <p className="text-zinc-400 mb-3">{portfolio.title}</p>
                            )}
                            {portfolioUrl && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-mono ${theme.textAccent}`}>
                                        dfolio.dev{portfolioUrl}
                                    </span>
                                    <CopyLinkButton
                                        url={portfolioUrl}
                                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                                    />
                                    {portfolio.is_published ? (
                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            Live
                                        </span>
                                    ) : (
                                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <Link
                            href="/onboarding"
                            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-medium rounded-xl hover:opacity-90 transition-all text-sm`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Portfolio
                        </Link>
                        <Link
                            href={portfolioUrl || '#'}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800/80 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800 hover:text-white transition-all text-sm border border-zinc-700/50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Live
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {/* Total Views */}
                    <div className="p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Total Views
                        </div>
                        <p className="text-3xl font-bold text-white">{viewCount || 0}</p>
                    </div>

                    {/* Likes */}
                    <div className="p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Likes
                        </div>
                        <p className="text-3xl font-bold text-white">{likeCount || 0}</p>
                    </div>

                    {/* Weekly Trend */}
                    <div className="p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            This Week
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-white">{currentWeek}</p>
                            {trendPercent !== 0 && (
                                <span className={`text-sm font-medium ${trendPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {trendPercent > 0 ? '+' : ''}{trendPercent}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Theme & Font Selection */}
                <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4">Customize Style</h2>
                    <ThemeFontSelector
                        initialTheme={portfolio.theme || 'slate'}
                        initialFont={portfolio.font || 'outfit'}
                        userId={user.id}
                    />
                </div>

                {/* Quick Links */}
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Quick Actions</h2>

                    <Link
                        href="/onboarding"
                        className="group flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all"
                    >
                        <div className="w-10 h-10 bg-zinc-800/80 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-white">Manage Content</h3>
                            <p className="text-sm text-zinc-500">Edit projects, experience & skills</p>
                        </div>
                        <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="group flex items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all"
                    >
                        <div className="w-10 h-10 bg-zinc-800/80 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-white">Settings</h3>
                            <p className="text-sm text-zinc-500">Account & visibility preferences</p>
                        </div>
                        <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-800/50">
                    <p className="text-sm text-zinc-600 text-center">
                        Signed in as {user.email}
                    </p>
                </div>
            </main>
        </div>
    )
}
