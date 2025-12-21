"use client";

import { useState } from "react";
import { PortfolioData, WorkExperience } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

const emptyExperience: Omit<WorkExperience, "id"> = {
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    duties: "",
};

export default function ExperienceStep({ data, updateData }: StepProps) {
    const [currentExperience, setCurrentExperience] =
        useState<Omit<WorkExperience, "id">>(emptyExperience);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const addExperience = () => {
        if (!currentExperience.company.trim() || !currentExperience.title.trim()) return;

        const newExperience: WorkExperience = {
            ...currentExperience,
            id: isEditing || Date.now().toString(),
        };

        if (isEditing) {
            updateData({
                experience: data.experience.map((e) =>
                    e.id === isEditing ? newExperience : e
                ),
            });
            setIsEditing(null);
        } else {
            updateData({ experience: [...data.experience, newExperience] });
        }

        setCurrentExperience(emptyExperience);
    };

    const removeExperience = (id: string) => {
        updateData({ experience: data.experience.filter((e) => e.id !== id) });
    };

    const editExperience = (exp: WorkExperience) => {
        setCurrentExperience(exp);
        setIsEditing(exp.id);
    };

    const handlePresentToggle = () => {
        setCurrentExperience((prev) => ({
            ...prev,
            isPresent: !prev.isPresent,
            endDate: !prev.isPresent ? "" : prev.endDate,
        }));
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Work{" "}
                    <span className="text-slate-400">
                        experience
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">Add your professional experience</p>
            </div>

            {/* Experience Form */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Company *
                        </label>
                        <input
                            type="text"
                            value={currentExperience.company}
                            onChange={(e) =>
                                setCurrentExperience((prev) => ({ ...prev, company: e.target.value }))
                            }
                            placeholder="Google"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            value={currentExperience.title}
                            onChange={(e) =>
                                setCurrentExperience((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Software Engineer"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="month"
                            value={currentExperience.startDate}
                            onChange={(e) =>
                                setCurrentExperience((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            End Date
                        </label>
                        <div className="space-y-2">
                            <input
                                type="month"
                                value={currentExperience.endDate || ""}
                                onChange={(e) =>
                                    setCurrentExperience((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                disabled={currentExperience.isPresent}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={currentExperience.isPresent}
                                    onChange={handlePresentToggle}
                                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white accent-white focus:ring-white/20"
                                />
                                <span className="text-sm text-zinc-400">I currently work here</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Duties & Responsibilities
                    </label>
                    <textarea
                        value={currentExperience.duties}
                        onChange={(e) =>
                            setCurrentExperience((prev) => ({ ...prev, duties: e.target.value }))
                        }
                        placeholder="Describe your key responsibilities and achievements..."
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all resize-none"
                    />
                </div>

                <button
                    onClick={addExperience}
                    disabled={!currentExperience.company.trim() || !currentExperience.title.trim()}
                    className="w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditing ? "Update Experience" : "+ Add Experience"}
                </button>
            </div>

            {/* Experience List */}
            {data.experience.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-400">
                        Your Experience ({data.experience.length})
                    </h3>
                    {data.experience.map((exp) => (
                        <div
                            key={exp.id}
                            className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl"
                        >
                            <div>
                                <h4 className="font-medium text-white">{exp.title}</h4>
                                <p className="text-sm text-zinc-400">
                                    {exp.company}
                                    {exp.startDate && ` • ${exp.startDate}`}
                                    {exp.startDate && (exp.isPresent ? " - Present" : exp.endDate ? ` - ${exp.endDate}` : "")}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => editExperience(exp)}
                                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => removeExperience(exp.id)}
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
