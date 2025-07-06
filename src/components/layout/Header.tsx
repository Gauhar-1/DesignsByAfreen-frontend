
'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/Logo';
import { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/order-history', label: 'Order History' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { logout, isLoggedIn } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) {
    // Render a basic layout or null during SSR/SSG to avoid hydration issues with client-side state
    return (
      <header className="sticky top-0 z-[1000] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <Logo />
            {/* Basic structure for SSR or when not mounted */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="outline" size="sm">Login</Button>
            </div>
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" aria-label="Cart" className="mr-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-4">
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
            { isLoggedIn ? (
              <>
                {/* <Link href="/profile" passHref>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={async () => await logoutUserAction()}>Logout</Button> */}
                <span className="text-sm">Welcome, User!</span> 
                 <Button
  variant="outline"
  size="sm"
  onClick={logout}
>
  Logout
</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">
                     <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                  </Link>
                </Button>
              </>
            )}
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
              <hr className="my-2 border-border" />
              { isLoggedIn ? (
                <>
                  {/* <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2">Profile</Link>
                  <Button variant="outline" className="w-full" onClick={async () => { await logoutUserAction(); setIsMobileMenuOpen(false); }}>Logout</Button> */}
                   <span className="block text-base font-medium text-foreground py-2">Welcome, User!</span>
                   <Button
  variant="outline"
  size="sm"
  onClick={logout}
>
  Logout
</Button>

                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2">
                    <LogIn className="h-5 w-5 mr-2 inline-block" />Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2">
                    <UserPlus className="h-5 w-5 mr-2 inline-block" />Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
