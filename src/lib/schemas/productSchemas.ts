
import { z } from 'zod';

export const adminNewProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  category: z.string().min(2, "Category is required."),
  price: z.string().regex(/^\$?\d+(\.\d{1,2})?$/, "Price must be a valid monetary value (e.g., $19.99 or 19.99)."),
  stock: z.string().min(1, "Stock is required").regex(/^\d+$/, "Stock must be a positive integer"),
  imageUrl: z.string().optional().describe("URL or Data URI of the product image."),
  description: z.string().optional(),
  dataAiHint: z.string().max(50, "AI hint should be concise.").optional(),
});

export type AdminNewProductInput = z.infer<typeof adminNewProductSchema>;
