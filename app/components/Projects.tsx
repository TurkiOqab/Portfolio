"use client";

import { useEffect, useRef, useCallback } from "react";
import { Project } from "../types";
import { ThemeConfig } from "../lib/themes";
import MarkdownRenderer from "./MarkdownRenderer";
import {
    SiAmazonwebservices,
    SiAndroid,
    SiAngular,
    SiAnthropic,
    SiArduino,
    SiBlender,
    SiBootstrap,
    SiC,
    SiCplusplus,
    SiCss3,
    SiDjango,
    SiDocker,
    SiDotnet,
    SiElasticsearch,
    SiExpress,
    SiFastapi,
    SiFigma,
    SiFirebase,
    SiFlask,
    SiFlutter,
    SiGit,
    SiGithub,
    SiGitlab,
    SiGo,
    SiGooglecloud,
    SiGraphql,
    SiHtml5,
    SiHuggingface,
    SiIos,
    SiJavascript,
    SiJupyter,
    SiKeras,
    SiKotlin,
    SiKubernetes,
    SiLangchain,
    SiLaravel,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNestjs,
    SiNextdotjs,
    SiNodedotjs,
    SiNumpy,
    SiOllama,
    SiOpenai,
    SiOpencv,
    SiPandas,
    SiPhp,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiPytorch,
    SiR,
    SiRaspberrypi,
    SiReact,
    SiRedis,
    SiRuby,
    SiRubyonrails,
    SiRust,
    SiScikitlearn,
    SiSpring,
    SiSqlite,
    SiSupabase,
    SiSvelte,
    SiSwift,
    SiTailwindcss,
    SiTensorflow,
    SiTerraform,
    SiThreedotjs,
    SiTypescript,
    SiUnity,
    SiUnrealengine,
    SiVercel,
    SiVuedotjs,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
import { IconType } from "react-icons";

// Comprehensive tag icons for all developer types (A-Z)
const TAG_ICONS: Record<string, { icon: IconType; color: string }> = {
    ".NET": { icon: SiDotnet, color: "#512BD4" },
    "Android": { icon: SiAndroid, color: "#3DDC84" },
    "Angular": { icon: SiAngular, color: "#DD0031" },
    "Anthropic": { icon: SiAnthropic, color: "#D4A27F" },
    "Arduino": { icon: SiArduino, color: "#00979D" },
    "AWS": { icon: SiAmazonwebservices, color: "#FF9900" },
    "Blender": { icon: SiBlender, color: "#F5792A" },
    "Bootstrap": { icon: SiBootstrap, color: "#7952B3" },
    "C": { icon: SiC, color: "#A8B9CC" },
    "C#": { icon: TbBrandCSharp, color: "#512BD4" },
    "C++": { icon: SiCplusplus, color: "#00599C" },
    "CSS": { icon: SiCss3, color: "#1572B6" },
    "Django": { icon: SiDjango, color: "#092E20" },
    "Docker": { icon: SiDocker, color: "#2496ED" },
    "Elasticsearch": { icon: SiElasticsearch, color: "#005571" },
    "Express": { icon: SiExpress, color: "#FFFFFF" },
    "FastAPI": { icon: SiFastapi, color: "#009688" },
    "Figma": { icon: SiFigma, color: "#F24E1E" },
    "Firebase": { icon: SiFirebase, color: "#FFCA28" },
    "Flask": { icon: SiFlask, color: "#FFFFFF" },
    "Flutter": { icon: SiFlutter, color: "#02569B" },
    "Git": { icon: SiGit, color: "#F05032" },
    "GitHub": { icon: SiGithub, color: "#FFFFFF" },
    "GitLab": { icon: SiGitlab, color: "#FC6D26" },
    "Go": { icon: SiGo, color: "#00ADD8" },
    "Google Cloud": { icon: SiGooglecloud, color: "#4285F4" },
    "GraphQL": { icon: SiGraphql, color: "#E10098" },
    "HTML": { icon: SiHtml5, color: "#E34F26" },
    "Hugging Face": { icon: SiHuggingface, color: "#FFD21E" },
    "iOS": { icon: SiIos, color: "#FFFFFF" },
    "Java": { icon: FaJava, color: "#007396" },
    "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
    "Jupyter": { icon: SiJupyter, color: "#F37626" },
    "Keras": { icon: SiKeras, color: "#D00000" },
    "Kotlin": { icon: SiKotlin, color: "#7F52FF" },
    "Kubernetes": { icon: SiKubernetes, color: "#326CE5" },
    "LangChain": { icon: SiLangchain, color: "#1C3C3C" },
    "Laravel": { icon: SiLaravel, color: "#FF2D20" },
    "Linux": { icon: SiLinux, color: "#FCC624" },
    "MongoDB": { icon: SiMongodb, color: "#47A248" },
    "MySQL": { icon: SiMysql, color: "#4479A1" },
    "NestJS": { icon: SiNestjs, color: "#E0234E" },
    "Next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "NumPy": { icon: SiNumpy, color: "#013243" },
    "Ollama": { icon: SiOllama, color: "#FFFFFF" },
    "OpenAI": { icon: SiOpenai, color: "#412991" },
    "OpenCV": { icon: SiOpencv, color: "#5C3EE8" },
    "Pandas": { icon: SiPandas, color: "#150458" },
    "PHP": { icon: SiPhp, color: "#777BB4" },
    "PostgreSQL": { icon: SiPostgresql, color: "#4169E1" },
    "Prisma": { icon: SiPrisma, color: "#2D3748" },
    "Python": { icon: SiPython, color: "#3776AB" },
    "PyTorch": { icon: SiPytorch, color: "#EE4C2C" },
    "R": { icon: SiR, color: "#276DC3" },
    "Raspberry Pi": { icon: SiRaspberrypi, color: "#A22846" },
    "React": { icon: SiReact, color: "#61DAFB" },
    "Redis": { icon: SiRedis, color: "#DC382D" },
    "Ruby": { icon: SiRuby, color: "#CC342D" },
    "Ruby on Rails": { icon: SiRubyonrails, color: "#CC0000" },
    "Rust": { icon: SiRust, color: "#DEA584" },
    "scikit-learn": { icon: SiScikitlearn, color: "#F7931E" },
    "Spring": { icon: SiSpring, color: "#6DB33F" },
    "SQLite": { icon: SiSqlite, color: "#003B57" },
    "Supabase": { icon: SiSupabase, color: "#3FCF8E" },
    "Svelte": { icon: SiSvelte, color: "#FF3E00" },
    "Swift": { icon: SiSwift, color: "#F05138" },
    "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
    "TensorFlow": { icon: SiTensorflow, color: "#FF6F00" },
    "Terraform": { icon: SiTerraform, color: "#7B42BC" },
    "Three.js": { icon: SiThreedotjs, color: "#FFFFFF" },
    "TypeScript": { icon: SiTypescript, color: "#3178C6" },
    "Unity": { icon: SiUnity, color: "#FFFFFF" },
    "Unreal Engine": { icon: SiUnrealengine, color: "#0E1128" },
    "Vercel": { icon: SiVercel, color: "#FFFFFF" },
    "Vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
};

interface ProjectsProps {
    projects: Project[];
    theme: ThemeConfig;
}

function formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" });
}

