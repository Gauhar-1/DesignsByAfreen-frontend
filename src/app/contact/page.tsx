
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import ContactForm from '@/components/pages/contact/ContactForm';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Designs by Afreen',
  description: 'Get in touch with Designs by Afreen for consultations, inquiries, or collaborations. Reach out via our contact form, email, or social media.',
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our collections, need a consultation, or want to collaborate, feel free to reach out.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="bg-card p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-headline text-primary mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>
        
        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-headline text-primary mb-6">Contact Information</h2>
            <ul className="space-y-4 text-foreground/90">
              <li className="flex items-start">
                <Mail className="h-6 w-6 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a href="mailto:info@designsbyafreen.com" className="hover:text-primary transition-colors">info@designsbyafreen.com</a>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="h-6 w-6 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <a href="tel:+1234567890" className="hover:text-primary transition-colors">+1 (234) 567-890</a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 mt-1 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Studio Address</h3>
                  <p>123 Fashion Avenue, Suite 4B, Paris, France (By Appointment Only)</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-headline text-primary mb-6">Connect With Us</h2>
            <div className="flex space-x-4 mb-6">
              <Button variant="outline" size="icon" asChild aria-label="Instagram">
                <Link href="#" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Twitter">
                <Link href="#" target="_blank" rel="noopener noreferrer"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="Facebook">
                <Link href="#" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5" /></Link>
              </Button>
            </div>
            <Button asChild className="w-full md:w-auto" variant="default">
              <Link href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
