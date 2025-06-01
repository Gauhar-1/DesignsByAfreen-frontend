import type { Metadata } from 'next';
import HeroSection from '@/components/pages/home/HeroSection';
import FeaturedCollections from '@/components/pages/home/FeaturedCollections';
import TestimonialsSection from '@/components/pages/home/TestimonialsSection';
import NewsletterSection from '@/components/pages/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'Atelier Luxe - Bespoke Fashion Designer',
  description: 'Discover unique, handcrafted designs tailored to your individuality and elegance. Explore collections, get style suggestions, and contact us for a consultation.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
