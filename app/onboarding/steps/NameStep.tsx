"use client";

import { useState } from "react";
import { PortfolioData } from "../../types";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

export default function NameStep({ data, updateData }: StepProps) {
    const [touched, setTouched] = useState({ name: false, title: false });

    const getInputClass = (field: "name" | "title") => {
        const baseClass = "w-full px-4 py-4 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-lg";
        const isEmpty = !data[field].trim();
        const isTouched = touched[field];

        if (isTouched && isEmpty) {
            return `${baseClass} border-red-500/50 focus:border-red-500 focus:ring-red-500`;
        }
        return `${baseClass} border-zinc-800 focus:border-zinc-600 focus:ring-white/20`;
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    What&apos;s your{" "}
                    <span className="text-slate-400">
                        name?
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg">
                    Let&apos;s start building your portfolio
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                        placeholder="John Doe"
                        className={getInputClass("name")}
                    />
                    {touched.name && !data.name.trim() && (
                        <p className="mt-2 text-sm text-red-400">Name is required</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Professional Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => updateData({ title: e.target.value })}
                        onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                        placeholder="Full-Stack Developer"
                        className={getInputClass("title")}
                    />
                    {touched.title && !data.title.trim() && (
                        <p className="mt-2 text-sm text-red-400">Professional title is required</p>
                    )}
                </div>
            </div>
        </div>
    );
}
