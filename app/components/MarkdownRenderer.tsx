"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
    content: string;
    className?: string;
    isLightMode?: boolean;
}

export default function MarkdownRenderer({
    content,
    className = "",
    isLightMode = false,
}: MarkdownRendererProps) {
    // Theme-aware styling
    const components = useMemo(
        () => ({
            h1: ({ children }: { children?: React.ReactNode }) => (
                <h1 className="text-2xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>
            ),
            h2: ({ children }: { children?: React.ReactNode }) => (
                <h2 className="text-xl font-semibold mb-2 mt-3 first:mt-0">{children}</h2>
            ),
            h3: ({ children }: { children?: React.ReactNode }) => (
                <h3 className="text-lg font-medium mb-2 mt-2 first:mt-0">{children}</h3>
            ),
            p: ({ children }: { children?: React.ReactNode }) => (
                <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
            ),
            strong: ({ children }: { children?: React.ReactNode }) => (
                <strong className="font-semibold">{children}</strong>
            ),
            em: ({ children }: { children?: React.ReactNode }) => (
                <em className="italic">{children}</em>
            ),
            u: ({ children }: { children?: React.ReactNode }) => (
                <u className="underline">{children}</u>
            ),
            a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
                <a
                    href={href}
                    className={`underline underline-offset-2 transition-opacity hover:opacity-80 ${
                        isLightMode ? "text-zinc-700" : "text-current"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            ),
            ul: ({ children }: { children?: React.ReactNode }) => (
                <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
            ),
            ol: ({ children }: { children?: React.ReactNode }) => (
                <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
            ),
            li: ({ children }: { children?: React.ReactNode }) => (
                <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }: { children?: React.ReactNode }) => (
                <blockquote
                    className={`border-l-2 pl-4 italic my-3 ${
                        isLightMode
                            ? "border-zinc-400 text-zinc-600"
                            : "border-current/30 opacity-80"
                    }`}
                >
                    {children}
                </blockquote>
            ),
        }),
        [isLightMode]
    );

    if (!content) {
        return null;
    }

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
