
'use server';

import type { OrderShippingUpdateInput } from '@/lib/schemas/orderSchemas';
import { updateOrderShipping as apiUpdateOrderShipping } from '@/lib/api';

export async function adminUpdateShipping(orderId: string, data: OrderShippingUpdateInput) {
  console.log('Server Action: Admin attempting to update shipping for order:', orderId, 'to status:', data.status);
  try {
    const updatedOrder = await apiUpdateOrderShipping(orderId, data.status);
    if (updatedOrder) {
      return { success: true, message: `Shipping status for order ${orderId} updated to "${data.status}".`, order: updatedOrder };
    }
    return { success: false, message: 'Order not found or failed to update shipping status.' };
  } catch (error) {
    console.error('Error in adminUpdateShipping:', error);
    return { success: false, message: 'Failed to update shipping status. An unexpected error occurred.' };
  }
}
