export default function SettingsLoading() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header skeleton */}
            <div className="bg-zinc-900/50 border-b border-zinc-800/50">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-4">
                    <div className="h-10 w-10 bg-zinc-800 rounded-lg animate-pulse" />
                    <div>
                        <div className="h-7 w-24 bg-zinc-800 rounded animate-pulse mb-1" />
                        <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {/* Account section skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                    <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-6" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-4 border-b border-zinc-800/50">
                            <div>
                                <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse mb-1" />
                                <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-9 w-20 bg-zinc-800 rounded-lg animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse mb-1" />
                                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-9 w-28 bg-zinc-800 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Preferences section skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                    <div className="h-6 w-28 bg-zinc-800 rounded animate-pulse mb-6" />
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-1" />
                            <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-12 bg-zinc-800 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Data section skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
                    <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse mb-6" />
                    <div className="h-10 w-32 bg-zinc-800 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    )
}
