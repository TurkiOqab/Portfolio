import { WorkExperience } from '@/app/types'
import { ThemeConfig } from '../lib/themes'
import MarkdownRenderer from './MarkdownRenderer'
import { formatMonthYear } from '../lib/date-utils'

interface ExperienceSectionProps {
    experience: WorkExperience[]
    theme: ThemeConfig
}

export default function ExperienceSection({ experience, theme }: ExperienceSectionProps) {
    if (!experience || experience.length === 0) return null

    const isLightMode = theme.mode === 'light'

    // Sort by start date (most recent first)
    const sortedExperience = [...experience].sort((a, b) => {
        const dateA = a.startDate || '0000-00'
        const dateB = b.startDate || '0000-00'
        return dateB.localeCompare(dateA)
    })

    return (
        <section className="py-24 px-6" id="experience">
            <div className="max-w-4xl mx-auto">
                {/* Section header with enhanced styling */}
                <div className="text-center mb-16">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${theme.textAccent} text-sm font-medium tracking-widest uppercase mb-6 ${isLightMode ? 'bg-zinc-100/80 border-zinc-200/50' : 'bg-zinc-900/50 border-zinc-800/50'} rounded-full border`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${theme.primaryGradient}`} />
                        Career
                    </span>
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                        Work Experience
                    </h2>
                </div>

                <div className="relative">
                    {/* Timeline line with gradient */}
                    <div className={`absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b ${theme.primaryGradient} opacity-30`} />

                    <div className="space-y-10">
                        {sortedExperience.map((exp, index) => (
                            <div
                                key={exp.id}
                                className="relative pl-10 group"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                {/* Timeline dot with glow effect */}
                                <div className="absolute left-0 top-1.5">
                                    <div className={`w-4 h-4 rounded-full ${theme.timelineDot} border-2 ${isLightMode ? 'border-white' : 'border-zinc-950'} relative z-10 group-hover:scale-125 transition-transform duration-300`} />
                                    <div className={`absolute inset-0 w-4 h-4 rounded-full ${theme.timelineDot} blur-sm opacity-50`} />
                                </div>

                                <div className={`p-5 rounded-xl ${isLightMode ? 'bg-white/60 border-zinc-200/50 hover:border-zinc-300/50 hover:bg-white/80' : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/60'} border transition-all duration-300`}>
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                        <h3 className={`text-xl font-bold ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>
                                            {exp.title}
                                        </h3>
                                        <span className={`${isLightMode ? 'text-zinc-500 bg-zinc-100/80' : 'text-zinc-500 bg-zinc-800/50'} text-sm font-mono whitespace-nowrap px-3 py-1 rounded-full`}>
                                            {formatMonthYear(exp.startDate)}
                                            {' — '}
                                            {exp.isPresent ? (
                                                <span className="text-emerald-500">Present</span>
                                            ) : (
                                                formatMonthYear(exp.endDate || '')
                                            )}
                                        </span>
                                    </div>
                                    <p className={`${theme.textAccent} mt-2 font-medium`}>{exp.company}</p>
                                    {exp.duties && (
                                        <div className={`${isLightMode ? 'text-zinc-600' : 'text-zinc-400'} text-sm mt-3 leading-relaxed`}>
                                            <MarkdownRenderer content={exp.duties} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
