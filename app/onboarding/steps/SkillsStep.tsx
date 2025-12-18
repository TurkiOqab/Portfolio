"use client";

import { useState } from "react";
import { PortfolioData } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

const SUGGESTED_SKILLS = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Tailwind CSS",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Git",
    "OpenAI",
    "LangChain",
    "Machine Learning",
    "TensorFlow",
    "LLM",
    "RAG",
];

export default function SkillsStep({ data, updateData }: StepProps) {
    const [inputValue, setInputValue] = useState("");

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !data.skills.includes(trimmed)) {
            updateData({ skills: [...data.skills, trimmed] });
        }
        setInputValue("");
    };

    const removeSkill = (skillToRemove: string) => {
        updateData({ skills: data.skills.filter((s) => s !== skillToRemove) });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill(inputValue);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    What are your{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        skills?
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Add the technologies and tools you work with
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Add a skill
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a skill and press Enter"
                            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        />
                        <button
                            onClick={() => addSkill(inputValue)}
                            className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Selected Skills */}
                {data.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/20 border border-violet-500/30 rounded-full text-violet-300"
                            >
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="w-4 h-4 flex items-center justify-center rounded-full bg-violet-500/30 hover:bg-violet-500/50 transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Suggestions */}
                <div>
                    <p className="text-sm text-zinc-500 mb-2">Popular skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_SKILLS.filter((s) => !data.skills.includes(s)).map(
                            (skill) => (
                                <button
                                    key={skill}
                                    onClick={() => addSkill(skill)}
                                    className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-sm text-zinc-400 hover:border-violet-500/50 hover:text-violet-400 transition-all"
                                >
                                    + {skill}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
