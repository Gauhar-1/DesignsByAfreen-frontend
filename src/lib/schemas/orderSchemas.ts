
import { z } from 'zod';

export const orderShippingUpdateSchema = z.object({
  status: z.enum(['Processing', 'Shipped', 'Delivered', 'Cancelled'], {
    required_error: "Shipping status is required.",
  }),
  // trackingNumber: z.string().optional(), // Example for future use
});

export type OrderShippingUpdateInput = z.infer<typeof orderShippingUpdateSchema>;
