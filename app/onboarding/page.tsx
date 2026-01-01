"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { PortfolioData, defaultPortfolioData } from "../types";
import CVImportStep from "./steps/CVImportStep";
import NameStep from "./steps/NameStep";
import BioStep from "./steps/BioStep";
import SkillsStep from "./steps/SkillsStep";
import ContactStep from "./steps/ContactStep";
import PortfolioContentStep from "./steps/PortfolioContentStep";
import MediaUploadStep from "./steps/MediaUploadStep";
import ThemeStep from "./steps/ThemeStep";
import { isValidEmail } from "../lib/validation";

const TOTAL_STEPS = 8;

export default function OnboardingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isReturningUser, setIsReturningUser] = useState(false);
    const [isAnalyzingCV, setIsAnalyzingCV] = useState(false);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [cvParseSuccess, setCvParseSuccess] = useState(false);

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
                        startDate: p.start_date || undefined,
                        endDate: p.end_date || undefined,
                    })),
                    contact: portfolio.contact || { email: "" },
                    theme: portfolio.theme || "slate",
                    font: portfolio.font || "outfit",
                });

                // Mark as returning user (will show CV import prompt)
                setIsReturningUser(true);

                // Check for direct step navigation via query param
                const stepParam = searchParams.get('step');
                if (stepParam) {
                    const targetStep = parseInt(stepParam, 10);
                    if (targetStep >= 1 && targetStep <= TOTAL_STEPS) {
                        setCurrentStep(targetStep);
                    }
                }
            }

            setIsLoading(false);
        };

        loadUserData();
    }, [router, supabase, searchParams]);

    const updateData = (updates: Partial<PortfolioData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 1:
                // CV import - can only proceed after successful parse (use Skip to bypass)
                return cvParseSuccess;
            case 2:
                return data.name.trim().length > 0 && data.title.trim().length > 0;
            case 3:
                return data.bio.trim().length >= 20;
            case 4:
                return data.skills.length >= 3;
            case 5:
                return isValidEmail(data.contact.email);
            case 6:
                // Portfolio content - at least one item in any category
                return data.education.length >= 1 || data.experience.length >= 1 || data.projects.length >= 1;
            case 7:
                // Media upload - optional
                return true;
            default:
                return true;
        }
    };

    const getValidationMessage = (): string | null => {
        switch (currentStep) {
            case 1:
                // CV import - no validation needed
                return null;
            case 2:
                if (!data.name.trim()) return "Please enter your name";
                if (!data.title.trim()) return "Please enter your professional title";
                return null;
            case 3:
                if (data.bio.trim().length < 20) return `Bio must be at least 20 characters (${data.bio.trim().length}/20)`;
                return null;
            case 4:
                if (data.skills.length < 3) return `Please add at least 3 skills (${data.skills.length}/3)`;
                return null;
            case 5:
                if (!data.contact.email.trim()) return "Please enter your email address";
                if (!isValidEmail(data.contact.email)) return "Please enter a valid email address";
                return null;
            case 6:
                if (data.education.length === 0 && data.experience.length === 0 && data.projects.length === 0)
                    return "Add at least one education, experience, or project entry";
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
                    font: data.font,
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
                    start_date: p.startDate || null,
                    end_date: p.endDate || null,
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
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const stepTitles = [
        "Import your CV",
        "Let's get started",
        "Tell us about yourself",
        "What are your skills?",
        "How can people reach you?",
        "Build your portfolio",
        "Add your media",
        "Choose your style",
    ];

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
            {/* Global Background Effects - using transform for GPU acceleration to prevent mobile scroll artifacts */}
            <div className="fixed inset-0 bg-zinc-950 z-0 transform-gpu" />
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl z-0 pointer-events-none hidden sm:block" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl z-0 pointer-events-none hidden sm:block" />

            {/* Grid Pattern - hidden on mobile to prevent scroll artifacts */}
            <div
                className="fixed inset-0 opacity-20 z-0 pointer-events-none hidden sm:block"
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
                        <span className="text-sm text-white font-medium">
                            {stepTitles[currentStep - 1]}
                        </span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>
                    {username && (
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            Your portfolio will be live at: <span className="text-white">dfolio.dev/{username}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 flex items-center justify-center pt-28 pb-32 px-6 relative z-10 overflow-y-auto">
                <div className={`w-full ${currentStep === 6 ? 'max-w-4xl' : 'max-w-2xl'}`}>
                    {currentStep === 1 && (
                        <CVImportStep data={data} updateData={updateData} onSkip={skipStep} isReturningUser={isReturningUser} onAnalyzingChange={setIsAnalyzingCV} onParseSuccess={setCvParseSuccess} userId={userId || undefined} />
                    )}
                    {currentStep === 2 && (
                        <NameStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 3 && (
                        <BioStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 4 && (
                        <SkillsStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 5 && (
                        <ContactStep data={data} updateData={updateData} />
                    )}
                    {currentStep === 6 && (
                        <PortfolioContentStep data={data} updateData={updateData} userId={userId || undefined} />
                    )}
                    {currentStep === 7 && userId && (
                        <MediaUploadStep data={data} updateData={updateData} userId={userId} onUploadingChange={setIsUploadingMedia} />
                    )}
                    {currentStep === 8 && (
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
                            disabled={currentStep === 1 || isAnalyzingCV || isUploadingMedia}
                            className="px-6 py-3 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Back
                        </button>
                        <div className="flex items-center gap-3">
                            {/* Skip button for optional steps (1: CV Import, 6: Portfolio Content, 7: Media) */}
                            {(currentStep === 1 || currentStep === 6 || currentStep === 7) && (
                                <button
                                    onClick={skipStep}
                                    disabled={isAnalyzingCV || isUploadingMedia}
                                    className="px-6 py-3 text-zinc-400 hover:text-white border border-zinc-700 rounded-full transition-colors hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Skip for now
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                disabled={!canProceed() || isSaving || isAnalyzingCV || isUploadingMedia}
                                className="px-8 py-3 bg-white text-zinc-900 font-medium rounded-full hover:bg-zinc-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
