import { Education } from '@/app/types'

interface EducationSectionProps {
    education: Education[]
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
}

export default function EducationSection({ education }: EducationSectionProps) {
    if (!education || education.length === 0) return null

    // Sort by end date (most recent first, oldest at bottom)
    const sortedEducation = [...education].sort((a, b) => {
        const dateA = a.endDate || '0000-00'
        const dateB = b.endDate || '0000-00'
        return dateB.localeCompare(dateA)
    })

    return (
        <section className="py-20 px-6" id="education">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                    Education
                </h2>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-700" />

                    <div className="space-y-8">
                        {sortedEducation.map((edu) => (
                            <div
                                key={edu.id}
                                className="relative pl-8"
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-violet-500 border-2 border-zinc-950" />

                                <div>
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1">
                                        <h3 className="text-xl font-semibold text-white">
                                            {edu.institution}
                                        </h3>
                                        {(edu.startDate || edu.endDate) && (
                                            <span className="text-zinc-500 text-sm whitespace-nowrap">
                                                {formatDate(edu.startDate)}
                                                {edu.startDate && edu.endDate && ' — '}
                                                {formatDate(edu.endDate)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-violet-400 mt-1">
                                        {edu.degreeLevel}
                                        {edu.degreeName && ` in ${edu.degreeName}`}
                                    </p>
                                    {edu.gpa && (
                                        <p className="text-zinc-500 text-sm mt-1">
                                            GPA: {edu.gpa}
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
