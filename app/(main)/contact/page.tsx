import { Metadata } from 'next';
import { HeroSection } from '@/components/layout/Utils'

export const metadata: Metadata = {
    title: 'Contact Kimberry | New Zealand Dairy Products Manufacturer',
    description: 'Get in touch with Kimberry, your trusted New Zealand dairy manufacturer. Located in Onehunga, Auckland. Email us at info@kimberry.co.nz or call +64 9974 9488 for premium dairy products inquiries.',
    openGraph: {
        title: 'Contact Kimberry | Premium Dairy Products Manufacturer',
        description: 'Connect with Kimberry in Auckland, New Zealand. Reach out for inquiries about our premium dairy products, including oat milk powder and milk tablets.',
        images: [
            {
                url: '/contacts/auckland.jpg',
                width: 1200,
                height: 630,
                alt: 'Kimberry Office in Auckland'
            }
        ],
        url: 'https://www.kimberry.co.nz/contact',
        siteName: 'Kimberry',
        locale: 'en_NZ',
        type: 'website',
    },
    keywords: [
        'Kimberry contact',
        'dairy manufacturer contact',
        'Auckland dairy company',
        'New Zealand dairy contact',
        'Onehunga business',
        'premium dairy products',
        'dairy product inquiries',
        'Kimberry location',
        'contact dairy manufacturer',
        'New Zealand food company'
    ],
    alternates: {
        canonical: 'https://www.kimberry.co.nz/contact'
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

export default function Contact() {
    return (
        <div className="min-h-screen pt-20 dark:bg-white">
            {/* Hero Section */}
            <HeroSection title="Contact Us" description="We&apos;d love to hear from you. Get in touch with us." image="/contacts/auckland.jpg" />

            {/* Contact Information Section */}
            <section className="py-20 bg-gradient-to-b from-white to-green-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Get in Touch</h2>
                        
                        {/* New Zealand Contact Information */}
                        <div className="space-y-8 mb-12">
                            <h3 className="text-2xl font-semibold text-gray-800">New Zealand Office</h3>
                            {/* Office Address */}
                            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start space-x-6">
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        {/* Icon for Office Address */}
                                        <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className='font-josefin'>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Office Address</h3>
                                        <p className="text-gray-600 text-sm">11/85 Onehunga Mall, Onehunga</p>
                                        <p className="text-gray-600 text-sm">Auckland 1061, New Zealand</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start space-x-6">
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        {/* Icon for Email */}
                                        <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className='font-josefin'>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
                                        <p className="text-gray-600 text-sm">info@kimberry.co.nz</p>
                                        <p className="text-gray-600 text-sm">sales@kimberry.co.nz</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start space-x-6">
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        {/* Icon for Phone */}
                                        <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className='font-josefin'>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
                                        <p className="text-gray-600 text-sm">+64 9974 9488</p>
                                        <p className="text-gray-600 text-sm">Monday - Friday, 9am - 6pm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Find Us</h2>
                    <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6378.8128926253175!2d174.78416540741873!3d-36.9284536187574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4f6fa23d1257%3A0x85c371ccae3bdaa5!2sKimberry%20Limited!5e0!3m2!1sEN!2snz!4v1732769695570!5m2!1sEN!2snz" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }}  
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    )
}