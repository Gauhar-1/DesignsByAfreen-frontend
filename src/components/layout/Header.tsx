'use client';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/trending-styles', label: 'Trending Styles' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) {
    return null; 
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </Button>
            </Link>
          </nav>
          <div className="md:hidden flex items-center">
             <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" aria-label="Cart" className="mr-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-card rounded-md shadow-lg">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
