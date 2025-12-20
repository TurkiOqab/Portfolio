"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
    url: string;
    className?: string;
}

export default function CopyLinkButton({ url, className = "" }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            // Get the full URL
            const fullUrl = `${window.location.origin}${url}`;
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 ${className}`}
        >
            {copied ? (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                </>
            )}
        </button>
    );
}
