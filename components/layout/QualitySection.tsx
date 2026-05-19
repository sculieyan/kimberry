import { useEffect } from 'react'

const sections = [
    {
        id: 'source',
        text: 'Source Control',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    {
        id: 'testing',
        text: 'Quality Testing',
        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
    },
    {
        id: 'safety',
        text: 'Safety Certification',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    }
]

interface QualitySectionProps {
    activeSection: string
    setActiveSection: (id: string) => void
    isHovering: boolean
    setIsHovering: (state: boolean) => void
}

export default function QualitySection({
    activeSection,
    setActiveSection,
    isHovering,
    setIsHovering
}: QualitySectionProps) {
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (!isHovering) {
            interval = setInterval(() => {
                const currentIndex = sections.findIndex(section => section.id === activeSection)
                const nextIndex = (currentIndex + 1) % sections.length
                setActiveSection(sections[nextIndex].id)
            }, 3000)
        }

        return () => clearInterval(interval)
    }, [isHovering, setActiveSection, activeSection])

    return (
        <section className="py-10 bg-green-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className='font-josefin'>
                        <h2 className="text-xl font-bold mb-6 dark:text-gray-800">Strict Quality Assurance System</h2>
                        <p className="text-gray-600 mb-8">
                            We have established a comprehensive quality traceability system, ensuring strict control over every step from raw materials to the market, to provide consumers with safe and high-quality products.
                        </p>
                        <div className="space-y-4">
                            {sections.map((item) => (
                                <button
                                    key={item.id}
                                    className={`w-full flex font-josefin items-center space-x-3 p-4 rounded-lg transition-colors ${activeSection === item.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'hover:bg-green-50 text-gray-700'
                                        }`}
                                    onMouseEnter={() => {
                                        setIsHovering(true);
                                        setActiveSection(item.id);
                                    }}
                                    onMouseLeave={() => {
                                        setIsHovering(false);
                                    }}
                                >
                                    <svg
                                        className={`w-6 h-6 ${activeSection === item.id ? 'text-green-600' : 'text-gray-500'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={item.icon}
                                        />
                                    </svg>
                                    <span className="font-medium">{item.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-96 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8 font-josefin">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className={`absolute inset-0 p-8 transition-opacity duration-500 ${activeSection === section.id
                                        ? 'opacity-100 z-10'
                                        : 'opacity-0 z-0'
                                        }`}
                                >
                                    {activeSection === section.id && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-green-800">{section.text}</h3>
                                            {section.id === 'source' && (
                                                <>
                                                    <h3 className="text-gray-600">
                                                        Every ingredient used in our products is carefully selected and monitored to meet the highest standards of purity and sustainability.
                                                    </h3>
                                                    <ul className="list-none pl-4 space-y-4 text-sm text-gray-600">
                                                        <li>
                                                            We partner exclusively with trusted local suppliers who share our commitment to quality and environmental responsibility.
                                                        </li>
                                                        <li>
                                                            All suppliers undergo rigorous evaluation and must comply with internationally recognized food safety and quality certifications, such as HACCP, FSSC, and GMP standards.
                                                        </li>
                                                        <li>
                                                            Each batch of raw materials is subjected to thorough testing for contaminants, nutrient levels, and compliance with our quality requirements before entering the production line.
                                                        </li>

                                                    </ul>
                                                </>
                                            )}
                                            {section.id === 'testing' && (
                                                <>
                                                    <h3 className="text-gray-600">
                                                        At Kimberry<sup className="text-xs">®</sup>, quality is our top priority.
                                                    </h3>
                                                    <ul className="list-none pl-4 space-y-4 text-sm text-gray-600">
                                                        <li>
                                                            Our state-of-the-art testing laboratory ensures every product meets the highest standards of safety and excellence.
                                                        </li>
                                                        <li>
                                                            We perform rigorous checks at every stage of production, from raw material selection to the final packaging, using advanced equipment and precise methodologies.
                                                        </li>
                                                    </ul>
                                                    <p className="text-gray-600 text-sm">
                                                        This commitment guarantees that you receive products that are not only nutritious but also meet global quality certifications.
                                                    </p>
                                                </>
                                            )}
                                            {section.id === 'safety' && (
                                                <>
                                                    <h3 className="text-gray-600 text">
                                                        We are proud to have earned the New Zealand MPI RMPs (Risk Management Programme) certification and the New Zealand Made certification.
                                                    </h3>
                                                    <ul className="list-none pl-4 space-y-4 text-sm text-gray-600">
                                                        <li>
                                                            <strong>MPI RMPs Certification: </strong>This is a stringent food safety standard regulated by the New Zealand Ministry for Primary Industries, ensuring that our products meet the highest international standards for hygiene, quality, and traceability.
                                                        </li>
                                                        <li>
                                                            <strong>New Zealand Made Certification: </strong>This mark verifies that our products are authentically produced in New Zealand, reflecting the premium quality and trusted craftsmanship associated with New Zealand manufacturing.
                                                        </li>
                                                    </ul>
                                                    <p className="text-gray-600 text-sm">
                                                        These certifications demonstrate our unwavering commitment to delivering safe, high-quality products you can trust.
                                                    </p>
                                                </>
                                            )}

                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}