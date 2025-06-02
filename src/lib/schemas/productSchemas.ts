
import { z } from 'zod';

export const adminNewProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  category: z.string().min(2, "Category is required."),
  price: z.string().regex(/^\$?\d+(\.\d{1,2})?$/, "Price must be a valid monetary value (e.g., $19.99 or 19.99)."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  imageUrl: z.string().url("Invalid image URL."),
  description: z.string().optional(),
  dataAiHint: z.string().max(50, "AI hint should be concise.").optional(),
});

export type AdminNewProductInput = z.infer<typeof adminNewProductSchema>;