export default function Projects({ projects, theme }: ProjectsProps) {
    // Reverse projects so oldest is at bottom
    const reversedProjects = [...projects].reverse();
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const activeIndexRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const pendingUpdates = useRef<Map<number, boolean>>(new Map());

    // Batched DOM updates using requestAnimationFrame
    const flushUpdates = useCallback(() => {
        pendingUpdates.current.forEach((isActive, index) => {
            const card = cardRefs.current[index];
            const dot = dotRefs.current[index];

            if (card) {
                if (isActive) {
                    card.classList.add('project-card-active');
                    card.classList.remove('project-card-inactive');
                } else {
                    card.classList.remove('project-card-active');
                    card.classList.add('project-card-inactive');
                }
            }

            if (dot) {
                if (isActive) {
                    dot.classList.add('project-dot-active');
                    dot.classList.remove('project-dot-inactive');
                } else {
                    dot.classList.remove('project-dot-active');
                    dot.classList.add('project-dot-inactive');
                }
            }
        });
        pendingUpdates.current.clear();
        rafRef.current = null;
    }, []);

    // Queue state update and batch with RAF
    const updateCardState = useCallback((index: number, isActive: boolean) => {
        pendingUpdates.current.set(index, isActive);

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(flushUpdates);
        }
    }, [flushUpdates]);

    useEffect(() => {
        // Set initial state - first card is active
        if (cardRefs.current[0]) {
            cardRefs.current[0].classList.add('project-card-active');
        }
        if (dotRefs.current[0]) {
            dotRefs.current[0].classList.add('project-dot-active');
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.getAttribute('data-index'));

                    if (entry.isIntersecting && activeIndexRef.current !== index) {
                        // Deactivate previous card
                        updateCardState(activeIndexRef.current, false);
                        // Activate new card
                        updateCardState(index, true);
                        activeIndexRef.current = index;
                    }
                });
            },
            {
                root: null,
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0,
            }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [reversedProjects.length, updateCardState]);

    const scrollToCard = (index: number) => {
        cardRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    return (
        <section id="projects" className="py-24 relative">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Section Header with enhanced styling */}
                <div className="text-center mb-20">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${theme.textAccent} text-sm font-medium tracking-widest uppercase mb-6 bg-zinc-900/50 rounded-full border border-zinc-800/50`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${theme.primaryGradient}`} />
                        Featured Work
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        My{" "}
                        <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
                            Projects
                        </span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        A selection of my recent work. Each project represents a unique
                        challenge and showcases my expertise in different technologies.
                    </p>
                </div>

                {/* Project Navigation Dots */}
                {projects.length > 1 && (
                    <div className="flex justify-center gap-2 mb-12">
                        {reversedProjects.map((_, index) => (
                            <button
                                key={index}
                                ref={(el) => { dotRefs.current[index] = el; }}
                                onClick={() => scrollToCard(index)}
                                className={`h-2 rounded-full hover:opacity-80 project-dot ${index === 0 ? 'project-dot-active' : 'project-dot-inactive'}`}
                                aria-label={`Go to project ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Projects Timeline */}
                {projects.length > 0 ? (
                    <div className="relative" ref={containerRef}>
                        {/* Timeline Line */}
                        <div className={`absolute left-4 md:left-[140px] top-0 bottom-0 w-px bg-gradient-to-b ${theme.primaryGradient} opacity-30`} />

                        <div className="space-y-8 md:space-y-12">
                            {reversedProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    ref={(el) => { cardRefs.current[index] = el; }}
                                    data-index={index}
                                    className={`project-card relative flex gap-6 md:gap-12 ${index === 0 ? 'project-card-active' : 'project-card-inactive'}`}
                                >
                                    {/* Left Side - Date */}
                                    <div className="flex-shrink-0 w-8 md:w-[140px] relative">
                                        {/* Timeline Dot */}
                                        <div
                                            className={`project-timeline-dot absolute left-4 md:left-[140px] top-8 w-3 h-3 rounded-full bg-gradient-to-r ${theme.primaryGradient} ring-4 ring-zinc-950 z-10`}
                                        />

                                        <div className="hidden md:block text-right pr-8 pt-6">
                                            {(project.startDate || project.endDate) && (
                                                <p className="project-date text-sm font-mono">
                                                    {formatDate(project.startDate)}
                                                    {project.startDate && project.endDate && " — "}
                                                    {formatDate(project.endDate)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side - Card */}
                                    <div className="flex-1 pb-4">
                                        <div className="project-card-inner group relative bg-zinc-900/80 backdrop-blur-sm border rounded-2xl p-6 md:p-8 hover-shimmer overflow-hidden">
                                            {/* Badge */}
                                            {project.liveUrl && (
                                                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.id === 'white' ? 'bg-zinc-900' : 'bg-white'}`} />
                                                        Deployed
                                                    </span>
                                                </div>
                                            )}

                                            {/* Project Image */}
                                            {project.imageUrl && (
                                                <div className="mb-5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 overflow-hidden rounded-t-2xl">
                                                    <img
                                                        src={project.imageUrl}
                                                        alt={project.title}
                                                        loading="lazy"
                                                        className="w-full h-48 md:h-56 object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Stack - Above Title with enhanced styling */}
                                            {project.tags.length > 0 && (
                                                <div className="mb-5">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tags.map((tag) => {
                                                            const tagData = TAG_ICONS[tag];
                                                            const Icon = tagData?.icon;

                                                            return (
                                                                <span
                                                                    key={tag}
                                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/60 text-zinc-300 text-sm rounded-full border border-zinc-700/40 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-200 cursor-default"
                                                                >
                                                                    {Icon && <Icon className="w-4 h-4" style={{ color: tagData.color }} />}
                                                                    <span className="font-medium">{tag}</span>
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                {project.title}
                                            </h3>

                                            {/* Date (Mobile) */}
                                            {(project.startDate || project.endDate) && (
                                                <p className="text-sm text-zinc-500 font-mono mb-4 md:hidden">
                                                    {formatDate(project.startDate)}
                                                    {project.startDate && project.endDate && " — "}
                                                    {formatDate(project.endDate)}
                                                </p>
                                            )}

                                            {/* Description */}
                                            <div className="text-zinc-400 text-base leading-relaxed mb-6">
                                                <MarkdownRenderer content={project.description} />
                                            </div>

                                            {/* Links */}
                                            <div className="flex items-center gap-6 pt-2">
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2 text-sm font-medium ${theme.textAccent} hover:text-white transition-colors duration-300`}
                                                    >
                                                        View project
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300"
                                                    >
                                                        View code
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>

                                            {/* Active Glow */}
                                            <div
                                                className={`project-glow absolute inset-0 rounded-2xl bg-gradient-to-r ${theme.primaryGradient} pointer-events-none`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-zinc-500">No projects added yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
