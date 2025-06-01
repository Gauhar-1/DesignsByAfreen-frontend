'use client'; // For form handling

import type { Metadata } from 'next'; // Static metadata for client component
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, CreditCard, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Static metadata for client component
export const metadata: Metadata = {
  title: 'Checkout - Atelier Luxe',
  description: 'Complete your purchase at Atelier Luxe. Enter your shipping and payment details.',
};

const addressFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  addressLine1: z.string().min(5, 'Address is required.'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State/Province is required.'),
  zipCode: z.string().min(5, 'ZIP/Postal code is required.'),
  country: z.string().min(2, 'Country is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(7, 'Phone number is required.'),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Mock order summary values for display
const mockOrder = {
  subtotal: 1550.00,
  shipping: 15.00,
  total: 1565.00,
  items: [
    { name: 'Elegant Evening Gown', quantity: 1, price: '$1200' },
    { name: 'Festive Sequin Dress', quantity: 1, price: '$350' },
  ],
};


export default function CheckoutPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: '', addressLine1: '', city: '', state: '', zipCode: '', country: '', email: '', phone: '',
    },
  });

  async function onSubmit(data: AddressFormValues) {
    setIsSubmitting(true);
    console.log('Checkout data:', data);
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. Your order confirmation will be sent to your email.',
    });
    // Redirect to an order confirmation page or clear cart (not implemented here)
    setIsSubmitting(false);
    form.reset();
  }

  if (!isMounted) {
    return (
      <Container className="py-12 md:py-16 text-center">
         <h1 className="text-3xl font-bold text-primary mb-2">Loading Checkout...</h1>
      </Container>
    )
  }


  return (
    <Container className="py-12 md:py-16">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
      </div>
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Secure Checkout</h1>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="addressLine1" render={({ field }) => ( <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="addressLine2" render={({ field }) => ( <FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="state" render={({ field }) => ( <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="zipCode" render={({ field }) => ( <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="country" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-2 h-6 w-6 text-accent" /> Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder for payment form elements */}
                  <p className="text-muted-foreground">Payment gateway integration (e.g., Stripe, PayPal) would appear here. For now, this is a placeholder.</p>
                   <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" disabled />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="•••" disabled />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Your payment information is secure.</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-1 p-6 shadow-xl sticky top-24">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {mockOrder.items.map(item => (
                  <div key={item.name} className="flex justify-between items-center text-sm text-foreground/90">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p>{item.price}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-foreground/90">
                  <span>Subtotal</span>
                  <span>${mockOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/90">
                  <span>Shipping</span>
                  <span>${mockOrder.shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Total</span>
                  <span>${mockOrder.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-6">
                <Button type="submit" size="lg" className="w-full text-base" disabled={isSubmitting}>
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </Container>
  );
}
