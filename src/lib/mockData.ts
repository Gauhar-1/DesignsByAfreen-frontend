export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  dataAiHint?: string;
  description?: string; // Added for potential product detail page
}

export const mockPortfolioItems: Product[] = [
  { id: '1', name: 'Elegant Evening Gown', category: 'Bridal', price: '$1200', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'evening gown fashion', description: 'A stunning silk charmeuse evening gown, perfect for galas and weddings.' },
  { id: '2', name: 'Chic Casual Blazer', category: 'Casual', price: '$350', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'casual blazer model', description: 'Versatile linen blazer for a polished yet relaxed look.' },
  { id: '3', name: 'Festive Sequin Dress', category: 'Festive', price: '$750', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'sequin dress party', description: 'Dazzling sequin mini dress, designed to make a statement.' },
  { id: '4', name: 'Bohemian Maxi Skirt', category: 'Casual', price: '$280', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'bohemian skirt fashion', description: 'Flowy cotton maxi skirt with intricate embroidery details.' },
  { id: '5', name: 'Modern Bridal Jumpsuit', category: 'Bridal', price: '$950', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'bridal jumpsuit modern', description: 'A contemporary take on bridal wear, this jumpsuit features wide legs and a lace bodice.' },
  { id: '6', name: 'Tailored Wool Coat', category: 'Outerwear', price: '$890', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'wool coat stylish', description: 'Luxurious wool coat with a timeless silhouette for colder seasons.' },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

export const mockTestimonials: Testimonial[] = [
  { id: '1', quote: 'Atelier Luxe transformed my vision into a breathtaking reality. The craftsmanship is truly exceptional!', author: 'Sophia Lorenza', role: 'Happy Bride', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'elegant woman portrait' },
  { id: '2', quote: 'The attention to detail and personalized service are unparalleled. I felt like a star in my custom gown.', author: 'Isabelle Moreau', role: 'Gala Attendee', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'stylish person' },
  { id: '3', quote: 'Working with Atelier Luxe was a dream. The designs are innovative, chic, and incredibly well-made.', author: 'Olivia Chen', role: 'Fashion Influencer', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'fashion blogger' },
];

export interface CartItem extends Product {
  quantity: number;
}

export const mockCartItems: CartItem[] = [
  { ...mockPortfolioItems[0], quantity: 1 },
  { ...mockPortfolioItems[2], quantity: 2 },
];
