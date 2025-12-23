"use client";

import { useState, useRef } from "react";
import { PortfolioData, Project } from "../../types";
import { isValidProjectUrl } from "@/app/lib/validation";
import { createClient } from "@/app/lib/supabase/client";
import MarkdownEditor from "../../components/editor/MarkdownEditor";
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

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    onSkip?: () => void;
    userId?: string;
}

interface Tag {
    name: string;
    icon: IconType;
    color: string;
}

// Comprehensive tags for all developer types (A-Z)
const AVAILABLE_TAGS: Tag[] = [
    { name: "Android", icon: SiAndroid, color: "#3DDC84" },
    { name: "Angular", icon: SiAngular, color: "#DD0031" },
    { name: "Anthropic", icon: SiAnthropic, color: "#D4A27F" },
    { name: "Arduino", icon: SiArduino, color: "#00979D" },
    { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
    { name: "Blender", icon: SiBlender, color: "#F5792A" },
    { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    { name: "C", icon: SiC, color: "#A8B9CC" },
    { name: "C#", icon: TbBrandCSharp, color: "#512BD4" },
    { name: "C++", icon: SiCplusplus, color: "#00599C" },
    { name: "CSS", icon: SiCss3, color: "#1572B6" },
    { name: "Django", icon: SiDjango, color: "#092E20" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Elasticsearch", icon: SiElasticsearch, color: "#005571" },
    { name: "Express", icon: SiExpress, color: "#FFFFFF" },
    { name: "FastAPI", icon: SiFastapi, color: "#009688" },
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    { name: "Flask", icon: SiFlask, color: "#FFFFFF" },
    { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
    { name: "GitLab", icon: SiGitlab, color: "#FC6D26" },
    { name: "Go", icon: SiGo, color: "#00ADD8" },
    { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
    { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    { name: "HTML", icon: SiHtml5, color: "#E34F26" },
    { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E" },
    { name: "iOS", icon: SiIos, color: "#FFFFFF" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "Jupyter", icon: SiJupyter, color: "#F37626" },
    { name: "Keras", icon: SiKeras, color: "#D00000" },
    { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
    { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
    { name: "LangChain", icon: SiLangchain, color: "#1C3C3C" },
    { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
    { name: ".NET", icon: SiDotnet, color: "#512BD4" },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "NumPy", icon: SiNumpy, color: "#013243" },
    { name: "Ollama", icon: SiOllama, color: "#FFFFFF" },
    { name: "OpenAI", icon: SiOpenai, color: "#412991" },
    { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
    { name: "Pandas", icon: SiPandas, color: "#150458" },
    { name: "PHP", icon: SiPhp, color: "#777BB4" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "R", icon: SiR, color: "#276DC3" },
    { name: "Raspberry Pi", icon: SiRaspberrypi, color: "#A22846" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "Ruby", icon: SiRuby, color: "#CC342D" },
    { name: "Ruby on Rails", icon: SiRubyonrails, color: "#CC0000" },
    { name: "Rust", icon: SiRust, color: "#DEA584" },
    { name: "scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
    { name: "Spring", icon: SiSpring, color: "#6DB33F" },
    { name: "SQLite", icon: SiSqlite, color: "#003B57" },
    { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    { name: "Svelte", icon: SiSvelte, color: "#FF3E00" },
    { name: "Swift", icon: SiSwift, color: "#F05138" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "Terraform", icon: SiTerraform, color: "#7B42BC" },
    { name: "Three.js", icon: SiThreedotjs, color: "#FFFFFF" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Unity", icon: SiUnity, color: "#FFFFFF" },
    { name: "Unreal Engine", icon: SiUnrealengine, color: "#0E1128" },
    { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
    { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
];

const MAX_TAGS = 5;

const emptyProject: Omit<Project, "id"> = {
    title: "",
    description: "",
    tags: [],
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
};

export default function ProjectsStep({ data, updateData, onSkip, userId }: StepProps) {
    const [currentProject, setCurrentProject] =
        useState<Omit<Project, "id">>(emptyProject);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [showTagMenu, setShowTagMenu] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError("Image must be less than 5MB");
            return;
        }

        setImageError(null);
        setIsUploadingImage(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            const fileExt = file.name.split(".").pop();
            const fileName = `project-${userId || 'anon'}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("projects")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("projects")
                .getPublicUrl(fileName);

            setCurrentProject((prev) => ({ ...prev, imageUrl: urlData.publicUrl }));
        } catch (err) {
            console.error("Upload error:", err);
            const error = err as { message?: string; error?: string };
            setImageError(error.message || error.error || "Failed to upload image");
            setImagePreview(null);
        }

        setIsUploadingImage(false);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setCurrentProject((prev) => ({ ...prev, imageUrl: "" }));
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const validateDates = (): boolean => {
        if (currentProject.startDate && currentProject.endDate) {
            if (currentProject.endDate < currentProject.startDate) {
                setDateError("End date cannot be before start date");
                return false;
            }
        }
        setDateError(null);
        return true;
    };

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
        if (!validateDates()) return;

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
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const removeProject = (id: string) => {
        updateData({ projects: data.projects.filter((p) => p.id !== id) });
    };

    const editProject = (project: Project) => {
        setCurrentProject(project);
        setIsEditing(project.id);
        setShowTagMenu(false);
        setImagePreview(project.imageUrl || null);
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
                    <span className="text-slate-400">
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
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
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
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-zinc-300"
                                >
                                    {Icon && <Icon className="w-4 h-4" style={{ color: tagData?.color }} />}
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-xs"
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
                                                ? "bg-white/10 border-white ring-1 ring-white/30"
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
                    <MarkdownEditor
                        value={currentProject.description}
                        onChange={(description) =>
                            setCurrentProject((prev) => ({
                                ...prev,
                                description,
                            }))
                        }
                        placeholder="A brief description of your project..."
                        minHeight="120px"
                        showPreview={true}
                        showCharCount={false}
                    />
                </div>

                {/* Project Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Project Screenshot
                        <span className="text-zinc-500 font-normal ml-2">(optional)</span>
                    </label>
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            {imagePreview || currentProject.imageUrl ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview || currentProject.imageUrl}
                                        alt="Project preview"
                                        className="w-32 h-20 rounded-lg object-cover border border-zinc-700"
                                    />
                                    {isUploadingImage && (
                                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-32 h-20 rounded-lg bg-zinc-800 border border-zinc-700 border-dashed flex items-center justify-center">
                                    <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700 hover:border-zinc-600 transition-all disabled:opacity-50"
                                >
                                    {isUploadingImage ? "Uploading..." : imagePreview || currentProject.imageUrl ? "Change" : "Upload"}
                                </button>
                                {(imagePreview || currentProject.imageUrl) && !isUploadingImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="px-3 py-1.5 border border-zinc-700 text-zinc-400 text-sm rounded-lg hover:bg-zinc-800 transition-all"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-zinc-500 text-xs mt-1">Max 5MB, PNG/JPG recommended</p>
                            {imageError && (
                                <p className="text-red-400 text-xs mt-1">{imageError}</p>
                            )}
                        </div>
                    </div>
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
                            onChange={(e) => {
                                setDateError(null);
                                setCurrentProject((prev) => ({ ...prev, startDate: e.target.value }));
                            }}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            End Date
                        </label>
                        <input
                            type="month"
                            value={currentProject.endDate}
                            onChange={(e) => {
                                setDateError(null);
                                setCurrentProject((prev) => ({ ...prev, endDate: e.target.value }));
                            }}
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                </div>

                {dateError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm">{dateError}</p>
                    </div>
                )}

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
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
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
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={addProject}
                    disabled={!currentProject.title.trim()}
                    className="w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="p-2 text-zinc-400 hover:text-white transition-colors"
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
