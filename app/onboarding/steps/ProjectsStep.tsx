"use client";

import { useState } from "react";
import { PortfolioData, Project } from "../../types";
import { isValidProjectUrl } from "@/app/lib/validation";
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

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    onSkip?: () => void;
}

interface Tag {
    name: string;
    icon: IconType;
    color: string;
}

// Available tags for projects (technologies commonly used in projects)
const AVAILABLE_TAGS: Tag[] = [
    // Frontend
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
    { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
    { name: "Angular", icon: SiAngular, color: "#DD0031" },
    { name: "Svelte", icon: SiSvelte, color: "#FF3E00" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Three.js", icon: SiThreedotjs, color: "#FFFFFF" },
    { name: "Electron", icon: SiElectron, color: "#47848F" },

    // Backend
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "Go", icon: SiGo, color: "#00ADD8" },
    { name: "Rust", icon: SiRust, color: "#DEA584" },
    { name: "Express", icon: SiExpress, color: "#FFFFFF" },
    { name: "Django", icon: SiDjango, color: "#092E20" },
    { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
    { name: "Ruby on Rails", icon: SiRubyonrails, color: "#CC0000" },
    { name: "Spring", icon: SiSpring, color: "#6DB33F" },
    { name: ".NET", icon: SiDotnet, color: "#512BD4" },

    // Mobile
    { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    { name: "Swift", icon: SiSwift, color: "#F05138" },
    { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },

    // Databases
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "SQLite", icon: SiSqlite, color: "#003B57" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
    { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },

    // DevOps & Cloud
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
    { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },

    // AI/ML
    { name: "OpenAI", icon: SiOpenai, color: "#412991" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },

    // E-commerce & CMS
    { name: "Stripe", icon: SiStripe, color: "#635BFF" },
    { name: "Shopify", icon: SiShopify, color: "#7AB55C" },
    { name: "WordPress", icon: SiWordpress, color: "#21759B" },
];

const MAX_TAGS = 5;

const emptyProject: Omit<Project, "id"> = {
    title: "",
    description: "",
    tags: [],
    liveUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
};

export default function ProjectsStep({ data, updateData, onSkip }: StepProps) {
    const [currentProject, setCurrentProject] =
        useState<Omit<Project, "id">>(emptyProject);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);
    const [showTagMenu, setShowTagMenu] = useState(false);

    const addProject = () => {
        if (!currentProject.title.trim()) return;

        // Validate URLs before adding
        setUrlError(null);
        if (currentProject.liveUrl && !isValidProjectUrl(currentProject.liveUrl)) {
            setUrlError("Please enter a valid URL for Live URL (https:// or http://)");
            return;
        }
        if (currentProject.githubUrl && !isValidProjectUrl(currentProject.githubUrl)) {
            setUrlError("Please enter a valid URL for GitHub URL (https:// or http://)");
            return;
        }

        const newProject: Project = {
            ...currentProject,
            id: isEditing || Date.now().toString(),
        };

        if (isEditing) {
            updateData({
                projects: data.projects.map((p) =>
                    p.id === isEditing ? newProject : p
                ),
            });
            setIsEditing(null);
        } else {
            updateData({ projects: [...data.projects, newProject] });
        }

        setCurrentProject(emptyProject);
        setShowTagMenu(false);
    };

    const removeProject = (id: string) => {
        updateData({ projects: data.projects.filter((p) => p.id !== id) });
    };

    const editProject = (project: Project) => {
        setCurrentProject(project);
        setIsEditing(project.id);
        setShowTagMenu(false);
    };

    const toggleTag = (tagName: string) => {
        if (currentProject.tags.includes(tagName)) {
            setCurrentProject((prev) => ({
                ...prev,
                tags: prev.tags.filter((t) => t !== tagName),
            }));
        } else if (currentProject.tags.length < MAX_TAGS) {
            setCurrentProject((prev) => ({
                ...prev,
                tags: [...prev.tags, tagName],
            }));
        }
    };

    const removeTag = (tag: string) => {
        setCurrentProject((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Showcase your{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        work
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">Add your best projects</p>
            </div>

            {/* Project Form */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            value={currentProject.title}
                            onChange={(e) =>
                                setCurrentProject((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="E-Commerce Platform"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Tech Stack
                            <span className="text-zinc-500 font-normal ml-2">
                                ({currentProject.tags.length}/{MAX_TAGS})
                            </span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowTagMenu(!showTagMenu)}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-left text-zinc-400 hover:border-zinc-600 transition-all flex items-center justify-between"
                        >
                            <span>
                                {currentProject.tags.length === 0
                                    ? "Select technologies..."
                                    : `${currentProject.tags.length} selected`}
                            </span>
                            <svg
                                className={`w-5 h-5 transition-transform ${showTagMenu ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Selected Tags */}
                {currentProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {currentProject.tags.map((tag) => {
                            const tagData = AVAILABLE_TAGS.find(t => t.name === tag);
                            const Icon = tagData?.icon;

                            return (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-full text-sm text-violet-300"
                                >
                                    {Icon && <Icon className="w-4 h-4" style={{ color: tagData?.color }} />}
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="w-4 h-4 flex items-center justify-center rounded-full bg-violet-500/30 hover:bg-violet-500/50 transition-colors text-xs"
                                    >
                                        ×
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Tag Selection Menu */}
                {showTagMenu && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {AVAILABLE_TAGS.map((tag) => {
                                const Icon = tag.icon;
                                const selected = currentProject.tags.includes(tag.name);
                                const disabled = !selected && currentProject.tags.length >= MAX_TAGS;

                                return (
                                    <button
                                        key={tag.name}
                                        type="button"
                                        onClick={() => toggleTag(tag.name)}
                                        disabled={disabled}
                                        className={`
                                            flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all duration-200
                                            ${selected
                                                ? "bg-violet-600/20 border-violet-500 ring-1 ring-violet-500/50"
                                                : disabled
                                                    ? "bg-zinc-900/30 border-zinc-800 opacity-40 cursor-not-allowed"
                                                    : "bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
                                            }
                                        `}
                                    >
                                        <Icon
                                            className="w-6 h-6 transition-transform duration-200"
                                            style={{ color: selected ? tag.color : "#71717a" }}
                                        />
                                        <span className={`text-[10px] font-medium text-center leading-tight ${selected ? "text-white" : "text-zinc-400"}`}>
                                            {tag.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={currentProject.description}
                        onChange={(e) =>
                            setCurrentProject((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        placeholder="A brief description of your project..."
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all resize-none"
                    />
                </div>

                {urlError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm">{urlError}</p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="month"
                            value={currentProject.startDate}
                            onChange={(e) =>
                                setCurrentProject((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            End Date
                        </label>
                        <input
                            type="month"
                            value={currentProject.endDate}
                            onChange={(e) =>
                                setCurrentProject((prev) => ({ ...prev, endDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Live URL
                        </label>
                        <input
                            type="url"
                            value={currentProject.liveUrl}
                            onChange={(e) => {
                                setUrlError(null);
                                setCurrentProject((prev) => ({ ...prev, liveUrl: e.target.value }));
                            }}
                            placeholder="https://myproject.com"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            value={currentProject.githubUrl}
                            onChange={(e) => {
                                setUrlError(null);
                                setCurrentProject((prev) => ({
                                    ...prev,
                                    githubUrl: e.target.value,
                                }));
                            }}
                            placeholder="https://github.com/user/repo"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={addProject}
                    disabled={!currentProject.title.trim()}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditing ? "Update Project" : "+ Add Project"}
                </button>
            </div>

            {/* Projects List */}
            {data.projects.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-400">
                        Your Projects ({data.projects.length})
                    </h3>
                    {data.projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl"
                        >
                            <div>
                                <h4 className="font-medium text-white">{project.title}</h4>
                                <div className="flex gap-2 mt-1">
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => editProject(project)}
                                    className="p-2 text-zinc-400 hover:text-violet-400 transition-colors"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => removeProject(project.id)}
                                    className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
