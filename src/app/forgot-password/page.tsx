
'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Container from '@/components/layout/Container';
import { useToast } from '@/hooks/use-toast';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/authSchemas';
import { useState } from 'react';
import { Loader2, MailCheck, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    setMessageSent(false);
    // try {
    //   const result = await requestPasswordReset(data);
    //   if (result.success) {
    //     toast({
    //       title: 'Request Sent',
    //       description: result.message,
    //     });
    //     setMessageSent(true);
    //     form.reset();
    //     // Optionally redirect or show a message to check email
    //   } else {
    //     toast({
    //       title: 'Request Failed',
    //       description: result.message || 'An unexpected error occurred.',
    //       variant: 'destructive',
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: (error as Error).message || 'Failed to send request. Please try again.',
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <Container className="py-12 md:py-24 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-10 w-10 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Forgot Your Password?</CardTitle>
          <CardDescription>
            {messageSent 
              ? "Please check your email for a password reset link."
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        {!messageSent ? (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., 123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        ) : (
          <CardContent className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p className="text-muted-foreground">If an account with the provided email exists, a reset link has been sent.</p>
          </CardContent>
        )}
        <CardFooter className="flex flex-col items-center space-y-2 pt-6">
          <Button variant="link" asChild className="text-sm">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
