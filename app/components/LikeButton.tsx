"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { ThemeConfig } from "../lib/themes";
import { hasConsent, getVisitorId } from "../lib/consent";

interface LikeButtonProps {
    portfolioId: string;
    theme: ThemeConfig;
    isOwner?: boolean;
}

export default function LikeButton({ portfolioId, theme, isOwner: isOwnerProp }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const [isOwner, setIsOwner] = useState(isOwnerProp ?? false);
    const supabase = useMemo(() => createClient(), []);
    const isLightMode = theme.mode === 'light';

    useEffect(() => {
        const fetchLikeData = async () => {
            let ownerDetected = isOwnerProp ?? false;

            // Double-check ownership on client side
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: portfolio } = await supabase
                    .from("portfolios")
                    .select("user_id")
                    .eq("id", portfolioId)
                    .single();

                if (portfolio?.user_id === user.id) {
                    ownerDetected = true;
                    setIsOwner(true);
                }
            }

            // Always fetch like count (for owners too)
            const { count } = await supabase
                .from("portfolio_likes")
                .select("*", { count: "exact", head: true })
                .eq("portfolio_id", portfolioId);

            setLikeCount(count || 0);

            // Only check visitor like status for non-owners
            if (!ownerDetected) {
                const visitorId = getVisitorId();
                if (visitorId) {
                    const { data } = await supabase
                        .from("portfolio_likes")
                        .select("id")
                        .eq("portfolio_id", portfolioId)
                        .eq("visitor_id", visitorId)
                        .single();

                    setLiked(!!data);
                }
            }
            setIsLoading(false);
        };

        fetchLikeData();
    }, [portfolioId, supabase, isOwnerProp]);

    // Show read-only view for portfolio owner
    if (isOwner) {
        return (
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full border ${isLightMode ? 'bg-white/80 border-zinc-200 text-zinc-500' : 'bg-zinc-900/50 border-zinc-700 text-zinc-400'}`}>
                <svg
                    className="w-5 h-5"
                    fill="none"
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
                <span className="font-medium">{isLoading ? "..." : likeCount}</span>
                <span className="text-sm opacity-75">
                    {likeCount === 1 ? "Like" : "Likes"}
                </span>
            </div>
        );
    }

    const handleLike = useCallback(async () => {
        // Prevent owner from liking their own portfolio
        if (isOwner) return;

        const visitorId = getVisitorId();

        // Show signup prompt if no consent/visitor ID
        if (!visitorId) {
            setShowSignupPrompt(true);
            return;
        }

        if (isLoading) return;

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

            // Show signup prompt after liking
            setTimeout(() => setShowSignupPrompt(true), 500);
        }
    }, [isOwner, isLoading, liked, supabase, portfolioId]);

    return (
        <>
            <button
                onClick={handleLike}
                disabled={isLoading}
                className={`group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                    liked
                        ? `bg-gradient-to-r ${theme.primaryGradient} border-transparent ${theme.buttonText} shadow-lg ${theme.shadowColor}`
                        : isLightMode
                            ? "bg-white/80 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
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

            {/* Signup Prompt Modal */}
            {showSignupPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowSignupPrompt(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="text-center">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${theme.primaryGradient} flex items-center justify-center`}>
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Like what you see?
                            </h3>
                            <p className="text-zinc-400 mb-6">
                                Create your own developer portfolio in minutes.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/signup"
                                    className={`w-full py-3 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-medium rounded-xl hover:opacity-90 transition-all text-center`}
                                >
                                    Create My Portfolio
                                </Link>
                                <button
                                    onClick={() => setShowSignupPrompt(false)}
                                    className="w-full py-3 border border-zinc-700 text-zinc-400 font-medium rounded-xl hover:bg-zinc-800 hover:text-white transition-all"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
