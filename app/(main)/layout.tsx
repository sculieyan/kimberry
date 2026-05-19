import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kimberry - Premium New Zealand Dairy Products',
  description: 'Discover Kimberry\'s premium dairy health products, including milk tablets and milk oats powder, made in New Zealand. Enjoy nutritious, delicious, and sustainable choices for your family.',
  keywords: ['New Zealand health products', 'New Zealand made', 'New Zealand made products', 'supplements', 'milk tablets', 'milk beans', 'milk oats powder', 'chocolate milk tablets','chocolate milk beans', 'wellness', 'Kimberry'],
  metadataBase: new URL('https://www.kimberry.co.nz'),
  openGraph: {
    title: 'Kimberry® - Premium New Zealand Dairy Products',
    description: 'Discover Kimberry\'s premium dairy health products, including milk tablets and milk oats powder, made in New Zealand. Enjoy nutritious, delicious, and sustainable choices for your family.',
    images: [
      {
        url: '/poster.jpg',
        width: 1279,
        height: 1706,
      }
    ],
    url: 'https://www.kimberry.co.nz',
    siteName: 'Kimberry',
    locale: 'en_NZ',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}