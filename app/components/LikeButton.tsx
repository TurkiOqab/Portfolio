"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { ThemeConfig } from "../lib/themes";

interface LikeButtonProps {
    portfolioId: string;
    theme: ThemeConfig;
}

function hasConsent(): boolean {
    if (typeof window === "undefined") return false;
    const consent = localStorage.getItem("cookie_consent");
    return consent === "accepted";
}

function getVisitorId(): string {
    if (typeof window === "undefined") return "";

    // Only create/store visitor ID if user has consented
    if (!hasConsent()) return "";

    let visitorId = localStorage.getItem("dfolio_visitor_id");
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("dfolio_visitor_id", visitorId);
    }
    return visitorId;
}

export default function LikeButton({ portfolioId, theme }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchLikeData = async () => {
            const visitorId = getVisitorId();
            if (!visitorId) return;

            // Get total like count
            const { count } = await supabase
                .from("portfolio_likes")
                .select("*", { count: "exact", head: true })
                .eq("portfolio_id", portfolioId);

            setLikeCount(count || 0);

            // Check if current visitor has liked
            const { data } = await supabase
                .from("portfolio_likes")
                .select("id")
                .eq("portfolio_id", portfolioId)
                .eq("visitor_id", visitorId)
                .single();

            setLiked(!!data);
            setIsLoading(false);
        };

        fetchLikeData();
    }, [portfolioId, supabase]);

    const handleLike = async () => {
        const visitorId = getVisitorId();
        if (!visitorId || isLoading) return;

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        if (liked) {
            // Unlike
            setLiked(false);
            setLikeCount((prev) => Math.max(0, prev - 1));

            await supabase
                .from("portfolio_likes")
                .delete()
                .eq("portfolio_id", portfolioId)
                .eq("visitor_id", visitorId);
        } else {
            // Like
            setLiked(true);
            setLikeCount((prev) => prev + 1);

            await supabase
                .from("portfolio_likes")
                .insert({
                    portfolio_id: portfolioId,
                    visitor_id: visitorId,
                });
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                liked
                    ? `bg-gradient-to-r ${theme.primaryGradient} border-transparent ${theme.buttonText} shadow-lg ${theme.shadowColor}`
                    : "bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={liked ? "Unlike this portfolio" : "Like this portfolio"}
        >
            <svg
                className={`w-5 h-5 transition-transform duration-300 ${isAnimating ? "scale-125" : "scale-100"}`}
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="font-medium">
                {isLoading ? "..." : likeCount}
            </span>
            <span className="text-sm opacity-75">
                {likeCount === 1 ? "Like" : "Likes"}
            </span>
        </button>
    );
}
