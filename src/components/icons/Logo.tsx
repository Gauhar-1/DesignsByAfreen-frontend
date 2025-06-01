
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Logo = ({ className }: { className?: string }) => (
  <Link href="/" className={cn("font-headline text-3xl font-bold text-primary hover:text-accent transition-colors", className)}>
    Designs by Afreen
  </Link>
);
export default Logo;
