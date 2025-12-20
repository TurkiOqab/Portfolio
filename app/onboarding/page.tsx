"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { PortfolioData, defaultPortfolioData } from "../types";
import NameStep from "./steps/NameStep";
import BioStep from "./steps/BioStep";
import SkillsStep from "./steps/SkillsStep";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import ProjectsStep from "./steps/ProjectsStep";
import ContactStep from "./steps/ContactStep";
import ProfilePictureStep from "./steps/ProfilePictureStep";
import CVStep from "./steps/CVStep";
import ThemeStep from "./steps/ThemeStep";
import { isValidEmail } from "../lib/validation";

const TOTAL_STEPS = 10;

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUserId(user.id);

            // Get username
            const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

            if (profile) {
                setUsername(profile.username);
            }

            // Check if portfolio exists
            const { data: portfolio } = await supabase
                .from("portfolios")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (portfolio) {
                // Load existing portfolio data
                const { data: projects } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("portfolio_id", portfolio.id)
                    .order("display_order");

                setData({
                    name: portfolio.name || "",
                    title: portfolio.title || "",
                    bio: portfolio.bio || "",
                    avatarUrl: portfolio.avatar_url || undefined,
                    cvUrl: portfolio.cv_url || undefined,
                    skills: portfolio.skills || [],
                    education: portfolio.education || [],
                    experience: portfolio.experience || [],
                    projects: (projects || []).map(p => ({
                        id: p.id,
                        title: p.title,
                        description: p.description || "",
                        tags: p.tags || [],
                        liveUrl: p.live_url || undefined,
                        githubUrl: p.github_url || undefined,
                    })),
                    contact: portfolio.contact || { email: "" },
                    theme: portfolio.theme || "violet",
                });
            }

            setIsLoading(false);
        };

        loadUserData();
    }, [router, supabase]);

    const updateData = (updates: Partial<PortfolioData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 1:
                return data.name.trim().length > 0 && data.title.trim().length > 0;
            case 2:
                return data.bio.trim().length >= 20;
            case 3:
                return data.skills.length >= 3;
            case 4:
                return data.education.length >= 1;
            case 5:
                return data.experience.length >= 1;
            case 6:
                return data.projects.length >= 1;
            case 7:
                return isValidEmail(data.contact.email);
            case 8:
                return !!data.avatarUrl; // Require profile picture or skip
            case 9:
                return !!data.cvUrl; // Require CV or skip
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
                if (data.bio.trim().length < 20) return `Bio must be at least 20 characters (${data.bio.trim().length}/20)`;
                return null;
            case 3:
                if (data.skills.length < 3) return `Please add at least 3 skills (${data.skills.length}/3)`;
                return null;
            case 4:
                if (data.education.length < 1) return "Add education or skip to continue";
                return null;
            case 5:
                if (data.experience.length < 1) return "Add experience or skip to continue";
                return null;
            case 6:
                if (data.projects.length < 1) return "Add a project or skip to continue";
                return null;
            case 7:
                if (!data.contact.email.trim()) return "Please enter your email address";
                if (!isValidEmail(data.contact.email)) return "Please enter a valid email address";
                return null;
            default:
                return null;
        }
    };

    const saveToDatabase = async () => {
        if (!userId) return;

        setIsSaving(true);

        try {
            // Upsert portfolio
            const { data: portfolio, error: portfolioError } = await supabase
                .from("portfolios")
                .upsert({
                    user_id: userId,
                    name: data.name,
                    title: data.title,
                    bio: data.bio,
                    avatar_url: data.avatarUrl || null,
                    cv_url: data.cvUrl || null,
                    skills: data.skills,
                    education: data.education,
                    experience: data.experience,
                    contact: data.contact,
                    theme: data.theme,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: "user_id",
                })
                .select()
                .single();

            if (portfolioError) throw portfolioError;

            if (portfolio && data.projects.length > 0) {
                // Delete existing projects
                await supabase
                    .from("projects")
                    .delete()
                    .eq("portfolio_id", portfolio.id);

                // Insert new projects
                const projectsToInsert = data.projects.map((p, index) => ({
                    portfolio_id: portfolio.id,
                    title: p.title,
                    description: p.description,
                    tags: p.tags,
                    live_url: p.liveUrl || null,
                    github_url: p.githubUrl || null,
                    display_order: index,
                }));

                await supabase.from("projects").insert(projectsToInsert);
            }

            router.push("/dashboard");
        } catch (error) {
            console.error("Error saving portfolio:", error);
            const err = error as { message?: string };
            setSaveError(err.message || "Failed to save portfolio. Please try again.");
            setIsSaving(false);
        }
    };

    const nextStep = () => {
        if (!canProceed()) return;
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
        } else {
            saveToDatabase();
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
        "Your education",
        "Work experience",
        "Showcase your work",
        "How can people reach you?",
        "Add a photo",
        "Upload your CV",
        "Choose your style",
    ];

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
            {/* Global Background Effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 z-0" />
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-pulse z-0 pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse z-0 pointer-events-none" />

            {/* Grid Pattern */}
            <div
                className="fixed inset-0 opacity-20 z-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />
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
                    {username && (
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            Your portfolio will be live at: <span className="text-violet-400">devfolio.com/{username}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 flex items-center justify-center pt-28 pb-24 px-6 relative z-10">
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
                        <EducationStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 5 && (
                        <ExperienceStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 6 && (
                        <ProjectsStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 7 && (
                        <ContactStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 8 && userId && (
                        <ProfilePictureStep data={data} updateData={updateData} userId={userId} />
                    )}
                    {currentStep === 9 && userId && (
                        <CVStep data={data} updateData={updateData} userId={userId} />
                    )}
                    {currentStep === 10 && (
                        <ThemeStep data={data} updateData={updateData} />
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800/50 z-50">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    {/* Save Error Message */}
                    {saveError && (
                        <div className="text-center mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <span className="text-sm text-red-400">
                                {saveError}
                            </span>
                        </div>
                    )}
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
                        <div className="flex items-center gap-3">
                            {((currentStep === 4 && data.education.length === 0) ||
                                (currentStep === 5 && data.experience.length === 0) ||
                                (currentStep === 6 && data.projects.length === 0) ||
                                (currentStep === 8 && !data.avatarUrl) ||
                                (currentStep === 9 && !data.cvUrl)) && (
                                    <button
                                        onClick={skipStep}
                                        className="px-6 py-3 text-zinc-400 hover:text-white border border-zinc-700 rounded-full transition-colors"
                                    >
                                        Skip for now
                                    </button>
                                )}
                            <button
                                onClick={nextStep}
                                disabled={!canProceed() || isSaving}
                                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-full hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : currentStep === TOTAL_STEPS ? (
                                    "Publish Portfolio →"
                                ) : (
                                    "Continue →"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
