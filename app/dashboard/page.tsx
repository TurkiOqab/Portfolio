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
    const font = getFont(portfolio.font || 'inter')

    // Get theme configuration
    const theme = getTheme(portfolio.theme || 'violet')

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

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {portfolio.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-zinc-400">
                        Manage your portfolio and see how it&apos;s performing.
                    </p>
                </div>

                {/* Portfolio Status */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {/* Live Status */}
                    <div className="group p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm hover:border-zinc-700/50 hover:bg-zinc-900/70 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className={`w-3 h-3 rounded-full ${portfolio.is_published ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                                {portfolio.is_published && (
                                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                                )}
                            </div>
                            <span className="text-sm text-zinc-400 font-medium">
                                {portfolio.is_published ? 'Live' : 'Draft'}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Portfolio Status</h3>
                        <p className="text-zinc-400 text-sm">
                            {portfolio.is_published ? 'Your portfolio is visible to everyone' : 'Your portfolio is not public yet'}
                        </p>
                    </div>

                    {/* Portfolio Views */}
                    <div className="group p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm hover:border-zinc-700/50 hover:bg-zinc-900/70 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 ${theme.orb1} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <svg className={`w-5 h-5 ${theme.textAccent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-400 font-medium">Views</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{viewCount || 0}</div>
                        <p className="text-zinc-400 text-sm">
                            <span className={`${theme.textAccent} font-medium`}>{weeklyViewCount || 0}</span> this week
                        </p>
                    </div>

                    {/* Portfolio Likes */}
                    <div className="group p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm hover:border-zinc-700/50 hover:bg-zinc-900/70 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-400 font-medium">Likes</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{likeCount || 0}</div>
                        <p className="text-zinc-400 text-sm">
                            {likeCount === 1 ? 'person likes' : 'people like'} your portfolio
                        </p>
                    </div>
                </div>

                {/* Portfolio URL */}
                {portfolioUrl && (
                    <div className="relative mb-12 p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl backdrop-blur-sm overflow-hidden">
                        {/* Background glow */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] ${theme.orb1} blur-3xl pointer-events-none`} />

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-3">Your Portfolio URL</h3>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <div className={`flex-1 px-5 py-3.5 bg-zinc-800/60 rounded-xl ${theme.textAccent} font-mono border border-zinc-700/50`}>
                                    devfolio.com{portfolioUrl}
                                </div>
                                <CopyLinkButton
                                    url={portfolioUrl}
                                    className={`px-6 py-3.5 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-semibold rounded-xl transition-all duration-300 shadow-lg ${theme.shadowColor} hover:shadow-xl hover:scale-[1.02]`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Link
                        href="/onboarding"
                        className="group p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl hover:border-zinc-600/50 hover:bg-zinc-900/70 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 bg-gradient-to-br ${theme.primaryGradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 ${theme.shadowColor} group-hover:shadow-lg transition-all duration-300`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className={`text-xl font-bold text-white mb-2 group-hover:${theme.textAccent} transition-colors duration-300`}>Edit Portfolio</h3>
                        <p className="text-zinc-400 text-sm">Update your info, projects, and skills</p>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="group p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl hover:border-zinc-600/50 hover:bg-zinc-900/70 transition-all duration-300"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
                        <p className="text-zinc-400 text-sm">Manage your account and preferences</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}
