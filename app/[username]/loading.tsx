export default function PortfolioLoading() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navbar skeleton */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/30">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="h-8 w-32 bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-20 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-8 w-20 bg-zinc-800 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Hero skeleton */}
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-32 h-32 bg-zinc-800 rounded-full animate-pulse mx-auto mb-8" />
                    <div className="h-16 w-64 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-4" />
                    <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mx-auto mb-6" />
                    <div className="h-20 w-full max-w-2xl bg-zinc-800 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="flex justify-center gap-4">
                        <div className="h-12 w-32 bg-zinc-800 rounded-full animate-pulse" />
                        <div className="h-12 w-32 bg-zinc-800 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Skills skeleton */}
            <div className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse mx-auto mb-8" />
                    <div className="flex flex-wrap justify-center gap-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-10 w-24 bg-zinc-800 rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects skeleton */}
            <div className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse mx-auto mb-12" />
                    <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                                <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse mb-3" />
                                <div className="h-16 w-full bg-zinc-800 rounded animate-pulse mb-4" />
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse" />
                                    <div className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
