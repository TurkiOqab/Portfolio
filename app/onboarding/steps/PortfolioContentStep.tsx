"use client";

import { useState } from "react";
import { PortfolioData } from "../../types";
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import ProjectsStep from "./ProjectsStep";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
    onSkip?: () => void;
}

type TabType = "education" | "experience" | "projects";

export default function PortfolioContentStep({ data, updateData, onSkip }: StepProps) {
    const [activeTab, setActiveTab] = useState<TabType>("education");

    const hasNoContent = data.education.length === 0 && data.experience.length === 0 && data.projects.length === 0;

    const tabs: { id: TabType; label: string; count: number }[] = [
        { id: "education", label: "Education", count: data.education.length },
        { id: "experience", label: "Experience", count: data.experience.length },
        { id: "projects", label: "Projects", count: data.projects.length },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Build your{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        portfolio
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Add your education, experience, and projects
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
                <div className="inline-flex bg-zinc-900/50 border border-zinc-800 rounded-xl p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-violet-600 text-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id
                                        ? "bg-violet-500 text-white"
                                        : "bg-zinc-700 text-zinc-300"
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "education" && (
                    <div className="space-y-4">
                        <EducationStep data={data} updateData={updateData} />
                    </div>
                )}
                {activeTab === "experience" && (
                    <div className="space-y-4">
                        <ExperienceStep data={data} updateData={updateData} />
                    </div>
                )}
                {activeTab === "projects" && (
                    <div className="space-y-4">
                        <ProjectsStep data={data} updateData={updateData} />
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="flex justify-center gap-4 pt-4 border-t border-zinc-800">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{data.education.length}</div>
                    <div className="text-xs text-zinc-500">Education</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{data.experience.length}</div>
                    <div className="text-xs text-zinc-500">Experience</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{data.projects.length}</div>
                    <div className="text-xs text-zinc-500">Projects</div>
                </div>
            </div>

            {/* Skip Button */}
            {hasNoContent && onSkip && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={onSkip}
                        className="px-6 py-3 text-zinc-400 hover:text-white border border-zinc-700 rounded-full transition-colors hover:border-zinc-500"
                    >
                        Skip for now
                    </button>
                </div>
            )}
        </div>
    );
}
