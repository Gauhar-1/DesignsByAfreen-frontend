
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
  { id: '1', name: 'Elegant Evening Gown', category: 'Bridal', price: '$1200', imageUrl: 'https://images.unsplash.com/photo-1620257493155-ec4ab7d13a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxldmVuaW5nJTIwZ293biUyMGZhc2hpb258ZW58MHx8fHwxNzQ4Nzk4NjA0fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'evening gown fashion', description: 'A stunning silk charmeuse evening gown, perfect for galas and weddings.' },
  { id: '2', name: 'Chic Casual Blazer', category: 'Casual', price: '$350', imageUrl: 'https://images.unsplash.com/photo-1696238404588-e4448aee3190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjYXN1YWwlMjBibGF6ZXIlMjBtb2RlbHxlbnwwfHx8fDE3NDg3OTg2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'casual blazer model', description: 'Versatile linen blazer for a polished yet relaxed look.' },
  { id: '3', name: 'Festive Sequin Dress', category: 'Festive', price: '$750', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzZXF1aW4lMjBkcmVzcyUyMHBhcnR5fGVufDB8fHx8MTc0ODc5ODYwM3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'sequin dress party', description: 'Dazzling sequin mini dress, designed to make a statement.' },
  { id: '4', name: 'Bohemian Maxi Skirt', category: 'Casual', price: '$280', imageUrl: 'https://images.unsplash.com/photo-1557431968-2c43c8e896e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxib2hlbWlhbiUyMHNraXJ0JTIwZmFzaGlvbnxlbnwwfHx8fDE3NDg3OTg2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'bohemian skirt fashion', description: 'Flowy cotton maxi skirt with intricate embroidery details.' },
  { id: '5', name: 'Modern Bridal Jumpsuit', category: 'Bridal', price: '$950', imageUrl: 'https://images.unsplash.com/photo-1481535668376-4c3ab7d84e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxicmlkYWwlMjBqdW1wc3VpdCUyMG1vZGVybnxlbnwwfHx8fDE3NDg3OTg2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'bridal jumpsuit modern', description: 'A contemporary take on bridal wear, this jumpsuit features wide legs and a lace bodice.' },
  { id: '6', name: 'Tailored Wool Coat', category: 'Outerwear', price: '$890', imageUrl: 'https://images.unsplash.com/photo-1580047883831-5db03837b0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b29sJTIwY29hdCUyMHN0eWxpc2h8ZW58MHx8fHwxNzQ4Nzk4NjAzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'wool coat stylish', description: 'Luxurious wool coat with a timeless silhouette for colder seasons.' },
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
