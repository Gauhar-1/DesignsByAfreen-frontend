
'use client'; // For form handling

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, CreditCard, Lock, DollarSign, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

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
  paymentMethod: z.enum(['card', 'paypal', 'wallet']).default('card'),
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: '', addressLine1: '', city: '', state: '', zipCode: '', country: '', email: '', phone: '', paymentMethod: 'card',
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
    setSelectedPaymentMethod('card'); // Reset payment method selection
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
                  <CardTitle className="text-2xl font-headline flex items-center"><DollarSign className="mr-2 h-6 w-6 text-accent" /> Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedPaymentMethod(value);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                              <FormControl>
                                <RadioGroupItem value="card" />
                              </FormControl>
                              <FormLabel className="font-normal flex-grow cursor-pointer text-base">
                                <CreditCard className="inline-block mr-2 h-5 w-5 text-muted-foreground" />
                                Credit or Debit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal flex-grow cursor-pointer text-base">
                                {/* Placeholder for PayPal icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block mr-2 text-muted-foreground"><path d="M7.539 18.5L6 10.071h3.063c3.806 0 5.665-1.388 5.665-4.214C14.728 3.094 13.026 2 10.21 2H3.22l2.48 11.071H2.798L0 22h7.687l-.148-1.5zM10.596 3.732c.99 0 1.65.552 1.65 1.828 0 1.388-.991 1.972-2.313 1.972h-1.22L9.674 3.732h.922zm12.924 10.132L21.771 8H17.88l-.751 3.642c-.183.903-.367 1.805-.551 2.708h.138c.386-.963.735-1.888 1.047-2.708L19.482 8h-2.779l-1.837 10.037h3.126l.349-1.678h.128c.184.944.772 1.678 1.58 1.678.625 0 1.148-.257 1.498-.753l.034.753H24l-.48-3.864z"/></svg>
                                PayPal
                              </FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                              <FormControl>
                                <RadioGroupItem value="wallet" />
                              </FormControl>
                              <FormLabel className="font-normal flex-grow cursor-pointer text-base">
                                <ShieldCheck className="inline-block mr-2 h-5 w-5 text-muted-foreground" />
                                Digital Wallet (Apple Pay, Google Pay)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional rendering for payment details based on selection */}
                  {selectedPaymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t">
                       <p className="text-sm text-muted-foreground">Enter your card details:</p>
                       <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="•••• •••• •••• ••••" disabled className="bg-muted/30"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" disabled className="bg-muted/30"/>
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="•••" disabled className="bg-muted/30"/>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'paypal' && (
                    <div className="space-y-4 pt-4 border-t text-center">
                      <p className="text-muted-foreground">You will be redirected to PayPal to complete your payment.</p>
                      <Button variant="outline" disabled className="bg-blue-600 hover:bg-blue-700 text-white">
                        Proceed to PayPal (Placeholder)
                      </Button>
                    </div>
                  )}

                   {selectedPaymentMethod === 'wallet' && (
                    <div className="space-y-4 pt-4 border-t text-center">
                      <p className="text-muted-foreground">Follow the prompts from your digital wallet provider.</p>
                      <Button variant="outline" disabled className="bg-black hover:bg-gray-800 text-white">
                        Pay with Digital Wallet (Placeholder)
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground pt-4">
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

