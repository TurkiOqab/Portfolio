"use client";

import { PortfolioData } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

const MIN_BIO_LENGTH = 20;
const MAX_BIO_LENGTH = 300;

export default function BioStep({ data, updateData }: StepProps) {
    const bioLength = data.bio.trim().length;
    const isValid = bioLength >= MIN_BIO_LENGTH;
    const remaining = MIN_BIO_LENGTH - bioLength;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Tell us about{" "}
                    <span className="text-slate-400">
                        yourself
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Write a short bio that describes who you are
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Your Bio <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={data.bio}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_BIO_LENGTH) {
                            updateData({ bio: e.target.value });
                        }
                    }}
                    maxLength={MAX_BIO_LENGTH}
                    placeholder="A passionate developer crafting beautiful digital experiences with modern technologies..."
                    rows={6}
                    className={`w-full px-4 py-4 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-lg resize-none ${bioLength > 0 && !isValid
                        ? "border-amber-500/50 focus:border-amber-500 focus:ring-amber-500"
                        : "border-zinc-800 focus:border-zinc-600 focus:ring-white/20"
                        }`}
                />
                <div className="mt-2 flex justify-between items-center">
                    {data.cvImported ? (
                        <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                            </svg>
                            AI-generated from your CV
                        </p>
                    ) : (
                        <div />
                    )}
                    <p className={`text-sm ${bioLength > MAX_BIO_LENGTH ? "text-red-400" : "text-zinc-500"
                        }`}>
                        {bioLength}/{MAX_BIO_LENGTH}
                    </p>
                </div>
            </div>
        </div>
    );
}
