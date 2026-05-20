import { Metadata } from 'next';
import Image from 'next/image'
import { Suspense } from 'react';
import { HeroSection } from '@/components/layout/Utils';
import AboutDetails from './AboutDetails';
import Loader from '@/components/Loader';
import { fetchApiData } from '@/lib/api';
import { FAQ } from '../types/types';

interface FAQResponse {
    faqs: FAQ[];
}

const calculateYearsSince = (startYear: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
};

export async function generateMetadata(): Promise<Metadata> {
    const yearsSince = calculateYearsSince(2008);
    return {
        title: 'About Kimberry | Premium New Zealand Dairy Products Manufacturer',
        description: `Discover Kimberry's ${yearsSince}-year legacy in premium dairy production. MPI-certified, New Zealand-made dairy products with a commitment to quality, sustainability, and food safety. Specializing in oat milk powder and milk tablets.`,
        openGraph: {
            title: 'About Kimberry | Premium New Zealand Dairy Products',
            description: `New Zealand's trusted dairy manufacturer with ${yearsSince} years of excellence. MPI-certified, sustainable production, and unwavering commitment to quality.`,
            images: [
                {
                    url: 'https://amplify-mynextjspostgres--kimberryhomestoragebucke-hynjyaubcbzh.s3.ap-southeast-2.amazonaws.com/profile-image/aboutus.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Kimberry Dairy Production Facility'
                }
            ],
            url: 'https://www.kimberry.co.nz/about',
            siteName: 'Kimberry',
            locale: 'en_NZ',
            type: 'website',
        },
        keywords: [
            'Kimberry dairy',
            'New Zealand dairy manufacturer',
            'premium dairy products',
            'MPI certified dairy',
            'sustainable dairy production',
            'milk oats powder',
            'milk tablets',
            'New Zealand made',
            'food safety excellence',
            'Waikato brand',
        ],
        alternates: {
            canonical: 'https://www.kimberry.co.nz/about'
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
}

const getFAQData = async () => {
    return fetchApiData<FAQResponse>({
        endpoint: '/faq',
        revalidate: 3600,
        queryParams: { q: 'Certification' }
    });
};

export default async function About() {
    const yearsSince = calculateYearsSince(2008);
    const result = await getFAQData();
    
    return (
        <div className="min-h-screen pt-20 dark:bg-white">
            <HeroSection title="We&apos;ve crafted pure, wholesome foods" description="Join us on this journey of health, taste, and trust" image="https://amplify-mynextjspostgres--kimberryhomestoragebucke-hynjyaubcbzh.s3.ap-southeast-2.amazonaws.com/profile-image/aboutus.jpg" />
            {/* Company Introduction */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className='font-josefin'>
                            <h2 className="text-3xl text-gray-800 mb-6">Who We Are</h2>
                            <p className="text-gray-600 mb-4">
                                Founded in New Zealand, Kimberry has been committed to producing premium dairy products for over {yearsSince} years. Our journey began with a simple mission: to share the pure goodness of New Zealand&apos;s dairy with the world.
                            </p>
                            <p className="text-gray-600">
                                Today, we continue to uphold the highest standards of quality and sustainability, ensuring that every product that bears the Kimberry name is a testament to our commitment to excellence.
                            </p>
                        </div>
                        <div className="relative h-[400px] group perspective-1000 font-josefin">
                            <div className="absolute left-[10%] top-[20%] w-[60%] h-[60%] transform 
        transition-all duration-700 ease-out
        hover:scale-110 hover:rotate-2 hover:z-30
        group-hover:translate-x-5">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/about/kimberry-office.jpg"
                                        alt="Kimberry Factory"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="absolute bottom-4 left-4 text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                                        <h3 className="text-lg font-bold">Our Factory</h3>
                                        <p className="text-xs">11/85 Onehunga Mall, Auckland 1061, New Zealand</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 w-[45%] h-[45%] transform 
        transition-all duration-700 ease-out
        hover:scale-110 hover:-rotate-2 hover:z-30
        group-hover:translate-y-5">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/about/Harvest03.webp"
                                        alt="Premium Oats from the South Island"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="absolute bottom-4 left-4 text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                                        <p className="text-sm">Premium Oats from the South Island</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-[10%] bottom-0 w-[50%] h-[45%] transform 
        transition-all duration-700 ease-out
        hover:scale-110 hover:rotate-1 hover:z-30
        group-hover:translate-x-[-5%]">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/about/dairy-farm.png"
                                        alt="Product Line"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="absolute bottom-4 left-4 text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                                        <p className="text-sm">High-Quality Milk Source</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-green-50">
                <div className="container mx-auto px-4 font-josefin">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Quality Assurance",
                                description: "Rigorous testing and monitoring at every stage of production to ensure the highest standards of food safety and quality",
                                icon: (
                                    <svg className="w-8 h-8 transition-colors duration-300"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                )
                            },
                            {
                                title: "Sustainable Production",
                                description: "A commitment to responsible manufacturing and sustainable practices that adhere to New Zealand's stringent quality and environmental standards, ensuring premium dairy products while respecting the country's natural resources.",
                                icon: (
                                    <svg className="w-8 h-8 transition-colors duration-300"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>
                                )
                            },
                            {
                                title: "Food Safety Excellence",
                                description: "Adherence to the strictest international food safety standards and continuous monitoring of our production processes",
                                icon: (
                                    <svg className="w-8 h-8 transition-colors duration-300"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                                    </svg>
                                )
                            }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 text-center group 
                        hover:shadow-xl hover:bg-green-700"
                            >
                                <div className="flex items-center justify-center space-x-3 mb-6">
                                    <div className="text-green-700 group-hover:text-white transition-colors duration-300">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors">
                                        {value.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 group-hover:text-white/90 transition-colors leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Brands</h2>
                    <h3 className="text-gray-600 text-center font-semibold">
                        All our brands adhere to New Zealand&apos;s strict food production standards, ensuring no additives are used.
                    </h3>
                    <h3 className="text-gray-600 text-center font-semibold mb-8">
                        *Kimberry and Waikato brands use different packaging materials based on environmental policies and transportation requirements, with no differences in the formula.
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                name: "Kimberry",
                                description: "Rooted in the heart of New Zealand, Kimberry brings you premium health foods crafted for local tastes. Specializing in oat milk powder and milk tablets, Kimberry celebrates the richness of New Zealand’s natural resources. *Available for sale exclusively in Oceania.",
                                logo: "/brands/kimberry-logo.jpg"
                            },
                            {
                                name: "Waikato",
                                description: "Named after the iconic Waikato region, Waikato delivers the pure essence of New Zealand to the world. From nutritious oat milk powder to delicious milk tablets, our products embody the highest standards of safety and quality.",
                                logo: "/brands/waikato.jpg"
                            }
                        ].map((brand, index) => (
                            <div key={index} className="text-center flex flex-col items-center font-josefin">
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain rounded-full"
                                    />
                                </div>
                                <p className="text-gray-600 max-w-md mx-auto text-left">{brand.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 font-josefin">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Certifications</h2>
                    <h3 className="text-gray-600 font-semibold text-center max-w-2xl mx-auto mb-16">
                        We maintain the highest standards of quality and safety through internationally recognized certifications
                    </h3>

                    <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
                        {[
                            {
                                src: "/about/new-zealand-made-seeklogo.svg",
                                title: "New Zealand Made",
                                description: "Proudly manufactured in New Zealand with local ingredients",
                                width: 140,
                                height: 140
                            },
                            {
                                src: "/about/mpi-dark-logo.png",
                                title: "MPI Certified",
                                description: "Meeting Ministry for Primary Industries' strict food safety standards",
                                width: 260,
                                height: 200
                            }
                        ].map((cert, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl 
                        transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className="relative mb-6"
                                        style={{
                                            width: cert.width,
                                            height: cert.height
                                        }}
                                    >
                                        <Image
                                            src={cert.src}
                                            alt={cert.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                        {cert.title}
                                    </h3>
                                    <p className="text-gray-600 text-center text-sm">
                                        {cert.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Suspense fallback={<Loader />}>
                <section className="py-16 bg-gray-50">
                    <AboutDetails qas={result.faqs} />
                </section>
            </Suspense>
        </div>
    )
}