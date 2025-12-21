"use client";

import { useEffect, useRef, useCallback } from "react";
import { Project } from "../types";
import { ThemeConfig } from "../lib/themes";
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiJavascript,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiMongodb,
    SiPostgresql,
    SiVuedotjs,
    SiAngular,
    SiSvelte,
    SiRust,
    SiGo,
    SiRedis,
    SiGraphql,
    SiSupabase,
    SiFlutter,
    SiSwift,
    SiKotlin,
    SiDjango,
    SiExpress,
    SiPrisma,
    SiDocker,
    SiKubernetes,
    SiAmazonwebservices,
    SiFirebase,
    SiOpenai,
    SiThreedotjs,
    SiElectron,
    SiStripe,
    SiShopify,
    SiWordpress,
    SiLaravel,
    SiRubyonrails,
    SiSpring,
    SiDotnet,
    SiMysql,
    SiSqlite,
    SiTensorflow,
    SiPytorch,
} from "react-icons/si";
import { IconType } from "react-icons";

// Map tag names to their icons and colors
const TAG_ICONS: Record<string, { icon: IconType; color: string }> = {
    "React": { icon: SiReact, color: "#61DAFB" },
    "Next.js": { icon: SiNextdotjs, color: "#FFFFFF" },
    "Vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
    "Angular": { icon: SiAngular, color: "#DD0031" },
    "Svelte": { icon: SiSvelte, color: "#FF3E00" },
    "TypeScript": { icon: SiTypescript, color: "#3178C6" },
    "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
    "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
    "Three.js": { icon: SiThreedotjs, color: "#FFFFFF" },
    "Electron": { icon: SiElectron, color: "#47848F" },
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "Python": { icon: SiPython, color: "#3776AB" },
    "Go": { icon: SiGo, color: "#00ADD8" },
    "Rust": { icon: SiRust, color: "#DEA584" },
    "Express": { icon: SiExpress, color: "#FFFFFF" },
    "Django": { icon: SiDjango, color: "#092E20" },
    "Laravel": { icon: SiLaravel, color: "#FF2D20" },
    "Ruby on Rails": { icon: SiRubyonrails, color: "#CC0000" },
    "Spring": { icon: SiSpring, color: "#6DB33F" },
    ".NET": { icon: SiDotnet, color: "#512BD4" },
    "Flutter": { icon: SiFlutter, color: "#02569B" },
    "Swift": { icon: SiSwift, color: "#F05138" },
    "Kotlin": { icon: SiKotlin, color: "#7F52FF" },
    "PostgreSQL": { icon: SiPostgresql, color: "#4169E1" },
    "MongoDB": { icon: SiMongodb, color: "#47A248" },
    "MySQL": { icon: SiMysql, color: "#4479A1" },
    "SQLite": { icon: SiSqlite, color: "#003B57" },
    "Redis": { icon: SiRedis, color: "#DC382D" },
    "Supabase": { icon: SiSupabase, color: "#3FCF8E" },
    "Prisma": { icon: SiPrisma, color: "#2D3748" },
    "GraphQL": { icon: SiGraphql, color: "#E10098" },
    "Firebase": { icon: SiFirebase, color: "#FFCA28" },
    "Docker": { icon: SiDocker, color: "#2496ED" },
    "Kubernetes": { icon: SiKubernetes, color: "#326CE5" },
    "AWS": { icon: SiAmazonwebservices, color: "#FF9900" },
    "OpenAI": { icon: SiOpenai, color: "#412991" },
    "TensorFlow": { icon: SiTensorflow, color: "#FF6F00" },
    "PyTorch": { icon: SiPytorch, color: "#EE4C2C" },
    "Stripe": { icon: SiStripe, color: "#635BFF" },
    "Shopify": { icon: SiShopify, color: "#7AB55C" },
    "WordPress": { icon: SiWordpress, color: "#21759B" },
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
                                            <p className="text-zinc-400 text-base leading-relaxed mb-6">
                                                {project.description}
                                            </p>

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
