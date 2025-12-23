"use client";

import { useState } from "react";
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
import { MarkdownSyntax } from "./useMarkdownEditor";

interface EditorToolbarProps {
    onFormat: (syntax: MarkdownSyntax, linkUrl?: string) => void;
    disabled?: boolean;
}

interface ToolbarButtonProps {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    onClick: () => void;
    disabled?: boolean;
}

function ToolbarButton({ icon, label, shortcut, onClick, disabled }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={shortcut ? `${label} (${shortcut})` : label}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {icon}
        </button>
    );
}

export default function EditorToolbar({ onFormat, disabled }: EditorToolbarProps) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const handleLinkSubmit = () => {
        if (linkUrl.trim()) {
            onFormat("link", linkUrl.trim());
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

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-2 bg-zinc-800 border-b border-zinc-700 rounded-t-xl">
            {/* Text formatting */}
            <ToolbarButton
                icon={<FaBold className="w-4 h-4" />}
                label="Bold"
                shortcut="Cmd+B"
                onClick={() => onFormat("bold")}
                disabled={disabled}
            />
            <ToolbarButton
                icon={<FaItalic className="w-4 h-4" />}
                label="Italic"
                shortcut="Cmd+I"
                onClick={() => onFormat("italic")}
                disabled={disabled}
            />
            <ToolbarButton
                icon={<FaUnderline className="w-4 h-4" />}
                label="Underline"
                shortcut="Cmd+U"
                onClick={() => onFormat("underline")}
                disabled={disabled}
            />

            <div className="w-px h-6 bg-zinc-700 mx-1" />

            {/* Headings */}
            <ToolbarButton
                icon={<LuHeading1 className="w-4 h-4" />}
                label="Heading 1"
                onClick={() => onFormat("h1")}
                disabled={disabled}
            />
            <ToolbarButton
                icon={<LuHeading2 className="w-4 h-4" />}
                label="Heading 2"
                onClick={() => onFormat("h2")}
                disabled={disabled}
            />
            <ToolbarButton
                icon={<LuHeading3 className="w-4 h-4" />}
                label="Heading 3"
                onClick={() => onFormat("h3")}
                disabled={disabled}
            />

            <div className="w-px h-6 bg-zinc-700 mx-1" />

            {/* Lists */}
            <ToolbarButton
                icon={<FaListUl className="w-4 h-4" />}
                label="Bullet List"
                onClick={() => onFormat("ul")}
                disabled={disabled}
            />
            <ToolbarButton
                icon={<FaListOl className="w-4 h-4" />}
                label="Numbered List"
                onClick={() => onFormat("ol")}
                disabled={disabled}
            />
            <ToolbarButton
                icon={<FaQuoteLeft className="w-4 h-4" />}
                label="Blockquote"
                onClick={() => onFormat("blockquote")}
                disabled={disabled}
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
    );
}
