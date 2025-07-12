
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, DollarSign, Lock, Paperclip, QrCode, Landmark, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCartItems, type CartItem as ApiCartItem } from '@/lib/api';
import { getUserIdFromToken } from '@/lib/auth';
import axios from 'axios';
import { apiUrl } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

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
  paymentMethod: z.enum(['cod', 'upi']).default('cod'),
  upiReferenceNumber: z.string().optional(),
  paymentScreenshotUri: z.string().optional().describe("Payment screenshot as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
}).refine( (data) => data.paymentMethod === 'upi' ? !!data.upiReferenceNumber && data.upiReferenceNumber.trim() !== '' : true, { message: 'Transaction reference number is required for UPI/QR payments.', path: ['upiReferenceNumber'], }
).refine( (data) => data.paymentMethod === 'upi' ? !!data.paymentScreenshotUri : true, { message: 'Payment screenshot is required for UPI/QR payments.', path: ['paymentScreenshotUri'], }
);

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function CheckoutPage() {
  const { toast } = useToast();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod');
  const router = useRouter();
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [ prices, setPrices ] = useState(0);
  const { userId } = useAuth();

 

  useEffect(() => {
     if (!userId) return;
    setIsMounted(true);
    async function loadCart() {
      try {
        setIsLoadingCart(true);
        const items = await axios.get(`${apiUrl}/cart`, { params : { id : userId}});
        setCartItems(items.data.items || []);
      } catch (err) {
        toast({ title: 'Error', description: 'Could not load cart for summary.', variant: 'destructive' });
      } finally {
        setIsLoadingCart(false);
      }
    }
    loadCart();
  }, [toast, userId]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: '', addressLine1: '', city: '', state: '', zipCode: '', country: '', email: '', phone: '', 
      paymentMethod: 'cod', upiReferenceNumber: '', paymentScreenshotUri: undefined,
    },
  });

  const handleScreenshotUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast({ title: 'File too large', description: 'Please upload an image smaller than 5MB.', variant: 'destructive' });
        form.setValue('paymentScreenshotUri', undefined);
        if (event.target) event.target.value = ''; 
        return;
      }
      try {
        const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'designsByAfreen'); // <-- your upload preset

    const res = await axios.post('https://api.cloudinary.com/v1_1/dccklqtaw/image/upload', formData);

    const data =  res.data;

    if (data.secure_url) {
       form.setValue('paymentScreenshotUri', data.secure_url, { shouldValidate: true });
      console.log('Image uploaded successfully:', data.secure_url);
    } else {
      throw new Error('Image upload failed');
    }
      } catch (error) {
        form.setValue('paymentScreenshotUri', undefined, { shouldValidate: true });
        if (event.target) event.target.value = '';
        toast({ title: 'Error uploading image', description: 'Could not process the image file. Please try another.', variant: 'destructive' });
      }
    } else {
      form.setValue('paymentScreenshotUri', undefined, { shouldValidate: true });
    }
  };


  async function onSubmit(data: AddressFormValues) {
    setIsSubmittingForm(true);
    console.log('Checkout data:', data);
    if (data.paymentMethod === 'upi') {
      console.log('UPI Reference:', data.upiReferenceNumber);
      console.log('Screenshot URI (first 100 chars):', data.paymentScreenshotUri?.substring(0,100) + '...');
    }
    await axios.post(`${apiUrl}/order`, { 
      data,
      cartItems,
      userId,
      prices,
    })
    toast({ title: 'Order Placed!', description: 'Thank you for your purchase. Your order confirmation will be sent to your email.' });
    setIsSubmittingForm(false); 
    form.reset({
      fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: '', email: '', phone: '',
      paymentMethod: 'cod', upiReferenceNumber: '', paymentScreenshotUri: undefined,
    }); 
    setSelectedPaymentMethod('cod');
    const fileInput = document.querySelector('input[type="file"][name="paymentScreenshotUriProxy"]') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
    router.push('/');
  }

 useEffect(() => {
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price);
    return acc + price * item.quantity;
  }, 0);
  const shipping = cartItems.length > 0 ? 15.0 : 0;
  const total = subtotal + shipping;
  setPrices(total);
}, [cartItems]);


  if (!isMounted) {
    return ( <Container className="py-12 md:py-16 text-center"> <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" /> <h1 className="text-3xl font-bold text-primary mb-2">Loading Checkout...</h1> </Container> );
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="mb-8">
        <Link href="/cart">
            <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                 Back to Cart
            </Button>
        </Link>
      </div>
      <header className="mb-12 text-center"> <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Secure Checkout</h1> </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg">
                <CardHeader> <CardTitle className="text-2xl font-headline">Shipping Address</CardTitle> </CardHeader>
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
                <CardHeader> <CardTitle className="text-2xl font-headline flex items-center"><DollarSign className="mr-2 h-6 w-6 text-accent" /> Payment Method</CardTitle> </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">Select Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            ref={field.ref}
                            name={field.name}
                            onValueChange={(value) => {
                              field.onChange(value); // RHF's onChange
                              setSelectedPaymentMethod(value);
                              if (value === 'cod') {
                                form.setValue('upiReferenceNumber', '', { shouldValidate: true });
                                form.setValue('paymentScreenshotUri', undefined, { shouldValidate: true });
                                const fileInput = document.querySelector('input[type="file"][name="paymentScreenshotUriProxy"]') as HTMLInputElement | null;
                                if (fileInput) fileInput.value = '';
                              }
                            }}
                            onBlur={field.onBlur}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                           <div className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                              <RadioGroupItem value="cod" id="payment-cod" />
                              <Label htmlFor="payment-cod" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal flex-grow cursor-pointer text-base">
                                <Landmark className="inline-block mr-2 h-5 w-5 text-muted-foreground" /> Cash on Delivery (COD)
                              </Label>
                            </div>
                             <div className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                               <RadioGroupItem value="upi" id="payment-upi" />
                              <Label htmlFor="payment-upi" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal flex-grow cursor-pointer text-base">
                                <QrCode className="inline-block mr-2 h-5 w-5 text-muted-foreground" /> QR / UPI Payment
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}/>

                  {selectedPaymentMethod === 'cod' && ( <div className="space-y-4 pt-4 border-t"> <p className="text-muted-foreground">You will pay the delivery person when your order arrives.</p> </div> )}
                  {selectedPaymentMethod === 'upi' && (
                    <div className="space-y-6 pt-4 border-t">
                       <p className="text-sm text-muted-foreground">Scan the QR code or use the UPI ID below to make your payment. Then, enter the transaction reference number and upload a screenshot of your payment.</p>
                       <div className="flex flex-col items-center gap-4"> <Image src="https://placehold.co/200x200.png" alt="UPI QR Code" width={150} height={150} data-ai-hint="qr code" className="rounded-md border" /> <p className="font-semibold text-lg">UPI ID: <span className="text-primary font-mono">atelierluxe@exampleupi</span></p> </div>
                        <FormField control={form.control} name="upiReferenceNumber" render={({ field }) => ( 
                          <FormItem> 
                            <FormLabel>Transaction Reference Number</FormLabel> 
                            <FormControl> 
                              <Input placeholder="Enter your payment reference ID" {...field} value={field.value || ''} /> 
                            </FormControl> 
                            <FormMessage /> 
                          </FormItem> 
                        )}/>
                        <FormField
                          control={form.control}
                          name="paymentScreenshotUri" // This name is used by RHF for value and errors
                           render={({ field }) => ( // We get field for RHF context but handle input manually
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" /> Upload Payment Screenshot (max 5MB)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  name="paymentScreenshotUriProxy" // Different name to avoid RHF conflicts if any
                                  onBlur={field.onBlur} // Keep RHF's onBlur for touched state
                                  onChange={handleScreenshotUpload} // Custom handler
                                  className="text-base py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div> )}
                  <div className="flex items-center text-sm text-muted-foreground pt-4"> <Lock className="h-4 w-4 mr-2" /> <span>Your personal information is secure.</span> </div>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-1 p-6 shadow-xl sticky top-24">
              <CardHeader className="p-0 pb-6"> <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle> </CardHeader>
              <CardContent className="p-0 space-y-4">
                {isLoadingCart ? <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/></div> : 
                cartItems.length > 0 ? (
                  cartItems.map(item => ( <div key={item.productId} className="flex justify-between items-center text-sm text-foreground/90"> <div> <p className="font-medium">{item.name}</p> <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p> </div> <p>{item.price}</p> </div> ))
                ) : <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
                <Separator />
                <div className="flex justify-between text-foreground/90"> <span>Subtotal</span> <span>₹{prices.toFixed(2)}</span> </div>
                <div className="flex justify-between text-foreground/90"> <span>Shipping</span> <span>₹15</span> </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-primary"> <span>Total</span> <span>₹{prices.toFixed(2)}</span> </div>
              </CardContent>
              <CardFooter className="p-0 pt-6"> <Button type="submit" size="lg" className="w-full text-base" disabled={isSubmittingForm || isLoadingCart || cartItems.length === 0}> {isSubmittingForm ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Placing Order...</>) : ('Place Order')} </Button> </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </Container>
  );
}
