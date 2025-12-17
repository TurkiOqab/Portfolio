import Link from "next/link";
import { ContactInfo } from "../types";

interface FooterProps {
    contact: ContactInfo;
    name: string;
}

export default function Footer({ contact, name }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        contact.github && {
            name: "GitHub",
            href: contact.github,
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            ),
        },
        contact.linkedin && {
            name: "LinkedIn",
            href: contact.linkedin,
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        contact.twitter && {
            name: "Twitter",
            href: contact.twitter,
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        contact.email && {
            name: "Email",
            href: `mailto:${contact.email}`,
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
    ].filter(Boolean) as { name: string; href: string; icon: JSX.Element }[];

    return (
        <footer
            id="contact"
            className="bg-zinc-950 border-t border-zinc-800/50 relative overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - CTA */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Let&apos;s work{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                together
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg mb-6">
                            Have a project in mind? I&apos;d love to hear about it. Let&apos;s
                            create something amazing together.
                        </p>
                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-full hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
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
                            </a>
                        )}
                    </div>

                    {/* Right Side - Social Links */}
                    <div className="flex flex-col items-start md:items-end">
                        {socialLinks.length > 0 && (
                            <>
                                <p className="text-zinc-400 text-sm mb-4">Find me on</p>
                                <div className="flex items-center gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-zinc-800 transition-all duration-300"
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

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-zinc-800/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-zinc-500 text-sm">
                            © {currentYear} {name || "Portfolio"}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/onboarding"
                                className="text-zinc-500 hover:text-violet-400 text-sm transition-colors"
                            >
                                Edit Portfolio
                            </Link>
                            <p className="text-zinc-500 text-sm">
                                Built with{" "}
                                <span className="text-violet-400">Next.js</span> &{" "}
                                <span className="text-violet-400">Tailwind CSS</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
