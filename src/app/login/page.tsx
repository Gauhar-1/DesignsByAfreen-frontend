
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
import { loginSchema, type LoginInput } from '@/lib/schemas/authSchemas';
import { useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { apiUrl } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';



export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await axios.post(`${apiUrl}/auth/login`, data);
      if (result.data.success) {
        toast({
          title: 'Login Successful',
          description: result.data.message,
        });
        // TODO: Handle successful login (e.g., store token)
        if(!result.data.token){
            console.log("Token not found", result.data.token)
          }

        login(result.data.token);// Store token in context
        form.reset();
        router.push('/'); // Navigate to home page
      } else {
        toast({
          title: 'Login Failed',
          description: result.data.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to login. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container className="py-12 md:py-24 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-base py-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <Button variant="link" asChild className="text-sm">
            <Link href="/forgot-password">Forgot Password?</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/signup" className="font-semibold text-primary hover:text-accent">Sign Up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </Container>
  );
}
