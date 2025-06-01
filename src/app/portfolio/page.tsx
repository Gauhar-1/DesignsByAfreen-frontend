
import type { Metadata } from 'next';
import { mockPortfolioItems, Product } from '@/lib/mockData';
import ProductCard from '@/components/shared/ProductCard';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portfolio - Designs by Afreen',
  description: 'Explore the exquisite collections and designs by Designs by Afreen. Filter by category to find your perfect piece.',
};

const categories = ['All', 'Bridal', 'Casual', 'Festive', 'Outerwear'];

export default function PortfolioPage() {
  // In a real app, filtering logic would be implemented here
  const itemsToDisplay = mockPortfolioItems;

  return (
    <Container className="py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Portfolio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through our curated collection of bespoke designs. Each piece is a testament to our commitment to quality and timeless style.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <Button key={category} variant={category === 'All' ? 'default' : 'outline'} className="text-sm">
             {/* <Filter className="h-4 w-4 mr-2" /> Only for a dedicated filter button */}
            {category}
          </Button>
        ))}
      </div>

      {itemsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {itemsToDisplay.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">No items found for this category.</p>
      )}
    </Container>
  );
}
