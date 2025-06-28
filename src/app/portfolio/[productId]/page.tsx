export const dynamic = "force-dynamic";


import type { Metadata, ResolvingMetadata } from 'next';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { apiUrl } from '@/lib/utils';
import axios from 'axios';
import ProductDetailClient from './productClient';

type Props = {
  params: { productId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = params.productId;

  try {
    const result = await axios.get(`${apiUrl}/products/byId`, {
      params: { id: productId },
    });

    const product = result.data?.product;

    if (!product) {
      return {
        title: 'Product Not Found - Designs by Afreen',
      };
    }

    return {
      title: `${product.name} - Designs by Afreen`,
      description: product.description || `Details for ${product.name}.`,
    };
  } catch (error) {
    return {
      title: 'Product - Designs by Afreen',
      description: 'View product details from Designs by Afreen.',
    };
  }
}


export default async function ProductDetailPage({ params }: Props) {
  const productId = params.productId  ;

  const result = await axios.get(`${apiUrl}/products/byId`,{
     params: { id: productId}
  });


  if (!result.data) {
    return (
      <Container className="py-12 md:py-16 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/portfolio">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </Container>
    );
  }
  
  const product = result.data.product;
  // console.log(product.data.product);

  return <ProductDetailClient product={product} />
}

