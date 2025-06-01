'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const newsletterFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export default function NewsletterForm() {
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: NewsletterFormValues) {
    // Placeholder for actual newsletter subscription logic (e.g., API call to Firebase Function + Mailchimp/SendGrid)
    console.log('Newsletter subscription data:', data);
    toast({
      title: 'Subscribed!',
      description: `Thank you for subscribing with ${data.email}.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="email" placeholder="Enter your email for updates" {...field} className="pl-10 py-6 text-base" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full py-6 text-base" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
        </Button>
      </form>
    </Form>
  );
}
