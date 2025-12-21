export default function LoginLoading() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-zinc-950" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/5 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="h-9 w-32 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-2" />
                    <div className="h-5 w-28 bg-zinc-800 rounded animate-pulse mx-auto" />
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
                    <div>
                        <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse mb-2" />
                        <div className="h-12 bg-zinc-800/50 rounded-xl animate-pulse" />
                    </div>
                    <div>
                        <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse mb-2" />
                        <div className="h-12 bg-zinc-800/50 rounded-xl animate-pulse" />
                    </div>
                    <div className="h-12 bg-zinc-800 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    )
}
