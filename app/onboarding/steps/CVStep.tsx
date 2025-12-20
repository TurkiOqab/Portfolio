"use client";

import { useState, useRef } from "react";
import { PortfolioData } from "../../types";
import { createClient } from "@/app/lib/supabase/client";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    userId: string;
}

export default function CVStep({ data, updateData, userId }: StepProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(
        data.cvUrl ? "CV uploaded" : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type (PDF only)
        if (file.type !== "application/pdf") {
            setError("Please select a PDF file");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("CV must be less than 10MB");
            return;
        }

        setError(null);
        setIsUploading(true);
        setFileName(file.name);

        try {
            // Generate unique filename
            const fileName = `${userId}-${Date.now()}.pdf`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("cvs")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("cvs")
                .getPublicUrl(fileName);

            // Update portfolio data with CV URL
            updateData({ cvUrl: urlData.publicUrl });

        } catch (err) {
            console.error("Upload error:", err);
            const error = err as { message?: string; error?: string };
            setError(error.message || error.error || "Failed to upload CV. Please try again.");
            setFileName(null);
        }

        setIsUploading(false);
    };

    const handleRemove = async () => {
        if (data.cvUrl) {
            // Extract file name from URL
            const urlParts = data.cvUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
                try {
                    await supabase.storage
                        .from("cvs")
                        .remove([fileName]);
                } catch (err) {
                    console.error("Failed to delete CV:", err);
                }
            }
        }

        setFileName(null);
        updateData({ cvUrl: undefined });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Upload your{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        CV / Resume
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Let visitors download your CV directly from your portfolio
                </p>
            </div>

            <div className="flex flex-col items-center">
                {/* File Preview */}
                <div className="relative mb-6">
                    <div className={`w-40 h-48 rounded-xl ${fileName ? 'bg-violet-600/20 border-violet-500/50' : 'bg-zinc-800 border-zinc-700'} border-2 border-dashed flex flex-col items-center justify-center transition-colors`}>
                        {isUploading ? (
                            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        ) : fileName ? (
                            <>
                                <svg className="w-12 h-12 text-violet-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs text-zinc-400 text-center px-2 truncate max-w-full">
                                    {fileName.length > 20 ? fileName.slice(0, 17) + "..." : fileName}
                                </span>
                            </>
                        ) : (
                            <>
                                <svg className="w-12 h-12 text-zinc-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs text-zinc-500">PDF only</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Upload button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                {fileName ? "Change CV" : "Upload CV"}
                            </>
                        )}
                    </button>

                    {fileName && !isUploading && (
                        <button
                            onClick={handleRemove}
                            className="px-6 py-3 border border-zinc-700 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
                        >
                            Remove
                        </button>
                    )}
                </div>

                <p className="text-zinc-500 text-sm mt-4">
                    Accepted format: PDF (max 10MB)
                </p>
            </div>
        </div>
    );
}
