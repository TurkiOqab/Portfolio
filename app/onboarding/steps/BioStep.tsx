"use client";

import { PortfolioData } from "../../types";
import MarkdownEditor from "../../components/editor/MarkdownEditor";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

const MIN_BIO_LENGTH = 20;
const MAX_BIO_LENGTH = 500;

export default function BioStep({ data, updateData }: StepProps) {
    const bioLength = data.bio.trim().length;
    const isValid = bioLength >= MIN_BIO_LENGTH;

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
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-zinc-300">
                        Your Bio <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                        {data.cvImported && (
                            <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                                </svg>
                                AI-generated from your CV
                            </p>
                        )}
                    </div>
                </div>
                {/* Tip about gradient highlights */}
                <p className="text-sm text-zinc-500 mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                    <span>Tip: Use <strong className="text-violet-400">bold text</strong> to highlight keywords with your theme&apos;s gradient color</span>
                </p>
                <MarkdownEditor
                    value={data.bio}
                    onChange={(bio) => updateData({ bio })}
                    maxLength={MAX_BIO_LENGTH}
                    placeholder="A passionate developer crafting beautiful digital experiences with modern technologies..."
                    minHeight="180px"
                    showPreview={true}
                    showCharCount={true}
                />
                {bioLength > 0 && !isValid && (
                    <p className="mt-2 text-sm text-amber-500">
                        Minimum {MIN_BIO_LENGTH} characters required ({MIN_BIO_LENGTH - bioLength} more)
                    </p>
                )}
            </div>
        </div>
    );
}
