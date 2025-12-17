"use client";

import { PortfolioData } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

const MIN_BIO_LENGTH = 50;
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
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
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
                    onChange={(e) => updateData({ bio: e.target.value })}
                    placeholder="A passionate developer crafting beautiful digital experiences with modern technologies..."
                    rows={6}
                    className={`w-full px-4 py-4 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-lg resize-none ${bioLength > 0 && !isValid
                            ? "border-amber-500/50 focus:border-amber-500 focus:ring-amber-500"
                            : "border-zinc-800 focus:border-violet-500 focus:ring-violet-500"
                        }`}
                />
                <div className="mt-2 flex justify-between items-center">
                    <p className={`text-sm ${!isValid ? "text-amber-400" : "text-green-400"
                        }`}>
                        {!isValid
                            ? `${remaining} more characters needed (minimum ${MIN_BIO_LENGTH})`
                            : `✓ Minimum reached`
                        }
                    </p>
                    <p className={`text-sm ${bioLength > MAX_BIO_LENGTH ? "text-red-400" : "text-zinc-500"
                        }`}>
                        {bioLength}/{MAX_BIO_LENGTH}
                    </p>
                </div>
            </div>
        </div>
    );
}
