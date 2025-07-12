"use client"

import Link from 'next/link';
import { Instagram, Twitter, Facebook, Shield } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import Container from '@/components/layout/Container';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { role } = useAuth();

  return (
    <footer className="bg-muted/50 border-t border-border/40">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Crafting elegance, one stitch at a time.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" passHref aria-label="Instagram">
              <Instagram className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
            <Link href="#" passHref aria-label="Twitter">
              <Twitter className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
            <Link href="#" passHref aria-label="Facebook">
              <Facebook className="h-6 w-6 text-foreground/70 hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Designs by Afreen. All rights reserved.</p>
          <div className="mt-2">
           { role === 'admin' && (
  <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center">
    <Shield className="h-3 w-3 mr-1" />
    Admin Panel
  </Link>
) }

          </div>
        </div>
      </Container>
    </footer>
  );
}
