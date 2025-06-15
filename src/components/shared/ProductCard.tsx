
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Product as ApiProductType } from '@/lib/api'; // Use Product from api.ts
import { addProductToCart } from '@/lib/api';

interface ProductCardProps {
  product: ApiProductType;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: !isWishlisted ? 'Added to Wishlist' : 'Removed from Wishlist',
      description: product.name,
    });
  };

  const handleAddToCart = async () => {
    try {
      await addProductToCart(product.id, 1);
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });
      // In a real app, you might update a global cart state or trigger a refetch
      console.log('Added to cart (simulated):', product);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Could not add ${product.name} to cart.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={cn("overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group flex flex-col", className)}>
      <Link href={`/portfolio/${product.id}`} passHref className="block">
        <div className="aspect-[3/4] overflow-hidden relative">
          <Image
            src={product.imageUrl || 'https://placehold.co/600x800.png'}
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
      <CardFooter className="p-4 flex-wrap gap-2 mt-auto">
        <Button variant="outline" size="sm" aria-label="Add to Wishlist" onClick={handleWishlistToggle} className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-none">
          <Heart className="h-4 w-4 mr-1 sm:mr-2" fill={isWishlisted ? 'hsl(var(--primary))' : 'none'} />
          Wishlist
        </Button>
        <Button size="sm" aria-label="Add to Cart" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-none">
          <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
