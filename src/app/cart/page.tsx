
'use client'; 

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchCartItems, updateCartItemQuantity, removeProductFromCart, type CartItem as ApiCartItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { apiUrl } from '@/lib/utils';
import debounce from 'lodash.debounce';
import { getUserIdFromToken } from '@/lib/auth';



export default function CartPage() {
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
   const debounceMapRef = useRef<Record<string, ReturnType<typeof debounce>>>({});
   const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      try {
        setIsLoading(true);
        setError(null);
        const items = await axios.get(`${apiUrl}/cart`, { params : { id : userId}});
        setCartItems(items.data.items || []);
      } catch (err) {
        setError('Failed to load cart items.');
        toast({ title: 'Error', description: 'Could not load your cart.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, [toast, userId]);

  const debouncedUpdateQuantity = useCallback((productId: string, quantity: number) => {
  if (!debounceMapRef.current[productId]) {
    debounceMapRef.current[productId] = debounce(async (pid: string, qty: number) => {
      try {
        await axios.put(`${apiUrl}/cart`, {
          productId: pid,
          quantity: qty,
          userId
        });
        toast({ title: qty < 1 ? 'Item Removed' : 'Quantity Updated' });
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to update quantity.', variant: 'destructive' });
      }
    }, 500);
  }
  debounceMapRef.current[productId](productId, quantity);
}, [toast]);

const handleUpdateQuantity = (productId: string, newQuantity: number) => {
  setCartItems(prevItems => {
    const originalItem = prevItems.find(item => item.productId === productId);
    const updatedItems = prevItems
      .map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity < 1 ? 0 : newQuantity }
          : item
      )
      .filter(item => item.quantity > 0);

    debouncedUpdateQuantity(productId, newQuantity);

    if (newQuantity < 1 && originalItem) {
      toast({
        title: 'Item Removed',
        description: `${originalItem.name} removed from cart.`,
      });
    }
    return updatedItems;
  });
};

useEffect(() => {
  const id = getUserIdFromToken();
  if (id) setUserId(id);
}, []);


  // const handleUpdateQuantity = async (id: string, newQuantity: number) => {
  //   const originalQuantity = cartItems.find(item => item.id === id)?.quantity;
  //   const optimisticUpdate = cartItems.map(item =>
  //     item.id === id ? { ...item, quantity: newQuantity < 1 ? 0 : newQuantity } : item
  //   ).filter(item => item.quantity > 0);
    
  //   setCartItems(optimisticUpdate);

  //   try {
  //     await updateCartItemQuantity(id, newQuantity);
  //     // If server confirms, cartItems is already updated optimistically.
  //     // If newQuantity was < 1, the item is already removed optimistically.
  //     // If server sync is needed after update (e.g., getting new totals), refetch cart.
  //     // For this mock, optimistic is fine.
  //      if (newQuantity < 1) {
  //        toast({ title: 'Item Removed', description: `${cartItems.find(item => item.id === id)?.name} removed from cart.` });
  //      } else {
  //        toast({ title: 'Quantity Updated' });
  //      }
  //   } catch (err) {
  //     toast({ title: 'Error', description: 'Failed to update quantity.', variant: 'destructive' });
  //     // Revert optimistic update
  //     setCartItems(prevItems => prevItems.map(item => item.id === id ? {...item, quantity: originalQuantity || 1} : item));
  //   }
  // };

  const handleRemoveItem = async (id: string) => {
    const itemName = cartItems.find(item => item.productId === id)?.name;
    const originalItems = [...cartItems];
    setCartItems(prevItems => prevItems.filter(item => item.productId !== id));
    try {
      await axios.delete(`${apiUrl}/cart`, {
        params: {
          productId: id,
          userId
        }
      });
      toast({ title: 'Item Removed', description: `${itemName} removed from cart.`});
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to remove item.', variant: 'destructive' });
      setCartItems(originalItems); // Revert
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + price * item.quantity;
  }, 0);

  const shippingCost = cartItems.length > 0 ? 15 : 0; 
  const total = subtotal + shippingCost;

  if (isLoading) {
    return (
      <Container className="py-12 md:py-16 text-center">
        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Loading Your Cart...</h1>
      </Container>
    );
  }
  if (error) {
     return (
      <Container className="py-12 md:py-16 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Error Loading Cart</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={async () => {
             try { setIsLoading(true); setError(null); const items = await fetchCartItems(); setCartItems(items); }
             catch (err) { setError('Failed to load cart items.'); }
             finally { setIsLoading(false); }
        }}>Try Again</Button>
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
          <Link href="/portfolio" passHref>
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 shadow-md">
                <div className="relative w-24 h-32 sm:w-32 sm:h-40 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl || 'https://placehold.co/128x160.png'}
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
                  <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity"> <Minus className="h-4 w-4" /> </Button>
                  <Input type="number" value={item.quantity} onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))} className="w-16 text-center h-9" min="1"/>
                  <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity"> <Plus className="h-4 w-4" /> </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)} className="text-destructive hover:text-destructive/80 ml-auto sm:ml-4" aria-label="Remove item"> <Trash2 className="h-5 w-5" /> </Button>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 p-6 shadow-xl sticky top-24">
            <CardHeader className="p-0 pb-6"> <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle> </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex justify-between text-foreground/90"> <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span> </div>
              <div className="flex justify-between text-foreground/90"> <span>Estimated Shipping</span> <span>${shippingCost.toFixed(2)}</span> </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-primary"> <span>Total</span> <span>${total.toFixed(2)}</span> </div>
            </CardContent>
            <CardFooter className="p-0 pt-6">
              <Link href="/checkout" passHref className="w-full">
                <Button size="lg" className="w-full text-base">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
    </Container>
  );
}
