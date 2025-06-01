
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Paperclip } from 'lucide-react';
import { useState } from 'react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  photoDataUri: z.string().optional().describe("A reference photo as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// This would be a server action in a real application
async function submitContactForm(data: ContactFormValues) {
  console.log('Contact form submitted:', data);
  if (data.photoDataUri) {
    console.log('Photo Data URI (first 100 chars):', data.photoDataUri.substring(0, 100) + '...');
  }
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would send this data to Firestore here.
  // e.g., await addDoc(collection(db, "messages"), data);
  return { success: true, message: 'Message sent successfully!' };
}


export default function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      photoDataUri: undefined,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        form.setValue('photoDataUri', undefined);
        event.target.value = ''; // Reset file input
        return;
      }
      try {
        const dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        form.setValue('photoDataUri', dataUri);
      } catch (error) {
        console.error("Error converting file to data URI:", error);
        form.setValue('photoDataUri', undefined);
        event.target.value = ''; // Reset file input
        toast({
          title: 'Error uploading image',
          description: 'Could not process the image file. Please try another.',
          variant: 'destructive',
        });
      }
    } else {
      form.setValue('photoDataUri', undefined);
    }
  };

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const response = await submitContactForm(data);
      if (response.success) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for contacting us. We will get back to you shortly.',
        });
        form.reset();
        // Manually reset the file input display if necessary, though form.reset() might handle it
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement | null;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(response.message || 'Failed to send message.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} className="text-base py-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} className="text-base py-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px] text-base py-3"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photoDataUri"
          render={({ field }) => ( // `field` can be used for errors, but onChange is handled manually
            <FormItem>
              <FormLabel className="text-base flex items-center">
                <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                Reference Photo (Optional, max 5MB)
              </FormLabel>
              <FormControl>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-base py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto text-base py-3 px-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </Form>
  );
}
