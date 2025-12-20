"use client";

import { useState, useEffect } from "react";
import { ThemeConfig } from "../lib/themes";
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

                {/* Scrolling Tech Stack */}
                {skills.length > 0 && (
                    <div className="relative w-full overflow-hidden mb-12">
                        <div className="flex animate-scroll">
                            {[...skills, ...skills, ...skills].map((skill, index) => (
                                <div
                                    key={`${skill}-${index}`}
                                    className="flex items-center gap-3 px-8 text-zinc-400 whitespace-nowrap"
                                >
                                    <SkillIcon skill={skill} />
                                    <span className="text-lg font-medium">{skill}</span>
                                </div>
                            ))}
                        </div>
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
