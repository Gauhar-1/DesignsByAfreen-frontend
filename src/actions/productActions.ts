
'use server';

import type { AdminNewProductInput } from '@/lib/schemas/productSchemas';
import { addProduct, updateProductById, deleteProductById } from '@/lib/api';

export async function adminCreateProduct(data: AdminNewProductInput) {
  console.log('Server Action: Admin attempting to create product:', {
    ...data,
    imageUrl: data.imageUrl ? `Data URI starting with ${data.imageUrl.substring(0,30)}...` : 'No image'
  });
  
  try {
    const newProduct = await addProduct(data);
    return { success: true, message: `Product "${newProduct.name}" created successfully.`, product: newProduct };
  } catch (error) {
    console.error('Error in adminCreateProduct:', error);
    return { success: false, message: 'Failed to create product. An unexpected error occurred.' };
  }
}

export async function adminUpdateProduct(productId: string, data: Partial<AdminNewProductInput>) {
   console.log('Server Action: Admin attempting to update product:', productId, {
    ...data,
    imageUrl: data.imageUrl ? `Data URI starting with ${data.imageUrl.substring(0,30)}...` : (data.imageUrl === undefined ? 'Image not changed' : 'Image removed/cleared')
  });
  try {
    const updatedProduct = await updateProductById(productId, data);
    if (updatedProduct) {
      return { success: true, message: `Product "${updatedProduct.name || 'Item'}" updated successfully.`, product: updatedProduct };
    }
    return { success: false, message: 'Product not found or failed to update.' };
  } catch (error) {
    console.error('Error in adminUpdateProduct:', error);
    return { success: false, message: 'Failed to update product. An unexpected error occurred.' };
  }
}

export async function adminDeleteProduct(productId: string) {
  console.log('Server Action: Admin attempting to delete product:', productId);
  try {
    const success = await deleteProductById(productId);
    if (success) {
      return { success: true, message: `Product ID "${productId}" deleted successfully.` };
    }
    return { success: false, message: 'Product not found or failed to delete.' };
  } catch (error) {
    console.error('Error in adminDeleteProduct:', error);
    return { success: false, message: 'Failed to delete product. An unexpected error occurred.' };
  }
}
