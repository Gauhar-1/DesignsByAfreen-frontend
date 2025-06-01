'use client'; // This page requires client-side state for cart management

import type { Metadata } from 'next'; // Metadata can still be defined, but it's static for client components like this.
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockCartItems, CartItem } from '@/lib/mockData';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Static metadata for client component
export const metadata: Metadata = {
  title: 'Your Shopping Cart - Atelier Luxe',
  description: 'Review items in your shopping cart, update quantities, and proceed to checkout.',
};


export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Simulate fetching cart items or loading from local storage
    setCartItems(mockCartItems); 
    setIsMounted(true);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + price * item.quantity;
  }, 0);

  const shippingCost = cartItems.length > 0 ? 15 : 0; // Example shipping
  const total = subtotal + shippingCost;

  if (!isMounted) {
    // To prevent hydration mismatch, render nothing or a loader until client-side state is ready
    return (
      <Container className="py-12 md:py-16 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Loading Your Cart...</h1>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Your Shopping Cart</h1>
      </header>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <p className="text-xl text-muted-foreground mb-4">Your cart is currently empty.</p>
          <Button asChild size="lg">
            <Link href="/portfolio">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 shadow-md">
                <div className="relative w-24 h-32 sm:w-32 sm:h-40 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    data-ai-hint={item.dataAiHint || "cart item fashion"}
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/portfolio/${item.id}`} passHref>
                    <h2 className="text-lg font-semibold font-headline hover:text-primary transition-colors">{item.name}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-lg font-semibold text-primary mt-1">{item.price}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 text-center h-9"
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80 ml-auto sm:ml-4" aria-label="Remove item">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 p-6 shadow-xl sticky top-24">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex justify-between text-foreground/90">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground/90">
                <span>Estimated Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="p-0 pt-6">
              <Button asChild size="lg" className="w-full text-base">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Container>
  );
}
