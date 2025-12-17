import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

    // Get projects count
    const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio?.id || '')

    const portfolioUrl = profile ? `/${profile.username}` : null

    // If no portfolio, redirect to onboarding
    if (!portfolio) {
        redirect('/onboarding')
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="bg-zinc-900/50 border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        DevFolio
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-400">{user.email}</span>
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

            <main className="max-w-6xl mx-auto px-6 py-12">
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
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full ${portfolio.is_published ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                            <span className="text-sm text-zinc-400">
                                {portfolio.is_published ? 'Live' : 'Draft'}
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1">Portfolio Status</h3>
                        <p className="text-zinc-400 text-sm">
                            {portfolio.is_published ? 'Your portfolio is visible to everyone' : 'Your portfolio is not public yet'}
                        </p>
                    </div>

                    {/* Projects */}
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                        <div className="text-4xl font-bold text-white mb-2">{projectCount || 0}</div>
                        <h3 className="text-xl font-semibold text-white mb-1">Projects</h3>
                        <p className="text-zinc-400 text-sm">Showcased in your portfolio</p>
                    </div>

                    {/* Skills */}
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                        <div className="text-4xl font-bold text-white mb-2">{portfolio.skills?.length || 0}</div>
                        <h3 className="text-xl font-semibold text-white mb-1">Skills</h3>
                        <p className="text-zinc-400 text-sm">Listed on your profile</p>
                    </div>
                </div>

                {/* Portfolio URL */}
                {portfolioUrl && (
                    <div className="mb-12 p-6 bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/30 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-2">Your Portfolio URL</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 px-4 py-3 bg-zinc-800/50 rounded-xl text-violet-300 font-mono">
                                devfolio.com{portfolioUrl}
                            </div>
                            <Link
                                href={portfolioUrl}
                                target="_blank"
                                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors"
                            >
                                View Portfolio
                            </Link>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Link
                        href="/onboarding"
                        className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition-all"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Edit Portfolio</h3>
                        <p className="text-zinc-400 text-sm">Update your info, projects, and skills</p>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition-all"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
                        <p className="text-zinc-400 text-sm">Manage your account and preferences</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}
