
import NewsletterForm from '@/components/shared/NewsletterForm';
import Container from '@/components/layout/Container';

export default function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Stay in Vogue</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Subscribe to our newsletter for exclusive updates on new collections, special offers, and fashion insights from Designs by Afreen.
          </p>
          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
