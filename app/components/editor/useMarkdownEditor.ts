"use client";

import { useRef, useCallback, RefObject } from "react";

export type MarkdownSyntax =
    | "bold"
    | "italic"
    | "underline"
    | "h1"
    | "h2"
    | "h3"
    | "ul"
    | "ol"
    | "blockquote"
    | "link";

interface UseMarkdownEditorReturn {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    insertMarkdown: (syntax: MarkdownSyntax, linkUrl?: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function useMarkdownEditor(
    value: string,
    onChange: (value: string) => void,
    maxLength?: number
): UseMarkdownEditorReturn {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const wrapSelection = useCallback(
        (prefix: string, suffix: string) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = value.substring(start, end);
            const beforeText = value.substring(0, start);
            const afterText = value.substring(end);

            const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;

            if (maxLength && newText.length > maxLength) return;

            onChange(newText);

            // Restore cursor position after React re-renders
            requestAnimationFrame(() => {
                textarea.focus();
                if (selectedText) {
                    // If text was selected, keep it selected
                    textarea.setSelectionRange(
                        start + prefix.length,
                        end + prefix.length
                    );
                } else {
                    // If no text selected, place cursor between prefix and suffix
                    textarea.setSelectionRange(
                        start + prefix.length,
                        start + prefix.length
                    );
                }
            });
        },
        [value, onChange, maxLength]
    );

    const insertAtLineStart = useCallback(
        (prefix: string) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Find the start of the current line
            let lineStart = start;
            while (lineStart > 0 && value[lineStart - 1] !== "\n") {
                lineStart--;
            }

            // Get selected lines
            let lineEnd = end;
            while (lineEnd < value.length && value[lineEnd] !== "\n") {
                lineEnd++;
            }

            const selectedLines = value.substring(lineStart, lineEnd);
            const lines = selectedLines.split("\n");

            // Add prefix to each line
            const newLines = lines.map((line) => `${prefix}${line}`);
            const newText =
                value.substring(0, lineStart) +
                newLines.join("\n") +
                value.substring(lineEnd);

            if (maxLength && newText.length > maxLength) return;

            onChange(newText);

            requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(
                    start + prefix.length,
                    end + prefix.length * lines.length
                );
            });
        },
        [value, onChange, maxLength]
    );

    const insertLink = useCallback(
        (url: string) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = value.substring(start, end) || "link text";
            const beforeText = value.substring(0, start);
            const afterText = value.substring(end);

            const linkMarkdown = `[${selectedText}](${url})`;
            const newText = `${beforeText}${linkMarkdown}${afterText}`;

            if (maxLength && newText.length > maxLength) return;

            onChange(newText);

            requestAnimationFrame(() => {
                textarea.focus();
                // Select the link text for easy editing
                textarea.setSelectionRange(start + 1, start + 1 + selectedText.length);
            });
        },
        [value, onChange, maxLength]
    );

    const insertMarkdown = useCallback(
        (syntax: MarkdownSyntax, linkUrl?: string) => {
            switch (syntax) {
                case "bold":
                    wrapSelection("**", "**");
                    break;
                case "italic":
                    wrapSelection("*", "*");
                    break;
                case "underline":
                    wrapSelection("<u>", "</u>");
                    break;
                case "h1":
                    insertAtLineStart("# ");
                    break;
                case "h2":
                    insertAtLineStart("## ");
                    break;
                case "h3":
                    insertAtLineStart("### ");
                    break;
                case "ul":
                    insertAtLineStart("- ");
                    break;
                case "ol":
                    insertAtLineStart("1. ");
                    break;
                case "blockquote":
                    insertAtLineStart("> ");
                    break;
                case "link":
                    insertLink(linkUrl || "https://");
                    break;
            }
        },
        [wrapSelection, insertAtLineStart, insertLink]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            const isMod = e.metaKey || e.ctrlKey;

            if (isMod && e.key === "b") {
                e.preventDefault();
                insertMarkdown("bold");
            } else if (isMod && e.key === "i") {
                e.preventDefault();
                insertMarkdown("italic");
            } else if (isMod && e.key === "u") {
                e.preventDefault();
                insertMarkdown("underline");
            } else if (isMod && e.key === "k") {
                e.preventDefault();
                insertMarkdown("link");
            }
        },
        [insertMarkdown]
    );

    return {
        textareaRef,
        insertMarkdown,
        handleKeyDown,
    };
}
