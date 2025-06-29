
// In-memory data store
// Simulates a backend API

import { Key, ReactNode } from "react";

export interface Product {
  _id: any;
  id: string;
  name: string;
  category: string;
  price: string; // Keep as string for display consistency, convert to number for calculations if needed
  stock: string;
  imageUrl?: string;
  dataAiHint?: string;
  description?: string;
}

export interface OrderItem {
  id: string; // product id
  name: string;
  quantity: number;
  price: string; // price per unit at time of order
  imageUrl?: string;
  dataAiHint?: string;
}

export interface Order {
  referenceNumber: string;
  _id: string;
  customer: string;
  phone: string;
  createdAt: string; // ISO string or 'YYYY-MM-DD'
  total: string; // Formatted string like '$1250.00'
  status: 'Shipped' | 'Processing' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  paymentMethod:  'cod' | 'upi';
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  upiReferenceNumber?: string;
  paymentScreenshotUri?: string;
}

export interface User {
  timestamps: ReactNode;
  phone: ReactNode;
  _id: Key | null | undefined;
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
  joined: string; // ISO string or 'YYYY-MM-DD'
  avatar?: string;
  dataAiHint?: string;
  isBlocked?: boolean;
  // passwordHash?: string; // In a real scenario, never store plain passwords
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  productId: string;
  quantity: number;
}


