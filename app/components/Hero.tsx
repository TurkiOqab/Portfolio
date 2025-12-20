"use client";

import { useState, useEffect } from "react";
import { ThemeConfig } from "../lib/themes";

interface HeroProps {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    theme: ThemeConfig;
}

function TypeWriter({ texts, theme }: { texts: string[]; theme: ThemeConfig }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fullText = texts[currentTextIndex];
        const typingSpeed = isDeleting ? 100 : 200; // Slower typing
        const pauseTime = 1500; // 1.5 second pause

        if (!isDeleting && currentText === fullText) {
            // Pause before deleting
            const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && currentText === "") {
            // Move to next text
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            return;
        }

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setCurrentText(fullText.substring(0, currentText.length - 1));
            } else {
                setCurrentText(fullText.substring(0, currentText.length + 1));
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentTextIndex, texts]);

    // Split the text to color only the name/title part
    const hiPart = "Hi, I'm ";
    const hasHiPrefix = texts[currentTextIndex].startsWith(hiPart);

    if (hasHiPrefix) {
        const displayedHi = currentText.substring(0, Math.min(currentText.length, hiPart.length));
        const displayedName = currentText.substring(hiPart.length);
        return (
            <span>
                <span className="text-white">{displayedHi}</span>
                <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
                    {displayedName}
                </span>
                <span className="animate-pulse text-white">|</span>
            </span>
        );
    }

    // For title without "Hi, I'm", show all in gradient
    return (
        <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
}

export default function Hero({ name, title, bio, skills, theme }: HeroProps) {
    const typingTexts = [
        `Hi, I'm ${name || "Your Name"}`,
        title || "Developer"
    ];

    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative pt-16"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                {/* Main Heading with Typewriter */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
                    <TypeWriter texts={typingTexts} theme={theme} />
                </h1>

                {/* Bio */}
                <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {bio || "A passionate developer crafting beautiful digital experiences."}
                </p>

                {/* Tech Stack Pills */}
                {skills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className={`px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 backdrop-blur-sm hover:border-current ${theme.textAccent} transition-colors duration-300`}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#projects"
                        className={`group px-8 py-4 bg-gradient-to-r ${theme.primaryGradient} text-white font-medium rounded-full hover:opacity-90 transition-all duration-300 shadow-lg ${theme.shadowColor} flex items-center gap-2`}
                    >
                        View My Work
                        <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 border border-zinc-700 text-white font-medium rounded-full hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-300"
                    >
                        Contact Me
                    </a>
                </div>
            </div>
        </section>
    );
}
