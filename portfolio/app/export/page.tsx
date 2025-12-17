"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPortfolioData, hasPortfolioData } from "../lib/storage";
import { PortfolioData } from "../types";

export default function ExportPage() {
    const router = useRouter();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!hasPortfolioData()) {
            router.push("/onboarding");
            return;
        }
        setData(getPortfolioData());
        setIsLoading(false);
    }, [router]);

    const handleVercelDeploy = () => {
        // Open Vercel deploy with template
        const repoUrl = "https://github.com/TurkiOqab/Portfolio";
        const deployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(
            repoUrl
        )}&project-name=my-portfolio&repository-name=my-portfolio`;
        window.open(deployUrl, "_blank");
    };

    const handleDownload = async () => {
        setDownloadStatus("Generating files...");

        // Create a simple JSON export for now
        const exportData = {
            portfolio: data,
            instructions: "Replace the hardcoded data in the portfolio components with this data.",
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio-data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloadStatus("Downloaded!");
        setTimeout(() => setDownloadStatus(null), 3000);
    };

    const handleGitHubSave = () => {
        // For now, open GitHub new repo page
        window.open("https://github.com/new", "_blank");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 py-16 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm text-emerald-400">Portfolio Ready!</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Your portfolio is{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            ready
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Choose how you want to deploy and share your portfolio with the world
                    </p>
                </div>

                {/* Preview Link */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                    >
                        <span>👁</span> Preview your portfolio
                    </Link>
                </div>

                {/* Export Options */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Vercel Deploy */}
                    <button
                        onClick={handleVercelDeploy}
                        className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 76 65" fill="currentColor">
                                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Deploy to Vercel
                        </h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            One-click deploy to Vercel. Get a free URL instantly.
                        </p>
                        <span className="text-violet-400 text-sm font-medium group-hover:underline">
                            Deploy now →
                        </span>
                    </button>

                    {/* Download */}
                    <button
                        onClick={handleDownload}
                        className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Download Files
                        </h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            Download your portfolio data. Host it anywhere.
                        </p>
                        <span className="text-violet-400 text-sm font-medium group-hover:underline">
                            {downloadStatus || "Download →"}
                        </span>
                    </button>

                    {/* GitHub */}
                    <button
                        onClick={handleGitHubSave}
                        className="group p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Save to GitHub
                        </h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            Create a repo with your portfolio code.
                        </p>
                        <span className="text-violet-400 text-sm font-medium group-hover:underline">
                            Create repo →
                        </span>
                    </button>
                </div>

                {/* Edit Button */}
                <div className="mt-12 text-center">
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-800/50 hover:border-zinc-600 transition-all"
                    >
                        ✎ Edit Portfolio Info
                    </Link>
                </div>
            </div>
        </div>
    );
}
