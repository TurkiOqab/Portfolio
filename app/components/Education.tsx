import { Education } from '@/app/types'

interface EducationSectionProps {
    education: Education[]
}

export default function EducationSection({ education }: EducationSectionProps) {
    if (!education || education.length === 0) return null

    // Sort by degree level priority (oldest/lower degrees at bottom)
    const degreeOrder: Record<string, number> = {
        'PhD': 1,
        'Master\'s': 2,
        'Bachelor\'s': 3,
        'Associate\'s': 4,
        'Bootcamp': 5,
        'High School': 6,
        'Self-Taught': 7,
        'Other': 8,
    }

    const sortedEducation = [...education].sort((a, b) => {
        const orderA = degreeOrder[a.degreeLevel] || 10
        const orderB = degreeOrder[b.degreeLevel] || 10
        return orderA - orderB
    })

    return (
        <section className="py-20 px-6 bg-zinc-900/30" id="education">
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
                                    <h3 className="text-xl font-semibold text-white">
                                        {edu.institution}
                                    </h3>
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
