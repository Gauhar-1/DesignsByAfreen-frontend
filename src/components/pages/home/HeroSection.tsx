
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-background to-background min-h-[70vh] md:min-h-[80vh] flex items-center">
      <Container className="py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">
              Discover Your Signature Style
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-xl mx-auto md:mx-0">
              Experience bespoke fashion that tells your story. Designs by Afreen offers unique, handcrafted designs tailored to your individuality and elegance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="text-lg py-7 px-10">
                <Link href="/portfolio">Explore Collections</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg py-7 px-10 border-primary text-primary hover:bg-primary/10">
                <Link href="/contact">Book a Consultation</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/5] max-h-[70vh] rounded-lg overflow-hidden shadow-2xl order-first md:order-last">
            <Image
              src="https://placehold.co/800x1000.png" 
              alt="Elegant fashion model showcasing Designs by Afreen design"
              fill
              priority
              className="object-cover"
              data-ai-hint="fashion model elegant"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
