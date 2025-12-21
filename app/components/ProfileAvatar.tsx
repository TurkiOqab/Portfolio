"use client";

import { useState } from "react";
import { ThemeConfig } from "../lib/themes";

interface ProfileAvatarProps {
    avatarUrl?: string | null;
    name: string;
    theme?: ThemeConfig;
    size?: "sm" | "md" | "lg";
}

export default function ProfileAvatar({ avatarUrl, name, theme, size = "sm" }: ProfileAvatarProps) {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: "w-9 h-9 text-sm",
        md: "w-12 h-12 text-base",
        lg: "w-20 h-20 text-xl",
    };

    const initial = name?.charAt(0)?.toUpperCase() || "U";

    // Default to violet gradient for dashboard/consistent styling
    const gradientClass = theme?.primaryGradient || "from-violet-600 to-purple-600";

    if (!avatarUrl || imageError) {
        return (
            <div
                className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-medium border-2 border-zinc-700`}
            >
                {initial}
            </div>
        );
    }

    return (
        <img
            src={avatarUrl}
            alt={name}
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-zinc-700`}
            onError={() => setImageError(true)}
        />
    );
}
