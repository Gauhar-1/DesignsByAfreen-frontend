import { mockTestimonials, Testimonial } from '@/lib/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">Words of Acclaim</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Hear from our valued clients who have experienced the artistry and dedication of Atelier Luxe.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockTestimonials.map((testimonial: Testimonial) => (
            <Card key={testimonial.id} className="shadow-lg flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 p-6">
                {testimonial.avatarUrl && (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatarUrl}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                      data-ai-hint={testimonial.dataAiHint || "portrait person"}
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold font-headline text-primary">{testimonial.author}</h3>
                  {testimonial.role && <p className="text-sm text-muted-foreground">{testimonial.role}</p>}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/90 italic leading-relaxed">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
