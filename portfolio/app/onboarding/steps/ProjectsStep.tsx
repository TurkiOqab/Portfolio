"use client";

import { useState } from "react";
import { PortfolioData, Project } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    onSkip?: () => void;
}

const emptyProject: Omit<Project, "id"> = {
    title: "",
    description: "",
    tags: [],
    liveUrl: "",
    githubUrl: "",
};

export default function ProjectsStep({ data, updateData, onSkip }: StepProps) {
    const [currentProject, setCurrentProject] =
        useState<Omit<Project, "id">>(emptyProject);
    const [tagInput, setTagInput] = useState("");
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const addProject = () => {
        if (!currentProject.title.trim()) return;

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
    };

    const removeProject = (id: string) => {
        updateData({ projects: data.projects.filter((p) => p.id !== id) });
    };

    const editProject = (project: Project) => {
        setCurrentProject(project);
        setIsEditing(project.id);
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !currentProject.tags.includes(tag)) {
            setCurrentProject((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        setTagInput("");
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
                {data.projects.length === 0 && onSkip && (
                    <button
                        onClick={onSkip}
                        className="mt-4 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4 transition-colors"
                    >
                        Skip for now — I&apos;ll add projects later
                    </button>
                )}
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
                            Tags
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                placeholder="React, Node.js..."
                                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                            />
                            <button
                                onClick={addTag}
                                className="px-3 py-3 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {currentProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {currentProject.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full text-sm text-violet-300"
                            >
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-white">
                                    ×
                                </button>
                            </span>
                        ))}
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

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Live URL
                        </label>
                        <input
                            type="url"
                            value={currentProject.liveUrl}
                            onChange={(e) =>
                                setCurrentProject((prev) => ({ ...prev, liveUrl: e.target.value }))
                            }
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
                            onChange={(e) =>
                                setCurrentProject((prev) => ({
                                    ...prev,
                                    githubUrl: e.target.value,
                                }))
                            }
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
