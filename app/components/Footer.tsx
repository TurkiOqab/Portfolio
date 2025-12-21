import Link from "next/link";
import { ContactInfo } from "../types";
import { ThemeConfig } from "../lib/themes";
import LikeButton from "./LikeButton";
import ShareButtons from "./ShareButtons";

interface FooterProps {
    contact: ContactInfo;
    name: string;
    theme: ThemeConfig;
    cvUrl?: string;
    portfolioId: string;
    username: string;
    isOwner?: boolean;
}

export default function Footer({ contact, name, theme, cvUrl, portfolioId, username, isOwner }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        contact.github && {
            name: "GitHub",
            href: contact.github,
            hoverColor: "hover:text-white hover:bg-zinc-800",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            ),
        },
        contact.linkedin && {
            name: "LinkedIn",
            href: contact.linkedin,
            hoverColor: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/10",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        contact.twitter && {
            name: "Twitter",
            href: contact.twitter,
            hoverColor: "hover:text-white hover:bg-zinc-800",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        contact.email && {
            name: "Email",
            href: `mailto:${contact.email}`,
            hoverColor: "hover:text-emerald-400 hover:bg-emerald-400/10",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
    ].filter(Boolean) as { name: string; href: string; icon: React.ReactNode; hoverColor: string }[];

    return (
        <footer
            id="contact"
            className="relative"
        >
            {/* Subtle top gradient border */}
            <div className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${theme.primaryGradient.replace('from-', 'via-').split(' ')[0]} to-transparent opacity-30`} />

            <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - CTA */}
                    <div>
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${theme.textAccent} text-sm font-medium tracking-widest uppercase mb-6 bg-zinc-900/50 rounded-full border border-zinc-800/50`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${theme.primaryGradient}`} />
                            Contact
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Let&apos;s work{" "}
                            <span className={`bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
                                together
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            Have a project in mind? I&apos;d love to hear about it. Let&apos;s
                            create something amazing together.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            {contact.email && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className={`group inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r ${theme.primaryGradient} ${theme.buttonText} font-semibold rounded-full hover:opacity-90 transition-all duration-300 shadow-lg ${theme.shadowColor} hover:shadow-xl hover:scale-[1.02]`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Get in Touch
                                    <svg
                                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            )}
                            {cvUrl && (
                                <a
                                    href={cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="group inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-700 text-zinc-300 font-medium rounded-full hover:bg-zinc-800/50 hover:text-white hover:border-zinc-500 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <svg
                                        className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Download CV
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Social Links */}
                    <div className="flex flex-col items-start md:items-end">
                        {socialLinks.length > 0 && (
                            <>
                                <p className="text-zinc-400 text-sm mb-4">Find me on</p>
                                <div className="flex items-center gap-3">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-zinc-400 ${link.hoverColor} hover:border-zinc-700 transition-all duration-300 hover:scale-110`}
                                            aria-label={link.name}
                                        >
                                            {link.icon}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Like & Share Section */}
                <div className="mt-12 pt-8 border-t border-zinc-800">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-zinc-500 text-sm">Enjoyed this portfolio?</p>
                            <LikeButton portfolioId={portfolioId} theme={theme} isOwner={isOwner} />
                        </div>
                        <div className="hidden md:block w-px h-12 bg-zinc-800" />
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-zinc-500 text-sm">Share with others</p>
                            <ShareButtons url={`/${username}`} title={`${name}'s Portfolio`} theme={theme} />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-zinc-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-zinc-500 text-sm">
                            © {currentYear} {name || "Portfolio"}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/onboarding"
                                className={`text-zinc-500 hover:${theme.textAccent} text-sm transition-colors`}
                            >
                                Edit Portfolio
                            </Link>
                            <p className="text-zinc-500 text-sm">
                                Built with{" "}
                                <span className={theme.textAccent}>Next.js</span> &{" "}
                                <span className={theme.textAccent}>Tailwind CSS</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
