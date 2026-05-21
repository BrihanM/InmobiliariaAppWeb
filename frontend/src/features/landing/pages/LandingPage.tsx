import { useEffect } from 'react';
import { env } from '@/core/config/env';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeaturedProperties } from '../components/FeaturedProperties';
import { CategorySection } from '../components/CategorySection';
import { LatestProperties } from '../components/LatestProperties';
import { CompanySection } from '../components/CompanySection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  useEffect(() => {
    document.title = `${env.appName} — Encuentra tu hogar ideal`;
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero with integrated search */}
        <HeroSection />

        {/* 2. Featured properties from property-service */}
        <FeaturedProperties />

        {/* 3. Browse by category */}
        <CategorySection />

        {/* 4. Latest properties with infinite scroll */}
        <LatestProperties />

        {/* 5. Company info */}
        <CompanySection />

        {/* 6. Testimonials */}
        <TestimonialsSection />

        {/* 7. Call to action */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
