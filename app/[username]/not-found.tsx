export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="text-center">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-white mb-2">
                    Portfolio not found
                </h2>
                <p className="text-zinc-400 mb-8">
                    This username doesn&apos;t exist or the portfolio isn&apos;t published yet.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-full hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}
