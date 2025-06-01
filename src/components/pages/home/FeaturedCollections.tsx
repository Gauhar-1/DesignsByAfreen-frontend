import { mockPortfolioItems, Product } from '@/lib/mockData';
import ProductCard from '@/components/shared/ProductCard';
import Container from '@/components/layout/Container';

export default function FeaturedCollections() {
  const featuredItems = mockPortfolioItems.slice(0, 4); // Show first 4 items as featured

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">Featured Collections</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Explore our handpicked selection of signature pieces, embodying timeless elegance and modern sophistication.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredItems.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
