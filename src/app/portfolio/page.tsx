
import type { Metadata } from 'next';
import ProductCard from '@/components/shared/ProductCard';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
// import { Filter } from 'lucide-react'; // Icon can be part of the button text if desired
import {  type Product } from '@/lib/api';
import axios from 'axios';
import { apiUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Portfolio - Designs by Afreen',
  description: 'Explore the exquisite collections and designs by Designs by Afreen. Filter by category to find your perfect piece.',
};

// Fetch categories dynamically from products or define statically
// For now, static to avoid over-complicating this step
const categories = ['All', 'Lehenga', 'Patiyala', 'Straight Pant', 'Sarara'];

export default async function PortfolioPage({ searchParams }: { searchParams?: { category?: string } }) {
  const allProducts = await axios.get(`${apiUrl}/products`);
  const selectedCategory = searchParams?.category || 'All';

  const itemsToDisplay = selectedCategory === 'All'
    ? allProducts.data
    : allProducts.data.filter((product: { category: string; }) => product.category === selectedCategory);


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
          <Button 
            key={category} 
            variant={category === selectedCategory ? 'default' : 'outline'} 
            className="text-sm"
            asChild
          >
            <a href={`/portfolio?category=${category}`}>{category}</a>
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
