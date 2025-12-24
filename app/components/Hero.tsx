"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeConfig } from "../lib/themes";
import MarkdownRenderer from "./MarkdownRenderer";
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiJavascript,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiGit,
    SiDocker,
    SiAmazonwebservices,
    SiFirebase,
    SiMongodb,
    SiPostgresql,
    SiMysql,
    SiHtml5,
    SiCss3,
    SiVuedotjs,
    SiAngular,
    SiSvelte,
    SiRust,
    SiGo,
    SiKubernetes,
    SiRedis,
    SiGraphql,
    SiSupabase,
    SiVercel,
    SiFigma,
    SiFlutter,
    SiSwift,
    SiKotlin,
    SiCplusplus,
    SiC,
    SiPhp,
    SiRuby,
    SiDjango,
    SiFlask,
    SiExpress,
    SiNestjs,
    SiPrisma,
    SiTrpc,
    SiVite,
    SiWebpack,
    SiJest,
    SiCypress,
    SiLinux,
    SiNginx,
    SiGithub,
    SiGitlab,
    SiBitbucket,
    SiJira,
    SiNotion,
    SiSlack,
    SiDiscord,
} from "react-icons/si";
import { FaCode } from "react-icons/fa";

interface HeroProps {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    theme: ThemeConfig;
}

// Map skill names to official Simple Icons
function SkillIcon({ skill }: { skill: string }) {
    const iconClass = "w-6 h-6";
    const s = skill.toLowerCase();

    // React ecosystem
    if (s.includes("react") && !s.includes("native")) return <SiReact className={iconClass} />;
    if (s.includes("next")) return <SiNextdotjs className={iconClass} />;

    // Languages
    if (s.includes("typescript") || s === "ts") return <SiTypescript className={iconClass} />;
    if (s.includes("javascript") || s === "js") return <SiJavascript className={iconClass} />;
    if (s.includes("python")) return <SiPython className={iconClass} />;
    if (s.includes("rust")) return <SiRust className={iconClass} />;
    if (s.includes("go") || s === "golang") return <SiGo className={iconClass} />;
    if (s.includes("c++") || s === "cpp") return <SiCplusplus className={iconClass} />;
    if (s === "c" || s === "c lang") return <SiC className={iconClass} />;
    if (s.includes("php")) return <SiPhp className={iconClass} />;
    if (s.includes("ruby")) return <SiRuby className={iconClass} />;
    if (s.includes("swift")) return <SiSwift className={iconClass} />;
    if (s.includes("kotlin")) return <SiKotlin className={iconClass} />;

    // Frontend frameworks
    if (s.includes("vue")) return <SiVuedotjs className={iconClass} />;
    if (s.includes("angular")) return <SiAngular className={iconClass} />;
    if (s.includes("svelte")) return <SiSvelte className={iconClass} />;
    if (s.includes("flutter")) return <SiFlutter className={iconClass} />;

    // Styling
    if (s.includes("tailwind")) return <SiTailwindcss className={iconClass} />;
    if (s.includes("html")) return <SiHtml5 className={iconClass} />;
    if (s.includes("css") && !s.includes("tailwind")) return <SiCss3 className={iconClass} />;

    // Backend
    if (s.includes("node")) return <SiNodedotjs className={iconClass} />;
    if (s.includes("express")) return <SiExpress className={iconClass} />;
    if (s.includes("nest")) return <SiNestjs className={iconClass} />;
    if (s.includes("django")) return <SiDjango className={iconClass} />;
    if (s.includes("flask")) return <SiFlask className={iconClass} />;

    // Databases
    if (s.includes("mongo")) return <SiMongodb className={iconClass} />;
    if (s.includes("postgres")) return <SiPostgresql className={iconClass} />;
    if (s.includes("mysql")) return <SiMysql className={iconClass} />;
    if (s.includes("redis")) return <SiRedis className={iconClass} />;
    if (s.includes("supabase")) return <SiSupabase className={iconClass} />;
    if (s.includes("prisma")) return <SiPrisma className={iconClass} />;

    // APIs
    if (s.includes("graphql")) return <SiGraphql className={iconClass} />;
    if (s.includes("trpc")) return <SiTrpc className={iconClass} />;

    // DevOps & Cloud
    if (s.includes("docker")) return <SiDocker className={iconClass} />;
    if (s.includes("kubernetes") || s === "k8s") return <SiKubernetes className={iconClass} />;
    if (s.includes("aws") || s.includes("amazon")) return <SiAmazonwebservices className={iconClass} />;
    if (s.includes("firebase")) return <SiFirebase className={iconClass} />;
    if (s.includes("vercel")) return <SiVercel className={iconClass} />;
    if (s.includes("linux")) return <SiLinux className={iconClass} />;
    if (s.includes("nginx")) return <SiNginx className={iconClass} />;

    // Version control
    if (s.includes("github")) return <SiGithub className={iconClass} />;
    if (s.includes("gitlab")) return <SiGitlab className={iconClass} />;
    if (s.includes("bitbucket")) return <SiBitbucket className={iconClass} />;
    if (s.includes("git")) return <SiGit className={iconClass} />;

    // Build tools
    if (s.includes("vite")) return <SiVite className={iconClass} />;
    if (s.includes("webpack")) return <SiWebpack className={iconClass} />;

    // Testing
    if (s.includes("jest")) return <SiJest className={iconClass} />;
    if (s.includes("cypress")) return <SiCypress className={iconClass} />;

    // Design & Productivity
    if (s.includes("figma")) return <SiFigma className={iconClass} />;
    if (s.includes("jira")) return <SiJira className={iconClass} />;
    if (s.includes("notion")) return <SiNotion className={iconClass} />;
    if (s.includes("slack")) return <SiSlack className={iconClass} />;
    if (s.includes("discord")) return <SiDiscord className={iconClass} />;

    // Default code icon
    return <FaCode className={iconClass} />;
}

