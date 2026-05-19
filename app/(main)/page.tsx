'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/layout/HeroSection';
import { SchemaOrgData } from '@/components/layout/SchemaOrgData';

const AdvantagesSection = dynamic(() => import('@/components/layout/AdvantagesSecion'), {
  loading: () => <div className="py-20 bg-gray-50">Loading...</div>
})

const QualitySection = dynamic(() => import('@/components/layout/QualitySection'), {
  loading: () => <div className="py-10 bg-green-50">Loading...</div>
})

export default function Home() {
  const [activeSection, setActiveSection] = useState('source');
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <SchemaOrgData />
      <div className="min-h-screen">
        <main>
          <article>
            <HeroSection />
            <AdvantagesSection />
            <QualitySection activeSection={activeSection} setActiveSection={setActiveSection} isHovering={isHovering} setIsHovering={setIsHovering} />
          </article>
        </main>
      </div>
    </>
  )
}