// --- In-Memory Data Store ---
let productsStore: Product[] = [
  { id: '1', name: 'Elegant Evening Gown', category: 'Bridal', price: '$1200', stock: 10, imageUrl: 'https://images.unsplash.com/photo-1620257493155-ec4ab7d13a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxldmVuaW5nJTIwZ293biUyMGZhc2hpb258ZW58MHx8fHwxNzQ4Nzk4NjA0fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'evening gown fashion', description: 'A stunning silk charmeuse evening gown, perfect for galas and weddings.' },
  { id: '2', name: 'Chic Casual Blazer', category: 'Casual', price: '$350', stock: 25, imageUrl: 'https://images.unsplash.com/photo-1696238404588-e4448aee3190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjYXN1YWwlMjBibGF6ZXIlMjBtb2RlbHxlbnwwfHx8fDE3NDg3OTg2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'casual blazer model', description: 'Versatile linen blazer for a polished yet relaxed look.' },
  { id: '3', name: 'Festive Sequin Dress', category: 'Festive', price: '$750', stock: 15, imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzZXF1aW4lMjBkcmVzcyUyMHBhcnR5fGVufDB8fHx8MTc0ODc5ODYwM3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'sequin dress party', description: 'Dazzling sequin mini dress, designed to make a statement.' },
  { id: '4', name: 'Bohemian Maxi Skirt', category: 'Casual', price: '$280', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1557431968-2c43c8e896e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxib2hlbWlhbiUyMHNraXJ0JTIwZmFzaGlvbnxlbnwwfHx8fDE3NDg3OTg2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'bohemian skirt fashion', description: 'Flowy cotton maxi skirt with intricate embroidery details.' },
  { id: '5', name: 'Modern Bridal Jumpsuit', category: 'Bridal', price: '$950', stock: 8, imageUrl: 'https://images.unsplash.com/photo-1481535668376-4c3ab7d84e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxicmlkYWwlMjBqdW1wc3VpdCUyMG1vZGVybnxlbnwwfHx8fDE3NDg3OTg2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'bridal jumpsuit modern', description: 'A contemporary take on bridal wear, this jumpsuit features wide legs and a lace bodice.' },
  { id: '6', name: 'Tailored Wool Coat', category: 'Outerwear', price: '$890', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1580047883831-5db03837b0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b29sJTIwY29hdCUyMHN0eWxpc2h8ZW58MHx8fHwxNzQ4Nzk4NjAzfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'wool coat stylish', description: 'Luxurious wool coat with a timeless silhouette for colder seasons.' },
];

let ordersStore: Order[] = [
  {
    id: 'ORD001', customer: 'Sophia Lorenza', email: 'sophia@example.com', date: '2024-07-20', total: '$1250.00', status: 'Shipped', paymentStatus: 'Paid', paymentMethod: 'Credit Card',
    items: [
      { id: '1', name: 'Elegant Evening Gown', quantity: 1, price: '$1200.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'gown fashion' },
      { id: '4', name: 'Bohemian Maxi Skirt', quantity: 1, price: '$50.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'silk scarf' }, // Assuming a scarf was P004, mapping to similar
    ],
    shippingAddress: { fullName: 'Sophia Lorenza', addressLine1: '123 Luxury Lane', city: 'Paris', state: 'Ile-de-France', zipCode: '75001', country: 'France' },
  },
  {
    id: 'ORD002', customer: 'Isabelle Moreau', email: 'isabelle@example.com', date: '2024-07-19', total: '$750.00', status: 'Processing', paymentStatus: 'Pending', paymentMethod: 'PayPal',
    items: [ { id: '3', name: 'Festive Sequin Dress', quantity: 1, price: '$750.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'sequin dress' } ],
    shippingAddress: { fullName: 'Isabelle Moreau', addressLine1: '456 Style Street', city: 'Lyon', state: 'Auvergne-Rhône-Alpes', zipCode: '69002', country: 'France' },
  },
];

let usersStore: User[] = [
  { id: 'USR001', name: 'Sophia Lorenza', email: 'sophia@example.com', role: 'Customer', joined: '2024-01-15', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman portrait', isBlocked: false },
  { id: 'USR002', name: 'Isabelle Moreau', email: 'isabelle@example.com', role: 'Customer', joined: '2024-03-22', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'person avatar', isBlocked: true },
  { id: 'USR003', name: 'Admin User', email: 'admin@designsbyafreen.com', role: 'Admin', joined: '2023-12-01', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'professional person', isBlocked: false },
];

let testimonialsStore: Testimonial[] = [
  { id: '1', quote: 'Designs by Afreen transformed my vision into a breathtaking reality. The craftsmanship is truly exceptional!', author: 'Sophia Lorenza', role: 'Happy Bride', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'elegant woman portrait' },
  { id: '2', quote: 'The attention to detail and personalized service are unparalleled. I felt like a star in my custom gown.', author: 'Isabelle Moreau', role: 'Gala Attendee', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'stylish person' },
  { id: '3', quote: 'Working with Designs by Afreen was a dream. The designs are innovative, chic, and incredibly well-made.', author: 'Olivia Chen', role: 'Fashion Influencer', avatarUrl: 'https://placehold.co/100x100.png', dataAiHint: 'fashion blogger' },
];

const MOCK_API_DELAY = 500; // milliseconds

// --- Product API ---
export async function fetchProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return [...productsStore]; // Return a copy
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return productsStore.find(p => p.id === id);
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const newProduct: Product = { ...productData, id: `prod_${Date.now()}` };
  productsStore = [newProduct, ...productsStore];
  return newProduct;
}

export async function updateProductById(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const productIndex = productsStore.findIndex(p => p.id === id);
  if (productIndex === -1) return undefined;
  productsStore[productIndex] = { ...productsStore[productIndex], ...productData };
  return productsStore[productIndex];
}

export async function deleteProductById(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const initialLength = productsStore.length;
  productsStore = productsStore.filter(p => p.id !== id);
  return productsStore.length < initialLength;
}


// --- Order API ---
export async function fetchOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  // Enrich orders with product image URLs if not present in order item
  const ordersWithImages = ordersStore.map(order => ({
    ...order,
    items: order.items.map(item => {
      const product = productsStore.find(p => p.id === item.id);
      return {
        ...item,
        imageUrl: item.imageUrl || product?.imageUrl || 'https://placehold.co/64x64.png',
        dataAiHint: item.dataAiHint || product?.dataAiHint || 'product image'
      };
    })
  }));
  return [...ordersWithImages];
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const order = ordersStore.find(o => o.id === id);
  if (!order) return undefined;
  // Enrich with images
  return {
    ...order,
    items: order.items.map(item => {
      const product = productsStore.find(p => p.id === item.id);
      return {
        ...item,
        imageUrl: item.imageUrl || product?.imageUrl || 'https://placehold.co/64x64.png',
        dataAiHint: item.dataAiHint || product?.dataAiHint || 'product image'
      };
    })
  };
}

export async function updateOrderShipping(orderId: string, status: Order['status']): Promise<Order | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const orderIndex = ordersStore.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return undefined;
  ordersStore[orderIndex].status = status;
  return ordersStore[orderIndex];
}

// --- User API ---
export async function fetchUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return [...usersStore];
}

// export async function fetchUserById(id: string): Promise<User | undefined> {
//   await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
//   return usersStore.find(u => u.id === id);
// }

export async function addUser(userData: Omit<User, 'id' | 'joined' | 'isBlocked' | 'avatar'> & { password?: string }): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const newUser: User = {
    ...userData,
    id: `usr_${Date.now()}`,
    joined: new Date().toISOString().split('T')[0],
    isBlocked: false,
    avatar: `https://placehold.co/40x40.png`,
    dataAiHint: 'new user',
  };
  usersStore = [newUser, ...usersStore];
  return newUser;
}

export async function updateUserById(id: string, userData: Partial<Pick<User, 'name' | 'email' | 'role'>>): Promise<User | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const userIndex = usersStore.findIndex(u => u.id === id);
  if (userIndex === -1) return undefined;
  usersStore[userIndex] = { ...usersStore[userIndex], ...userData };
  return usersStore[userIndex];
}

export async function blockUserById(id: string): Promise<User | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const userIndex = usersStore.findIndex(u => u.id === id);
  if (userIndex === -1) return undefined;
  usersStore[userIndex].isBlocked = true;
  return usersStore[userIndex];
}

export async function unblockUserById(id: string): Promise<User | undefined> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const userIndex = usersStore.findIndex(u => u.id === id);
  if (userIndex === -1) return undefined;
  usersStore[userIndex].isBlocked = false;
  return usersStore[userIndex];
}

