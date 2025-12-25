"use client";

import { useState, useRef, useEffect } from "react";
import { PortfolioData } from "../../types";
import { createClient } from "@/app/lib/supabase/client";
import { compressAvatar } from "@/app/lib/image-utils";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    userId: string;
    onUploadingChange?: (isUploading: boolean) => void;
}

export default function MediaUploadStep({ data, updateData, userId, onUploadingChange }: StepProps) {
    // Avatar state
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(data.avatarUrl || null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // CV state
    const [isUploadingCV, setIsUploadingCV] = useState(false);
    const [cvError, setCvError] = useState<string | null>(null);
    const [cvFileName, setCvFileName] = useState<string | null>(
        data.cvUrl ? "CV uploaded" : null
    );
    const cvInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    // Notify parent of upload status changes
    useEffect(() => {
        onUploadingChange?.(isUploadingAvatar || isUploadingCV);
    }, [isUploadingAvatar, isUploadingCV, onUploadingChange]);

    // Avatar handlers
    const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setAvatarError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setAvatarError("Image must be less than 5MB");
            return;
        }

        setAvatarError(null);
        setIsUploadingAvatar(true);

        try {
            // Compress image before upload
            const compressedFile = await compressAvatar(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(compressedFile);

            const fileExt = compressedFile.name.split(".").pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, compressedFile, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            updateData({ avatarUrl: urlData.publicUrl });
        } catch (err) {
            console.error("Upload error:", err);
            const error = err as { message?: string; error?: string };
            setAvatarError(error.message || error.error || "Failed to upload image");
            setAvatarPreview(data.avatarUrl || null);
        }

        setIsUploadingAvatar(false);
    };

    const handleRemoveAvatar = async () => {
        if (data.avatarUrl) {
            const urlParts = data.avatarUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
                try {
                    await supabase.storage.from("avatars").remove([fileName]);
                } catch (err) {
                    console.error("Failed to delete avatar:", err);
                }
            }
        }
        setAvatarPreview(null);
        updateData({ avatarUrl: undefined });
        if (avatarInputRef.current) avatarInputRef.current.value = "";
    };

    // CV handlers
    const handleCVSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setCvError("Please select a PDF file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setCvError("CV must be less than 10MB");
            return;
        }

        setCvError(null);
        setIsUploadingCV(true);
        setCvFileName(file.name);

        try {
            const fileName = `${userId}-${Date.now()}.pdf`;

            const { error: uploadError } = await supabase.storage
                .from("cvs")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("cvs")
                .getPublicUrl(fileName);

            updateData({ cvUrl: urlData.publicUrl });
        } catch (err) {
            console.error("Upload error:", err);
            const error = err as { message?: string; error?: string };
            setCvError(error.message || error.error || "Failed to upload CV");
            setCvFileName(null);
        }

        setIsUploadingCV(false);
    };

    const handleRemoveCV = async () => {
        if (data.cvUrl) {
            const urlParts = data.cvUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
                try {
                    await supabase.storage.from("cvs").remove([fileName]);
                } catch (err) {
                    console.error("Failed to delete CV:", err);
                }
            }
        }
        setCvFileName(null);
        updateData({ cvUrl: undefined });
        if (cvInputRef.current) cvInputRef.current.value = "";
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Add your{" "}
                    <span className="text-slate-400">
                        media
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Upload a profile picture and your CV/resume
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Profile Picture Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Profile Picture</h3>

                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            {avatarPreview ? (
                                <div className="relative">
                                    <img
                                        src={avatarPreview}
                                        alt="Profile preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700"
                                    />
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {avatarError && (
                            <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg w-full">
                                <p className="text-red-400 text-xs text-center">{avatarError}</p>
                            </div>
                        )}

                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-white transition-all disabled:opacity-50"
                            >
                                {isUploadingAvatar ? "Uploading..." : avatarPreview ? "Change" : "Upload"}
                            </button>
                            {avatarPreview && !isUploadingAvatar && (
                                <button
                                    onClick={handleRemoveAvatar}
                                    className="px-4 py-2 border border-zinc-700 text-zinc-400 text-sm rounded-lg hover:bg-zinc-800 transition-all"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p className="text-zinc-500 text-xs mt-2">Max 5MB, square recommended</p>
                    </div>
                </div>

                {/* CV Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">CV / Resume</h3>

                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className={`w-32 h-40 rounded-xl ${cvFileName ? 'bg-white/10 border-zinc-600' : 'bg-zinc-800 border-zinc-700'} border-2 border-dashed flex flex-col items-center justify-center transition-colors`}>
                                {isUploadingCV ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : cvFileName ? (
                                    <>
                                        <svg className="w-10 h-10 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-[10px] text-zinc-400 text-center px-2 truncate max-w-full">
                                            {cvFileName.length > 15 ? cvFileName.slice(0, 12) + "..." : cvFileName}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-10 h-10 text-zinc-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-xs text-zinc-500">PDF only</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {cvError && (
                            <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg w-full">
                                <p className="text-red-400 text-xs text-center">{cvError}</p>
                            </div>
                        )}

                        <input
                            ref={cvInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleCVSelect}
                            className="hidden"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => cvInputRef.current?.click()}
                                disabled={isUploadingCV}
                                className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-white transition-all disabled:opacity-50"
                            >
                                {isUploadingCV ? "Uploading..." : cvFileName ? "Change" : "Upload"}
                            </button>
                            {cvFileName && !isUploadingCV && (
                                <button
                                    onClick={handleRemoveCV}
                                    className="px-4 py-2 border border-zinc-700 text-zinc-400 text-sm rounded-lg hover:bg-zinc-800 transition-all"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p className="text-zinc-500 text-xs mt-2">Max 10MB, PDF format</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
