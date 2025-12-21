export default function OnboardingLoading() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            {/* Progress bar skeleton */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/7 bg-zinc-700 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="flex-1 flex items-center justify-center pt-28 pb-32 px-6">
                <div className="w-full max-w-2xl text-center">
                    <div className="h-12 w-64 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-4" />
                    <div className="h-6 w-80 bg-zinc-800 rounded animate-pulse mx-auto mb-8" />
                    <div className="space-y-4">
                        <div className="h-14 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                        <div className="h-14 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Navigation skeleton */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800/50">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="h-10 w-20 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-12 w-32 bg-zinc-800 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    )
}
