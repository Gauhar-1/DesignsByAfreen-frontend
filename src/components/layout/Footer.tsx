
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import Container from '@/components/layout/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
        </div>
      </Container>
    </footer>
  );
}
