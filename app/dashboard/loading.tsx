export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header skeleton */}
            <div className="bg-zinc-950/70 border-b border-zinc-800/30 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="h-8 w-32 bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-24 bg-zinc-800 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-zinc-800 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hero card skeleton */}
                    <div className="md:row-span-2 p-8 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl">
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
                        <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse mb-4" />
                        <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse mb-8" />
                        <div className="flex gap-3">
                            <div className="h-12 w-32 bg-zinc-800 rounded-xl animate-pulse" />
                            <div className="h-12 w-20 bg-zinc-800 rounded-xl animate-pulse" />
                        </div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl">
                            <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse mb-3" />
                            <div className="h-10 w-12 bg-zinc-800 rounded animate-pulse" />
                        </div>
                        <div className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl">
                            <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse mb-3" />
                            <div className="h-10 w-12 bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* URL card skeleton */}
                    <div className="p-6 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl">
                        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse mb-3" />
                        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}
