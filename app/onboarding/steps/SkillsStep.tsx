"use client";

import { PortfolioData } from "../../types";
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiJavascript,
    SiPython,
    SiNodedotjs,
    SiTailwindcss,
    SiGit,
    SiDocker,
    SiAmazonwebservices,
    SiFirebase,
    SiMongodb,
    SiPostgresql,
    SiHtml5,
    SiCss3,
    SiVuedotjs,
    SiAngular,
    SiSvelte,
    SiRust,
    SiGo,
    SiKubernetes,
    SiRedis,
    SiGraphql,
    SiSupabase,
    SiVercel,
    SiFigma,
    SiFlutter,
    SiSwift,
    SiKotlin,
    SiDjango,
    SiExpress,
    SiPrisma,
    SiGithub,
    SiLinux,
    SiOpenai,
} from "react-icons/si";
import { IconType } from "react-icons";

interface StepProps {
    data: PortfolioData;
    updateData: (updates: Partial<PortfolioData>) => void;
}

interface Skill {
    name: string;
    icon: IconType;
    color: string;
}

// Top 35 technologies in the industry
const AVAILABLE_SKILLS: Skill[] = [
    // Frontend
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
    { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
    { name: "Angular", icon: SiAngular, color: "#DD0031" },
    { name: "Svelte", icon: SiSvelte, color: "#FF3E00" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", icon: SiCss3, color: "#1572B6" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },

    // Backend
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "Go", icon: SiGo, color: "#00ADD8" },
    { name: "Rust", icon: SiRust, color: "#DEA584" },
    { name: "Express", icon: SiExpress, color: "#FFFFFF" },
    { name: "Django", icon: SiDjango, color: "#092E20" },

    // Mobile
    { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    { name: "Swift", icon: SiSwift, color: "#F05138" },
    { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },

    // Databases
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
    { name: "GraphQL", icon: SiGraphql, color: "#E10098" },

    // DevOps & Cloud
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
    { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },

    // Tools
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },

    // AI
    { name: "OpenAI", icon: SiOpenai, color: "#412991" },
];

export default function SkillsStep({ data, updateData }: StepProps) {
    const toggleSkill = (skillName: string) => {
        if (data.skills.includes(skillName)) {
            updateData({ skills: data.skills.filter((s) => s !== skillName) });
        } else {
            updateData({ skills: [...data.skills, skillName] });
        }
    };

    const isSelected = (skillName: string) => data.skills.includes(skillName);

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
                    Select the technologies you work with
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                    {data.skills.length} selected {data.skills.length < 3 && "(minimum 3)"}
                </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {AVAILABLE_SKILLS.map((skill) => {
                    const Icon = skill.icon;
                    const selected = isSelected(skill.name);

                    return (
                        <button
                            key={skill.name}
                            onClick={() => toggleSkill(skill.name)}
                            className={`
                                flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200
                                ${selected
                                    ? "bg-violet-600/20 border-violet-500 ring-1 ring-violet-500/50"
                                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50"
                                }
                            `}
                        >
                            <Icon
                                className="w-8 h-8 transition-transform duration-200"
                                style={{ color: selected ? skill.color : "#71717a" }}
                            />
                            <span className={`text-xs font-medium text-center leading-tight ${selected ? "text-white" : "text-zinc-400"}`}>
                                {skill.name}
                            </span>
                            {selected && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Skills Summary */}
            {data.skills.length > 0 && (
                <div className="pt-4 border-t border-zinc-800">
                    <p className="text-sm text-zinc-500 mb-3">Selected skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => {
                            const skillData = AVAILABLE_SKILLS.find(s => s.name === skill);
                            const Icon = skillData?.icon;

                            return (
                                <span
                                    key={skill}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-full text-sm text-violet-300"
                                >
                                    {Icon && <Icon className="w-4 h-4" style={{ color: skillData?.color }} />}
                                    {skill}
                                    <button
                                        onClick={() => toggleSkill(skill)}
                                        className="w-4 h-4 flex items-center justify-center rounded-full bg-violet-500/30 hover:bg-violet-500/50 transition-colors text-xs"
                                    >
                                        ×
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
