"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaLink,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
} from "react-icons/fa";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";

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

interface ToolbarButtonProps {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean;
}

function ToolbarButton({ icon, label, shortcut, onClick, disabled, isActive }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={shortcut ? `${label} (${shortcut})` : label}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                    ? "text-white bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
        >
            {icon}
        </button>
    );
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder = "Write your content here...",
    maxLength,
    minHeight = "150px",
    disabled = false,
    className = "",
    showCharCount = true,
}: MarkdownEditorProps) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-400 underline hover:text-blue-300 cursor-pointer",
                },
            }),
            Underline,
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // Don't update if it would exceed maxLength
            const textLength = editor.state.doc.textContent.length;
            if (maxLength && textLength > maxLength) {
                return;
            }
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-sm max-w-none focus:outline-none",
                style: `min-height: ${minHeight}`,
            },
        },
    });

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    // Update editable state
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    const charCount = editor?.state.doc.textContent.length || 0;
    const isOverLimit = maxLength ? charCount > maxLength : false;

    const handleLinkSubmit = () => {
        if (linkUrl.trim() && editor) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: linkUrl.trim() })
                .run();
            setLinkUrl("");
            setShowLinkInput(false);
        }
    };

    const handleLinkKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLinkSubmit();
        } else if (e.key === "Escape") {
            setLinkUrl("");
            setShowLinkInput(false);
        }
    };

    if (!editor) {
        return (
            <div className={`border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
                <div className="p-4 bg-zinc-900 animate-pulse" style={{ minHeight }}>
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 bg-zinc-800 border-b border-zinc-700">
                {/* Text formatting */}
                <ToolbarButton
                    icon={<FaBold className="w-4 h-4" />}
                    label="Bold"
                    shortcut="Cmd+B"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    isActive={editor.isActive("bold")}
                />
                <ToolbarButton
                    icon={<FaItalic className="w-4 h-4" />}
                    label="Italic"
                    shortcut="Cmd+I"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    isActive={editor.isActive("italic")}
                />
                <ToolbarButton
                    icon={<FaUnderline className="w-4 h-4" />}
                    label="Underline"
                    shortcut="Cmd+U"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={disabled}
                    isActive={editor.isActive("underline")}
                />

                <div className="w-px h-6 bg-zinc-700 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    icon={<LuHeading1 className="w-4 h-4" />}
                    label="Heading 1"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    disabled={disabled}
                    isActive={editor.isActive("heading", { level: 1 })}
                />
                <ToolbarButton
                    icon={<LuHeading2 className="w-4 h-4" />}
                    label="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    disabled={disabled}
                    isActive={editor.isActive("heading", { level: 2 })}
                />
                <ToolbarButton
                    icon={<LuHeading3 className="w-4 h-4" />}
                    label="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    disabled={disabled}
                    isActive={editor.isActive("heading", { level: 3 })}
                />

                <div className="w-px h-6 bg-zinc-700 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    icon={<FaListUl className="w-4 h-4" />}
                    label="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                    isActive={editor.isActive("bulletList")}
                />
                <ToolbarButton
                    icon={<FaListOl className="w-4 h-4" />}
                    label="Numbered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                    isActive={editor.isActive("orderedList")}
                />
                <ToolbarButton
                    icon={<FaQuoteLeft className="w-4 h-4" />}
                    label="Blockquote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={disabled}
                    isActive={editor.isActive("blockquote")}
                />

                <div className="w-px h-6 bg-zinc-700 mx-1" />

                {/* Link */}
                <div className="relative">
                    <ToolbarButton
                        icon={<FaLink className="w-4 h-4" />}
                        label="Insert Link"
                        shortcut="Cmd+K"
                        onClick={() => setShowLinkInput(!showLinkInput)}
                        disabled={disabled}
                        isActive={editor.isActive("link")}
                    />

                    {showLinkInput && (
                        <div className="absolute top-full left-0 mt-1 z-50 flex items-center gap-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg">
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={handleLinkKeyDown}
                                placeholder="https://example.com"
                                autoFocus
                                className="w-48 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                            />
                            <button
                                type="button"
                                onClick={handleLinkSubmit}
                                className="px-3 py-1.5 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-600 transition-colors"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLinkUrl("");
                                    setShowLinkInput(false);
                                }}
                                className="px-2 py-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor content */}
            <div className="px-4 py-3 bg-zinc-900">
                <EditorContent editor={editor} />
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

            {/* Custom styles for the editor */}
            <style jsx global>{`
                .ProseMirror {
                    outline: none;
                }
                .ProseMirror p {
                    margin-bottom: 0.5rem;
                }
                .ProseMirror p:last-child {
                    margin-bottom: 0;
                }
                .ProseMirror h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    margin-top: 0.75rem;
                }
                .ProseMirror h1:first-child {
                    margin-top: 0;
                }
                .ProseMirror h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    margin-top: 0.5rem;
                }
                .ProseMirror h2:first-child {
                    margin-top: 0;
                }
                .ProseMirror h3 {
                    font-size: 1.125rem;
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                    margin-top: 0.5rem;
                }
                .ProseMirror h3:first-child {
                    margin-top: 0;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror li {
                    margin-bottom: 0.25rem;
                }
                .ProseMirror blockquote {
                    border-left: 2px solid #71717a;
                    padding-left: 1rem;
                    font-style: italic;
                    color: #a1a1aa;
                    margin: 0.5rem 0;
                }
                .ProseMirror a {
                    color: #60a5fa;
                    text-decoration: underline;
                }
                .ProseMirror a:hover {
                    color: #93c5fd;
                }
                .ProseMirror.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #71717a;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #71717a;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}
