import { WorkExperience } from '@/app/types'
import { ThemeConfig } from '../lib/themes'

interface ExperienceSectionProps {
    experience: WorkExperience[]
    theme: ThemeConfig
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
}

export default function ExperienceSection({ experience, theme }: ExperienceSectionProps) {
    if (!experience || experience.length === 0) return null

    // Sort by start date (most recent first)
    const sortedExperience = [...experience].sort((a, b) => {
        const dateA = a.startDate || '0000-00'
        const dateB = b.startDate || '0000-00'
        return dateB.localeCompare(dateA)
    })

    return (
        <section className="py-20 px-6" id="experience">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                    Work Experience
                </h2>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-700" />

                    <div className="space-y-8">
                        {sortedExperience.map((exp) => (
                            <div
                                key={exp.id}
                                className="relative pl-8"
                            >
                                {/* Timeline dot */}
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${theme.timelineDot} border-2 border-zinc-950`} />

                                <div>
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1">
                                        <h3 className="text-xl font-semibold text-white">
                                            {exp.title}
                                        </h3>
                                        <span className="text-zinc-500 text-sm whitespace-nowrap">
                                            {formatDate(exp.startDate)}
                                            {' — '}
                                            {exp.isPresent ? (
                                                <span className="text-emerald-400">Present</span>
                                            ) : (
                                                formatDate(exp.endDate || '')
                                            )}
                                        </span>
                                    </div>
                                    <p className={`${theme.textAccent} mt-1`}>{exp.company}</p>
                                    {exp.duties && (
                                        <p className="text-zinc-500 text-sm mt-2 leading-relaxed whitespace-pre-line">
                                            {exp.duties}
                                        </p>
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
