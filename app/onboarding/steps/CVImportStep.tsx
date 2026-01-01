"use client";

import { useState, useRef } from "react";
import { PortfolioData } from "../../types";
import { createClient } from "@/app/lib/supabase/client";

const MAX_BIO_LENGTH = 350;

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    onSkip: () => void;
    isReturningUser?: boolean;
    onAnalyzingChange?: (isAnalyzing: boolean) => void;
    onParseSuccess?: (success: boolean) => void;
    userId?: string;
}

export default function CVImportStep({ data, updateData, onSkip, isReturningUser = false, onAnalyzingChange, onParseSuccess, userId }: StepProps) {
    const supabase = createClient();
    const [isUploading, setIsUploading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [parseSuccess, setParseSuccess] = useState(false);
    const [showUpload, setShowUpload] = useState(!isReturningUser);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Please select a PDF file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("File must be less than 10MB");
            return;
        }

        setError(null);
        setFileName(file.name);
        setIsUploading(true);
        setIsParsing(true);
        onAnalyzingChange?.(true);

        try {
            // Send to API for parsing
            const formData = new FormData();
            formData.append("cv", file);

            const response = await fetch("/api/parse-cv", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to parse CV");
            }

            const result = await response.json();
            const parsedData = result.data;

            // Upload CV file to storage if userId is available
            let cvUrl: string | undefined = undefined;
            if (userId) {
                const cvFileName = `${userId}-${Date.now()}.pdf`;
                const { error: uploadError } = await supabase.storage
                    .from("cvs")
                    .upload(cvFileName, file, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage
                        .from("cvs")
                        .getPublicUrl(cvFileName);
                    cvUrl = urlData.publicUrl;
                }
            }

            // Truncate bio if it exceeds the limit
            const truncatedBio = (parsedData.bio || data.bio || '').slice(0, MAX_BIO_LENGTH);

            // Update portfolio data with parsed info
            updateData({
                name: parsedData.name || data.name,
                title: parsedData.title || data.title,
                bio: truncatedBio,
                skills: parsedData.skills?.length > 0 ? parsedData.skills : data.skills,
                education: parsedData.education?.length > 0 ? parsedData.education : data.education,
                experience: parsedData.experience?.length > 0 ? parsedData.experience : data.experience,
                projects: parsedData.projects?.length > 0 ? parsedData.projects : data.projects,
                contact: {
                    email: parsedData.contact?.email || data.contact.email,
                    github: parsedData.contact?.github || data.contact.github,
                    linkedin: parsedData.contact?.linkedin || data.contact.linkedin,
                    twitter: parsedData.contact?.twitter || data.contact.twitter,
                },
                cvImported: true,
                cvUrl: cvUrl || data.cvUrl,
            });

            setParseSuccess(true);
            onParseSuccess?.(true);
        } catch (err) {
            console.error("CV parsing error:", err);
            const error = err as { message?: string };
            setError(error.message || "Failed to parse CV. Please try again or skip this step.");
        }

        setIsUploading(false);
        setIsParsing(false);
        onAnalyzingChange?.(false);
    };

    const handleReset = () => {
        setFileName(null);
        setParseSuccess(false);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Returning user prompt
    if (isReturningUser && !showUpload) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Welcome{" "}
                        <span className="text-slate-400">back!</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Would you like to update your portfolio from a new CV?
                    </p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                    <button
                        onClick={() => setShowUpload(true)}
                        className="w-full p-6 rounded-2xl border-2 border-zinc-700 hover:border-white bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300 text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Import from CV</p>
                                <p className="text-zinc-500 text-sm">Update your portfolio with new CV data</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={onSkip}
                        className="w-full p-6 rounded-2xl border-2 border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300 text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Continue editing</p>
                                <p className="text-zinc-500 text-sm">Keep your existing data and make changes</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Import from{" "}
                    <span className="text-slate-400">CV</span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Upload your CV and we&apos;ll automatically fill in your portfolio
                </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-md mx-auto">
                {!parseSuccess ? (
                    <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-2xl p-12
                            flex flex-col items-center justify-center
                            transition-all duration-300 cursor-pointer
                            ${isUploading
                                ? "border-white/30 bg-white/5"
                                : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50"
                            }
                        `}
                    >
                        {isParsing ? (
                            <>
                                <div className="w-16 h-16 mb-4 relative">
                                    <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                                <p className="text-white font-medium mb-2">Analyzing your CV...</p>
                                <p className="text-zinc-500 text-sm">This may take a few seconds</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-white font-medium mb-2">
                                    {fileName || "Drop your CV here"}
                                </p>
                                <p className="text-zinc-500 text-sm mb-4">or click to browse</p>
                                <span className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg">
                                    Select PDF
                                </span>
                            </>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                ) : (
                    <div className="border-2 border-green-500/30 bg-green-500/10 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mb-4 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-white font-medium mb-2">CV imported successfully!</p>
                        <p className="text-zinc-400 text-sm mb-4">
                            We&apos;ve extracted your information. You can review and edit in the next steps.
                        </p>
                        <button
                            onClick={handleReset}
                            className="text-sm text-zinc-400 hover:text-white transition-colors underline"
                        >
                            Upload a different CV
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Info Text */}
                <p className="text-center text-zinc-500 text-sm mt-6">
                    PDF format, max 10MB. Your CV is processed securely and not stored.
                </p>
            </div>

            {/* Skip Option */}
            {!parseSuccess && (
                <div className="text-center pt-4">
                    <button
                        onClick={onSkip}
                        disabled={isUploading}
                        className="text-zinc-400 hover:text-white transition-colors text-sm disabled:opacity-50"
                    >
                        {isReturningUser ? "← Go back" : "Skip and enter manually →"}
                    </button>
                </div>
            )}

            {/* What We Extract - only show for new users */}
            {!isReturningUser && (
                <div className="max-w-lg mx-auto">
                    <p className="text-zinc-500 text-sm text-center mb-4">What we&apos;ll extract from your CV:</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: "👤", label: "Name & Title" },
                            { icon: "📝", label: "Bio & Summary" },
                            { icon: "💼", label: "Work Experience" },
                            { icon: "🎓", label: "Education" },
                            { icon: "🛠️", label: "Skills & Tools" },
                            { icon: "🚀", label: "Projects" },
                            { icon: "📧", label: "Contact Info" },
                            { icon: "🔗", label: "Social Links" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 rounded-lg border border-zinc-800"
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-zinc-400 text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
