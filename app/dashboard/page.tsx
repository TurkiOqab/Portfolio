import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getFont } from '@/app/lib/fonts'
import { getTheme } from '@/app/lib/themes'
import ProfileAvatar from '@/app/components/ProfileAvatar'
import CopyLinkButton from '@/app/components/CopyLinkButton'

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

    // Get font configuration
    const font = getFont(portfolio.font || 'outfit')

    // Get theme configuration
    const theme = getTheme(portfolio.theme || 'slate')

    return (
        <div className={`min-h-screen bg-zinc-950 relative overflow-hidden ${font.className}`}>
            {/* Grain texture overlay */}
            <div className="grain-overlay" />

            {/* Global Background Effects */}
            <div className="fixed inset-0 bg-zinc-950 z-0" />

            {/* Enhanced gradient mesh background - themed */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${theme.orb1} rounded-full blur-3xl animate-float`} />
                <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] ${theme.orb2} rounded-full blur-3xl animate-float-delayed`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ${theme.orb1} rounded-full blur-3xl animate-glow opacity-50`} />
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
                    <Link href="/" className="group text-2xl font-bold text-white flex items-center gap-2">
                        <span className={`w-8 h-8 bg-gradient-to-br ${theme.primaryGradient} rounded-lg flex items-center justify-center text-sm font-bold ${theme.shadowColor} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>D</span>
                        <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">DevFolio</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {portfolioUrl && (
                            <Link
                                href={portfolioUrl}
                                className={`flex items-center gap-2 text-sm ${theme.textAccent} hover:text-white transition-colors`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Portfolio
                            </Link>
                        )}
                        <span className="text-sm text-zinc-400 hidden sm:block">{user.email}</span>
                        <Link
                            href="/dashboard/settings"
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Settings"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Link>
                        {/* Profile Picture */}
                        <ProfileAvatar
                            avatarUrl={portfolio.avatar_url}
                            name={portfolio.name}
                        />
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Clean Bento Grid - Simplified */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Welcome Hero Card - Full width on mobile, left side on desktop */}
                    <div className="md:row-span-2 group">
                        <div className="h-full min-h-[320px] p-8 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-sm overflow-hidden relative">
                            {/* Subtle decorative gradient */}
                            <div className={`absolute -top-24 -right-24 w-64 h-64 ${theme.orb1} rounded-full blur-3xl opacity-50`} />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <p className="text-zinc-500 text-sm font-medium mb-1">Welcome back</p>
                                    <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent mb-4`}>
                                        {portfolio.name?.split(' ')[0] || 'User'}
                                    </h1>
                                    <p className="text-zinc-400 text-lg">
                                        {portfolio.is_published ? 'Your portfolio is live.' : 'Your portfolio is in draft.'}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                    <Link
                                        href={portfolioUrl || '#'}
                                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-semibold rounded-xl hover:opacity-90 transition-all duration-300 ${theme.shadowColor} shadow-lg`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Portfolio
                                    </Link>
                                    <Link
                                        href="/onboarding"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800/50 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800 hover:text-white transition-all duration-300 border border-zinc-700/50"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row - Views & Likes */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Views */}
                        <div className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                            <p className="text-zinc-500 text-sm font-medium mb-3">Views</p>
                            <p className="text-4xl font-bold text-white">{viewCount || 0}</p>
                            <p className="text-sm mt-2">
                                <span className={`${theme.textAccent} font-medium`}>{weeklyViewCount || 0}</span>
                                <span className="text-zinc-500"> this week</span>
                            </p>
                        </div>

                        {/* Likes */}
                        <div className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                            <p className="text-zinc-500 text-sm font-medium mb-3">Likes</p>
                            <p className="text-4xl font-bold text-white">{likeCount || 0}</p>
                            <p className="text-sm text-zinc-500 mt-2">
                                {likeCount === 1 ? 'person' : 'people'}
                            </p>
                        </div>
                    </div>

                    {/* URL Card */}
                    {portfolioUrl && (
                        <div className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
                            <p className="text-zinc-500 text-sm font-medium mb-3">Your URL</p>
                            <div className="flex items-center justify-between gap-4">
                                <p className={`text-lg font-mono ${theme.textAccent} truncate`}>
                                    devfolio.com{portfolioUrl}
                                </p>
                                <CopyLinkButton
                                    url={portfolioUrl}
                                    className={`shrink-0 px-4 py-2 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-medium rounded-lg transition-all duration-300 text-sm hover:opacity-90`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="md:col-span-2 mt-4">
                        <Link
                            href="/dashboard/settings"
                            className="group flex items-center gap-4 p-5 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white">Settings</h3>
                                <p className="text-zinc-500 text-sm truncate">Account & preferences</p>
                            </div>
                            <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    )
}