function TypeWriter({ texts, theme }: { texts: string[]; theme: ThemeConfig }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [fontSize, setFontSize] = useState(72); // Start with max font size in px
    const [shouldWrap, setShouldWrap] = useState(false); // Allow wrapping for very long text
    const containerRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    // Calculate font size based on text length and container width
    useEffect(() => {
        const calculateFontSize = () => {
            if (!containerRef.current) return;

            // Get actual container width - use the h1 parent's width which respects padding
            const parent = containerRef.current.closest('h1');
            const containerWidth = parent?.clientWidth || containerRef.current.parentElement?.clientWidth || window.innerWidth - 32;

            // Safety margin to prevent edge clipping (account for any padding/margins)
            const safeWidth = containerWidth * 0.95;
            const fullText = texts[currentTextIndex];

            // Base font sizes - adjusted for mobile
            const maxFontSize = 72; // px - for short text on desktop
            const minFontSize = 20; // px - minimum readable size
            const wrapThreshold = 22; // px - if we go below this, allow wrapping

            // Estimate: average character width is roughly 0.5 of font size for bold text
            const charWidthRatio = 0.5;
            const textLength = fullText.length;

            // Calculate what font size would make the text fit on one line
            const idealFontSize = safeWidth / (textLength * charWidthRatio);

            // If ideal font size is too small, enable wrapping and use a readable size
            if (idealFontSize < wrapThreshold) {
                setShouldWrap(true);
                // Use a comfortable reading size when wrapping
                const wrappedFontSize = Math.max(minFontSize, Math.min(32, safeWidth / 12));
                setFontSize(wrappedFontSize);
            } else {
                setShouldWrap(false);
                // Clamp between min and max
                const newFontSize = Math.max(minFontSize, Math.min(maxFontSize, idealFontSize));
                setFontSize(newFontSize);
            }
        };

        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(calculateFontSize, 10);
        window.addEventListener('resize', calculateFontSize);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', calculateFontSize);
        };
    }, [texts, currentTextIndex]);

    useEffect(() => {
        const fullText = texts[currentTextIndex];
        const typingSpeed = isDeleting ? 30 : 50; // Fast typing
        const pauseTime = 2000; // 2 second pause

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
    const isLightMode = theme.mode === 'light';

    const content = hasHiPrefix ? (
        <>
            <span className={isLightMode ? "text-zinc-900" : "text-white"}>
                {currentText.substring(0, Math.min(currentText.length, hiPart.length))}
            </span>
            <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
                {currentText.substring(hiPart.length)}
            </span>
        </>
    ) : (
        <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
            {currentText}
        </span>
    );

    return (
        <span
            ref={containerRef}
            className={`inline-block w-full max-w-full ${shouldWrap ? 'whitespace-normal break-words' : 'whitespace-nowrap'}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: shouldWrap ? 1.3 : 1.1 }}
        >
            <span ref={textRef} className="inline">{content}</span>
        </span>
    );
}

export default function Hero({ name, title, bio, skills, theme }: HeroProps) {
    const typingTexts = [
        `Hi, I'm ${name || "Your Name"}`,
        title || "Developer"
    ];
    const isLightMode = theme.mode === 'light';

    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative pt-16"
        >
            {/* Floating gradient orbs - themed */}
            <div className={`absolute top-1/4 left-1/4 w-72 h-72 ${theme.orb1} rounded-full blur-3xl animate-float pointer-events-none`} />
            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${theme.orb2} rounded-full blur-3xl animate-float-delayed pointer-events-none`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${theme.orb1} rounded-full blur-3xl animate-glow pointer-events-none opacity-50`} />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center box-border">
                {/* Main Heading with Typewriter */}
                <h1 className={`font-bold ${theme.textPrimary} mb-8 tracking-tight w-full max-w-full overflow-hidden`}>
                    <TypeWriter texts={typingTexts} theme={theme} />
                </h1>

                {/* Bio */}
                <div
                    className={`text-lg sm:text-xl md:text-2xl ${theme.textMuted} mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 break-words w-full box-border`}
                    style={{ overflowWrap: 'anywhere' }}
                >
                    <MarkdownRenderer
                        content={bio || "A passionate developer crafting beautiful digital experiences."}
                        isLightMode={isLightMode}
                    />
                </div>

                {/* Scrolling Tech Stack with enhanced styling */}
                {skills.length > 0 && (
                    <div className="relative w-full overflow-hidden mb-14">
                        {/* Gradient fade edges */}
                        <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r ${isLightMode ? 'from-white' : 'from-zinc-950'} to-transparent z-10 pointer-events-none`} />
                        <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l ${isLightMode ? 'from-white' : 'from-zinc-950'} to-transparent z-10 pointer-events-none`} />

                        <div className="flex animate-scroll">
                            {[...skills, ...skills, ...skills].map((skill, index) => (
                                <div
                                    key={`${skill}-${index}`}
                                    className={`flex items-center gap-3 px-6 py-2 mx-2 ${theme.textMuted} whitespace-nowrap ${isLightMode ? 'bg-zinc-100/80 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100' : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60'} rounded-full border transition-all duration-300`}
                                >
                                    <SkillIcon skill={skill} />
                                    <span className="text-sm font-medium">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Buttons with enhanced effects */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#projects"
                        className={`group px-8 py-4 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-semibold rounded-full hover:opacity-90 transition-all duration-300 shadow-lg ${theme.shadowColor} flex items-center gap-2 hover:scale-[1.02] hover:shadow-xl`}
                    >
                        View My Work
                        <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                        className={`group px-8 py-4 border ${isLightMode ? 'border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400' : 'border-zinc-700 text-white hover:bg-zinc-800/50 hover:border-zinc-500'} font-medium rounded-full transition-all duration-300 hover:scale-[1.02]`}
                    >
                        Contact Me
                        <svg
                            className="w-4 h-4 inline-block ml-2 group-hover:translate-y-0.5 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
