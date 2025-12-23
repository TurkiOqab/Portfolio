"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import EditorToolbar from "./EditorToolbar";
import { useMarkdownEditor } from "./useMarkdownEditor";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    minHeight?: string;
    showPreview?: boolean;
    disabled?: boolean;
    className?: string;
    showCharCount?: boolean;
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder = "Write your content here...",
    maxLength,
    minHeight = "150px",
    showPreview = true,
    disabled = false,
    className = "",
    showCharCount = true,
}: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
    const { textareaRef, insertMarkdown, handleKeyDown } = useMarkdownEditor(
        value,
        onChange,
        maxLength
    );

    const charCount = value.length;
    const isOverLimit = maxLength ? charCount > maxLength : false;

    // Memoize markdown components for performance
    const markdownComponents = useMemo(
        () => ({
            h1: ({ children }: { children?: React.ReactNode }) => (
                <h1 className="text-2xl font-bold mb-2 mt-3 first:mt-0">{children}</h1>
            ),
            h2: ({ children }: { children?: React.ReactNode }) => (
                <h2 className="text-xl font-semibold mb-2 mt-2 first:mt-0">{children}</h2>
            ),
            h3: ({ children }: { children?: React.ReactNode }) => (
                <h3 className="text-lg font-medium mb-1 mt-2 first:mt-0">{children}</h3>
            ),
            p: ({ children }: { children?: React.ReactNode }) => (
                <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
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
                    className="text-blue-400 underline hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            ),
            ul: ({ children }: { children?: React.ReactNode }) => (
                <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
            ),
            ol: ({ children }: { children?: React.ReactNode }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
            ),
            li: ({ children }: { children?: React.ReactNode }) => (
                <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }: { children?: React.ReactNode }) => (
                <blockquote className="border-l-2 border-zinc-500 pl-4 italic text-zinc-400 my-2">
                    {children}
                </blockquote>
            ),
        }),
        []
    );

    return (
        <div className={`border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
            <EditorToolbar onFormat={insertMarkdown} disabled={disabled} />

            {/* Tab switcher for mobile/compact view */}
            {showPreview && (
                <div className="flex border-b border-zinc-800 bg-zinc-900/50">
                    <button
                        type="button"
                        onClick={() => setActiveTab("write")}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "write"
                                ? "text-white border-b-2 border-white"
                                : "text-zinc-400 hover:text-zinc-300"
                        }`}
                    >
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === "preview"
                                ? "text-white border-b-2 border-white"
                                : "text-zinc-400 hover:text-zinc-300"
                        }`}
                    >
                        Preview
                    </button>
                </div>
            )}

            {/* Editor / Preview content */}
            <div className="relative">
                {/* Textarea (Write mode) */}
                <div className={showPreview && activeTab === "preview" ? "hidden" : ""}>
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => {
                            if (!maxLength || e.target.value.length <= maxLength) {
                                onChange(e.target.value);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        style={{ minHeight }}
                        className="w-full px-4 py-3 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none resize-none text-base leading-relaxed"
                    />
                </div>

                {/* Preview pane */}
                {showPreview && activeTab === "preview" && (
                    <div
                        className="px-4 py-3 bg-zinc-900 text-white overflow-auto"
                        style={{ minHeight }}
                    >
                        {value ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={markdownComponents}
                            >
                                {value}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-zinc-500 italic">Nothing to preview</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer with char count */}
            {showCharCount && (
                <div className="flex justify-end px-4 py-2 bg-zinc-900/50 border-t border-zinc-800">
                    <span
                        className={`text-sm ${
                            isOverLimit ? "text-red-400" : "text-zinc-500"
                        }`}
                    >
                        {charCount}
                        {maxLength && `/${maxLength}`}
                    </span>
                </div>
            )}
        </div>
    );
}
