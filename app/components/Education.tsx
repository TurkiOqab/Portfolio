import { Education } from '@/app/types'

interface EducationSectionProps {
    education: Education[]
}

export default function EducationSection({ education }: EducationSectionProps) {
    if (!education || education.length === 0) return null

    // Sort by degree level priority (higher degrees first)
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
                <div className="space-y-6">
                    {sortedEducation.map((edu) => (
                        <div
                            key={edu.id}
                            className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/30 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {edu.institution}
                                    </h3>
                                    <p className="text-violet-400">
                                        {edu.degreeLevel}
                                        {edu.degreeName && ` in ${edu.degreeName}`}
                                    </p>
                                </div>
                                {edu.gpa && (
                                    <div className="text-zinc-400 text-sm md:text-right">
                                        <span className="text-zinc-300">GPA:</span> {edu.gpa}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
