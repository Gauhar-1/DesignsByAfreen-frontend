import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import TrendingStylesForm from '@/components/pages/trending-styles/TrendingStylesForm';

export const metadata: Metadata = {
  title: 'Trending Style Suggestions - Atelier Luxe',
  description: 'Get AI-powered trending style suggestions tailored to your preferences and the current season.',
};

export default function TrendingStylesPage() {
  return (
    <Container className="py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Find Your Next Look</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Leverage the power of AI to discover fashion trends that perfectly match your personal style and the current season.
        </p>
      </header>
      <TrendingStylesForm />
    </Container>
  );
}
