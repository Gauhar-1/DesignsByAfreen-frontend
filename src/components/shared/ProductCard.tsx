import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group", className)}>
      <Link href={`/portfolio/${product.id}`} passHref>
        <div className="aspect-[3/4] overflow-hidden relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
            data-ai-hint={product.dataAiHint || "fashion clothing"}
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/portfolio/${product.id}`} passHref>
            <CardTitle className="text-lg font-headline hover:text-primary transition-colors truncate">{product.name}</CardTitle>
        </Link>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg font-semibold text-primary">{product.price}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Button variant="outline" size="sm" aria-label="Add to Wishlist">
          <Heart className="h-4 w-4 mr-2" />
          Wishlist
        </Button>
        <Button size="sm" aria-label="Add to Cart">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
