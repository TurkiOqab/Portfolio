import { WorkExperience } from '@/app/types'

interface ExperienceSectionProps {
    experience: WorkExperience[]
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
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
                <div className="space-y-6">
                    {sortedExperience.map((exp) => (
                        <div
                            key={exp.id}
                            className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/30 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {exp.title}
                                    </h3>
                                    <p className="text-violet-400">{exp.company}</p>
                                </div>
                                <div className="text-zinc-400 text-sm md:text-right whitespace-nowrap">
                                    {formatDate(exp.startDate)}
                                    {' — '}
                                    {exp.isPresent ? (
                                        <span className="text-emerald-400">Present</span>
                                    ) : (
                                        formatDate(exp.endDate || '')
                                    )}
                                </div>
                            </div>
                            {exp.duties && (
                                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                                    {exp.duties}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
