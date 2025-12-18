import { ThemeConfig } from "../lib/themes";

interface HeroProps {
    name: string;
    title: string;
    bio: string;
    skills: string[];
    theme: ThemeConfig;
}

export default function Hero({ name, title, bio, skills, theme }: HeroProps) {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative pt-16"
        >

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
                    Hi, I&apos;m{" "}
                    <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
                        {name || "Your Name"}
                    </span>
                </h1>

                {/* Title */}
                {title && (
                    <p className={`text-2xl md:text-3xl ${theme.textAccent} font-medium mb-4`}>
                        {title}
                    </p>
                )}

                {/* Bio */}
                <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {bio || "A passionate developer crafting beautiful digital experiences."}
                </p>

                {/* Tech Stack Pills */}
                {skills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className={`px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 backdrop-blur-sm hover:border-current ${theme.textAccent} transition-colors duration-300`}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#projects"
                        className={`group px-8 py-4 bg-gradient-to-r ${theme.primaryGradient} text-white font-medium rounded-full hover:opacity-90 transition-all duration-300 shadow-lg ${theme.shadowColor} flex items-center gap-2`}
                    >
                        View My Work
                        <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 border border-zinc-700 text-white font-medium rounded-full hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-300"
                    >
                        Contact Me
                    </a>
                </div>
            </div>
        </section>
    );
}
