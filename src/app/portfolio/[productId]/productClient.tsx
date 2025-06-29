'use client';

import Image from 'next/image';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getUserIdFromToken } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/lib/utils';

export default function ProductDetailClient({ product }: { product: any }) {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = getUserIdFromToken();
    setUserId(id);
  }, []);

  const handleAddToCart = async () => {
    try {
      await axios.post(`${apiUrl}/cart`, {
        productId: product._id,
        quantity: 1,
        userId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error : any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Could not add ${product.name} to cart.`,
        variant: 'destructive',
      });
    }
  };

  return (
     <Container className="py-12 md:py-16">
       <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/portfolio">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
          <Image
            src={product.imageUrl || 'https://placehold.co/800x1000.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            data-ai-hint={product.dataAiHint || "fashion clothing detail"}
          />
        </div>
        <div>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-accent mb-6">{product.price}</p>
          
          <div className="prose prose-lg text-foreground/80 mb-8">
            <h2 className="text-xl font-headline text-primary mb-2">Description</h2>
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="mb-8 space-y-4">
            {/* <div>
              <h3 className="text-md font-semibold text-primary mb-2">Fabric:</h3>
              <p className="text-foreground/80">Premium Silk Blend (example)</p>
            </div> */}
            {/* <div>
              <h3 className="text-md font-semibold text-primary mb-2">Available Sizes:</h3>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <Button key={size} variant="outline" size="sm">{size}</Button>
                ))}
              </div>
            </div> */}
             <div>
              <h3 className="text-md font-semibold text-primary mb-2">Stock:</h3>
              <p className="text-foreground/80">{product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto" disabled={product.stock === 0} aria-label="Add to Cart" onClick={handleAddToCart} >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
