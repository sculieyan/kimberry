import Link from 'next/link'
import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faCogs, faClipboardCheck, faShippingFast, faTags, faPalette } from '@fortawesome/free-solid-svg-icons'

export const metadata: Metadata = {
    title: 'Services | Kimberry New Zealand Dairy Solutions',
    description: 'Explore Kimberry\'s comprehensive dairy services including OEM, contract manufacturing, product development, export services, logistics support, and packaging design. Premium New Zealand dairy solutions tailored to your needs.',
    openGraph: {
        title: 'Premium Dairy Services | Kimberry New Zealand',
        description: 'From OEM and contract manufacturing to product development and export services, discover how Kimberry can help grow your dairy business with New Zealand quality standards.',
        images: [
            {
                url: '/services/dairy-services.jpg',
                width: 1200,
                height: 630,
                alt: 'Kimberry Dairy Services'
            }
        ],
        url: 'https://www.kimberry.co.nz/services',
        siteName: 'Kimberry',
        locale: 'en_NZ',
        type: 'website',
    },
    keywords: [
        'dairy OEM services',
        'contract manufacturing',
        'dairy product development',
        'export services',
        'logistics support',
        'packaging design',
        'New Zealand dairy solutions',
        'dairy manufacturing services',
        'food production services',
        'dairy business solutions'
    ],
    alternates: {
        canonical: 'https://www.kimberry.co.nz/services'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    }
}

export default function Services() {
    return (
        <div className="min-h-screen pt-20 dark:bg-white">
            {/* Hero Section */}
            <section className="relative py-20 h-[40vh]">
                <div className="mx-auto max-w-5xl lg:text-center flex flex-col justify-center items-center border-b border-gray-300">
                    <h1 className="lg:text-7xl text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-center">New Zealand
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-800 to-green-900">Dairy Solutions</span>
                    </h1>
                    <h3 className="mt-4 mb-8 text-md text-gray-600 max-w-lg text-center font-sembold">Explore the premium services offered by our New Zealand dairy factory, dedicated to providing you with healthy and high-quality dairy products to meet your needs.</h3>
                </div>
            </section>
            {/* Services Section */}
            <section className=" bg-white mt-12 font-josefin"> 
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            {/* Service Item 1 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-700">
                                        <FontAwesomeIcon icon={faBoxOpen} className="h-6 w-6 text-white" />
                                    </div>
                                    OEM Services
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    We provide OEM services to help you create your own brand with high-quality products.
                                </dd>
                            </div>
                            {/* Service Item 2 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-700">
                                        <FontAwesomeIcon icon={faCogs} className="h-6 w-6 text-white" />
                                    </div>
                                    Contract Manufacturing
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Our contract manufacturing services ensure high-quality production tailored to your specifications.
                                </dd>
                            </div>
                            {/* Service Item 3 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-700">
                                        <FontAwesomeIcon icon={faClipboardCheck} className="h-6 w-6 text-white" />
                                    </div>
                                    Product Development
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    We assist in product development from concept to market, ensuring your ideas come to life.
                                </dd>
                            </div>
                            {/* Service Item 4 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-700">
                                        <FontAwesomeIcon icon={faShippingFast} className="h-6 w-6 text-white" />
                                    </div>
                                    Export Services
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Our export services facilitate smooth international trade, ensuring compliance with regulations.
                                </dd>
                            </div>
                            {/* Service Item 5 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-700">
                                        <FontAwesomeIcon icon={faTags} className="h-6 w-6 text-white" />
                                    </div>
                                    Logistics Support
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    We provide logistics support to ensure timely delivery and efficient supply chain management.
                                </dd>
                            </div>
                            {/* Service Item 6 */}
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-green-700">
                                        <FontAwesomeIcon icon={faPalette} className="h-6 w-6 text-white" />
                                    </div>
                                    Packaging Design
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Our packaging design services create attractive and functional packaging that stands out.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-green-50 font-josefin">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
                    <p className="text-gray-600 mb-8">
                        Contact us today to discuss how we can help you achieve your goals
                    </p>
                    <Link href="/contact" className="inline-block bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800 transition-colors">
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    )
}