// --- Testimonial API ---
export async function fetchTestimonials(): Promise<Testimonial[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return [...testimonialsStore];
}

// --- Cart Simulation ---
// In a real app, cart would be user-specific and managed server-side or in persistent client storage.
// For now, let's simulate a cart based on a few product IDs.
let cartProductIds: { id: string, quantity: number }[] = [
  { id: '1', quantity: 1 },
  { id: '3', quantity: 2 },
];

export async function fetchCartItems(): Promise<CartItem[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const productDetails = await fetchProducts(); // get all products
  
  const cartItems: CartItem[] = [];
  for (const cartItemInfo of cartProductIds) {
    const product = productDetails.find(p => p.id === cartItemInfo.id);
    if (product) {
      cartItems.push({ ...product, quantity: cartItemInfo.quantity });
    }
  }
  return cartItems;
}

// Basic cart manipulation (not fully implemented for UI updates in this pass, focuses on mock data replacement)
export async function addProductToCart(productId: string, quantity: number = 1): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    const existingItem = cartProductIds.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartProductIds.push({ id: productId, quantity });
    }
}

export async function updateCartItemQuantity(productId: string, quantity: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    const itemIndex = cartProductIds.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (quantity > 0) {
            cartProductIds[itemIndex].quantity = quantity;
        } else {
            cartProductIds.splice(itemIndex, 1); // Remove if quantity is 0 or less
        }
    }
}

export async function removeProductFromCart(productId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    cartProductIds = cartProductIds.filter(item => item.id !== productId);
}
