"use client";

import { useState } from "react";
import { PortfolioData, Education } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

const DEGREE_LEVELS = [
    "High School",
    "Associate's",
    "Bachelor's",
    "Master's",
    "PhD",
    "Bootcamp",
    "Self-Taught",
    "Other",
];

const emptyEducation: Omit<Education, "id"> = {
    institution: "",
    degreeLevel: "",
    degreeName: "",
    startDate: "",
    endDate: "",
    gpa: "",
};

export default function EducationStep({ data, updateData }: StepProps) {
    const [currentEducation, setCurrentEducation] =
        useState<Omit<Education, "id">>(emptyEducation);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const addEducation = () => {
        if (!currentEducation.institution.trim() || !currentEducation.degreeLevel) return;

        const newEducation: Education = {
            ...currentEducation,
            id: isEditing || Date.now().toString(),
        };

        if (isEditing) {
            updateData({
                education: data.education.map((e) =>
                    e.id === isEditing ? newEducation : e
                ),
            });
            setIsEditing(null);
        } else {
            updateData({ education: [...data.education, newEducation] });
        }

        setCurrentEducation(emptyEducation);
    };

    const removeEducation = (id: string) => {
        updateData({ education: data.education.filter((e) => e.id !== id) });
    };

    const editEducation = (education: Education) => {
        setCurrentEducation(education);
        setIsEditing(education.id);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Your{" "}
                    <span className="text-slate-400">
                        education
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">Add your educational background</p>
            </div>

            {/* Education Form */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Institution *
                        </label>
                        <input
                            type="text"
                            value={currentEducation.institution}
                            onChange={(e) =>
                                setCurrentEducation((prev) => ({ ...prev, institution: e.target.value }))
                            }
                            placeholder="Harvard University"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Degree Level *
                        </label>
                        <select
                            value={currentEducation.degreeLevel}
                            onChange={(e) =>
                                setCurrentEducation((prev) => ({ ...prev, degreeLevel: e.target.value }))
                            }
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-600 transition-all"
                        >
                            <option value="">Select level</option>
                            {DEGREE_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Degree / Field of Study
                        </label>
                        <input
                            type="text"
                            value={currentEducation.degreeName}
                            onChange={(e) =>
                                setCurrentEducation((prev) => ({ ...prev, degreeName: e.target.value }))
                            }
                            placeholder="Computer Science"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            GPA <span className="text-zinc-500">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={currentEducation.gpa || ""}
                            onChange={(e) =>
                                setCurrentEducation((prev) => ({ ...prev, gpa: e.target.value }))
                            }
                            placeholder="3.8 / 4.0"
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
                            value={currentEducation.startDate || ""}
                            onChange={(e) =>
                                setCurrentEducation((prev) => ({ ...prev, startDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            End Date / Expected
                        </label>
                        <input
                            type="month"
                            value={currentEducation.endDate || ""}
                            onChange={(e) =>
                                setCurrentEducation((prev) => ({ ...prev, endDate: e.target.value }))
                            }
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-600 transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={addEducation}
                    disabled={!currentEducation.institution.trim() || !currentEducation.degreeLevel}
                    className="w-full py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditing ? "Update Education" : "+ Add Education"}
                </button>
            </div>

            {/* Education List */}
            {data.education.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-400">
                        Your Education ({data.education.length})
                    </h3>
                    {data.education.map((edu) => (
                        <div
                            key={edu.id}
                            className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl"
                        >
                            <div>
                                <h4 className="font-medium text-white">{edu.institution}</h4>
                                <p className="text-sm text-zinc-400">
                                    {edu.degreeLevel}
                                    {edu.degreeName && ` in ${edu.degreeName}`}
                                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => editEducation(edu)}
                                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => removeEducation(edu.id)}
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
