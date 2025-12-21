"use client";

import { useState, useRef } from "react";
import { PortfolioData } from "../../types";
import { createClient } from "@/app/lib/supabase/client";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    userId: string;
}

export default function ProfilePictureStep({ data, updateData, userId }: StepProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(data.avatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Create a preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            // Update portfolio data with avatar URL
            updateData({ avatarUrl: urlData.publicUrl });

        } catch (err) {
            console.error("Upload error:", err);
            const error = err as { message?: string; error?: string };
            setError(error.message || error.error || "Failed to upload image. Please try again.");
            setPreviewUrl(data.avatarUrl || null);
        }

        setIsUploading(false);
    };

    const handleRemove = async () => {
        if (data.avatarUrl) {
            // Extract file name from URL
            const urlParts = data.avatarUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
                try {
                    await supabase.storage
                        .from("avatars")
                        .remove([fileName]);
                } catch (err) {
                    console.error("Failed to delete old avatar:", err);
                }
            }
        }

        setPreviewUrl(null);
        updateData({ avatarUrl: undefined });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Add a{" "}
                    <span className="text-slate-400">
                        profile picture
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Help others recognize you with a photo
                </p>
            </div>

            <div className="flex flex-col items-center">
                {/* Preview */}
                <div className="relative mb-6">
                    {previewUrl ? (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Profile preview"
                                className="w-40 h-40 rounded-full object-cover border-4 border-zinc-700"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center">
                            <svg className="w-16 h-16 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
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
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-6 py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {previewUrl ? "Change Photo" : "Upload Photo"}
                            </>
                        )}
                    </button>

                    {previewUrl && !isUploading && (
                        <button
                            onClick={handleRemove}
                            className="px-6 py-3 border border-zinc-700 text-zinc-400 rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
                        >
                            Remove
                        </button>
                    )}
                </div>

                <p className="text-zinc-500 text-sm mt-4">
                    Recommended: Square image, at least 200x200 pixels
                </p>
            </div>
        </div>
    );
}
