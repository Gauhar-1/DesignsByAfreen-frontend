
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';

export default function HeroSection() {
  return (
     <div className="relative bg-gradient-radial from-primary/10 via-background to-background flex items-center min-h-[60vh] md:min-h-[70vh]">
      <Container className="py-16 md:py-24">
       <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">
            Discover Your Signature Style
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/80">
            Experience bespoke fashion that tells your story. Designs by Afreen offers unique, handcrafted designs tailored to your individuality and elegance.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg py-7 px-10">
              <Link href="/portfolio">Explore Collections</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg py-7 px-10 border-primary text-primary hover:bg-primary/10">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
