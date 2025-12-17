"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortfolioData, defaultPortfolioData } from "../types";
import { savePortfolioData, getPortfolioData } from "../lib/storage";
import NameStep from "./steps/NameStep";
import BioStep from "./steps/BioStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ContactStep from "./steps/ContactStep";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load existing data if available
        const existingData = getPortfolioData();
        if (existingData.name) {
            setData(existingData);
        }
        setIsLoading(false);
    }, []);

    const updateData = (updates: Partial<PortfolioData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 1:
                return data.name.trim().length > 0 && data.title.trim().length > 0;
            case 2:
                return data.bio.trim().length >= 50;
            default:
                return true;
        }
    };

    const getValidationMessage = (): string | null => {
        switch (currentStep) {
            case 1:
                if (!data.name.trim()) return "Please enter your name";
                if (!data.title.trim()) return "Please enter your professional title";
                return null;
            case 2:
                if (data.bio.trim().length < 50) return `Bio must be at least 50 characters (${data.bio.trim().length}/50)`;
                return null;
            default:
                return null;
        }
    };

    const nextStep = () => {
        if (!canProceed()) return;
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // Save and go to export page
            savePortfolioData(data);
            router.push("/export");
        }
    };

    const skipStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const stepTitles = [
        "Let's get started",
        "Tell us about yourself",
        "What are your skills?",
        "Showcase your work",
        "How can people reach you?",
    ];

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">
                            Step {currentStep} of {TOTAL_STEPS}
                        </span>
                        <span className="text-sm text-violet-400 font-medium">
                            {stepTitles[currentStep - 1]}
                        </span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500"
                            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 flex items-center justify-center pt-24 pb-24 px-6">
                <div className="w-full max-w-2xl">
                    {currentStep === 1 && (
                        <NameStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 2 && (
                        <BioStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 3 && (
                        <SkillsStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 4 && (
                        <ProjectsStep data={data} updateData={updateData} onSkip={skipStep} />
                    )}
                    {currentStep === 5 && (
                        <ContactStep data={data} updateData={updateData} />
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800/50">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    {/* Validation Message */}
                    {getValidationMessage() && (
                        <div className="text-center mb-3">
                            <span className="text-sm text-amber-400">
                                {getValidationMessage()}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="px-6 py-3 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-full hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentStep === TOTAL_STEPS ? "Finish →" : "Continue →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
