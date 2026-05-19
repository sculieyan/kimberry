'use client'

import { Josefin_Sans } from 'next/font/google'
import { usePathname } from 'next/navigation'
import './globals.css'
import Providers from './providers'

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin-sans',
  display: 'swap',
})

export default  function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const canonicalUrl = `https://www.kimberry.co.nz${pathname}`
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body className={`${josefinSans.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}