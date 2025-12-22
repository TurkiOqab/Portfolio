"use client";

import { PortfolioData } from "../../types";
import {
    SiAmazonwebservices,
    SiAngular,
    SiAntdesign,
    SiApollographql,
    SiBootstrap,
    SiC,
    SiCloudflare,
    SiCplusplus,
    SiCss3,
    SiCypress,
    SiDart,
    SiDjango,
    SiDocker,
    SiDotnet,
    SiElectron,
    SiExpress,
    SiFastapi,
    SiFigma,
    SiFirebase,
    SiFlask,
    SiFlutter,
    SiGatsby,
    SiGit,
    SiGithub,
    SiGo,
    SiGooglecloud,
    SiGraphql,
    SiHtml5,
    SiJavascript,
    SiJest,
    SiKotlin,
    SiKubernetes,
    SiLaravel,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNestjs,
    SiNetlify,
    SiNextdotjs,
    SiNginx,
    SiNodedotjs,
    SiNumpy,
    SiOpenai,
    SiPhp,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiPytorch,
    SiReact,
    SiRedis,
    SiRedux,
    SiRuby,
    SiRubyonrails,
    SiRust,
    SiSass,
    SiSpring,
    SiSqlite,
    SiSupabase,
    SiSvelte,
    SiSwift,
    SiTailwindcss,
    SiTensorflow,
    SiThreedotjs,
    SiTypescript,
    SiVercel,
    SiVite,
    SiVuedotjs,
    SiWebpack,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
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

// Available skills sorted A-Z
const AVAILABLE_SKILLS: Skill[] = [
    { name: "Angular", icon: SiAngular, color: "#DD0031" },
    { name: "Ant Design", icon: SiAntdesign, color: "#0170FE" },
    { name: "Apollo", icon: SiApollographql, color: "#311C87" },
    { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
    { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    { name: "C", icon: SiC, color: "#A8B9CC" },
    { name: "C#", icon: TbBrandCSharp, color: "#512BD4" },
    { name: "C++", icon: SiCplusplus, color: "#00599C" },
    { name: "Cloudflare", icon: SiCloudflare, color: "#F38020" },
    { name: "CSS3", icon: SiCss3, color: "#1572B6" },
    { name: "Cypress", icon: SiCypress, color: "#17202C" },
    { name: "Dart", icon: SiDart, color: "#0175C2" },
    { name: "Django", icon: SiDjango, color: "#092E20" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: ".NET", icon: SiDotnet, color: "#512BD4" },
    { name: "Electron", icon: SiElectron, color: "#47848F" },
    { name: "Express", icon: SiExpress, color: "#FFFFFF" },
    { name: "FastAPI", icon: SiFastapi, color: "#009688" },
    { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    { name: "Flask", icon: SiFlask, color: "#FFFFFF" },
    { name: "Flutter", icon: SiFlutter, color: "#02569B" },
    { name: "Gatsby", icon: SiGatsby, color: "#663399" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
    { name: "Go", icon: SiGo, color: "#00ADD8" },
    { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
    { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "Jest", icon: SiJest, color: "#C21325" },
    { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
    { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
    { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
    { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
    { name: "Nginx", icon: SiNginx, color: "#009639" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "NumPy", icon: SiNumpy, color: "#013243" },
    { name: "OpenAI", icon: SiOpenai, color: "#412991" },
    { name: "PHP", icon: SiPhp, color: "#777BB4" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "Redux", icon: SiRedux, color: "#764ABC" },
    { name: "Ruby", icon: SiRuby, color: "#CC342D" },
    { name: "Ruby on Rails", icon: SiRubyonrails, color: "#CC0000" },
    { name: "Rust", icon: SiRust, color: "#DEA584" },
    { name: "Sass", icon: SiSass, color: "#CC6699" },
    { name: "Spring", icon: SiSpring, color: "#6DB33F" },
    { name: "SQLite", icon: SiSqlite, color: "#003B57" },
    { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
    { name: "Svelte", icon: SiSvelte, color: "#FF3E00" },
    { name: "Swift", icon: SiSwift, color: "#F05138" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "Three.js", icon: SiThreedotjs, color: "#FFFFFF" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
    { name: "Vite", icon: SiVite, color: "#646CFF" },
    { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
    { name: "Webpack", icon: SiWebpack, color: "#8DD6F9" },
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
                    <span className="text-slate-400">
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
                                    ? "bg-white/10 border-white ring-1 ring-white/30"
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
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
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
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-zinc-300"
                                >
                                    {Icon && <Icon className="w-4 h-4" style={{ color: skillData?.color }} />}
                                    {skill}
                                    <button
                                        onClick={() => toggleSkill(skill)}
                                        className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-xs"
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
