
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminNewProductSchema, type AdminNewProductInput } from '@/lib/schemas/productSchemas';
import { useToast } from '@/hooks/use-toast';
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '@/actions/productActions';

interface Product extends AdminNewProductInput {
  id: string;
}

// Mock data - replace with actual data fetching
const initialMockProducts: Product[] = [
  { id: '1', name: 'Elegant Evening Gown', category: 'Bridal', price: '$1200', stock: 10, imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'gown fashion', description: 'A stunning silk charmeuse evening gown.' },
  { id: '2', name: 'Chic Casual Blazer', category: 'Casual', price: '$350', stock: 25, imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'blazer model', description: 'Versatile linen blazer.' },
  { id: '3', name: 'Festive Sequin Dress', category: 'Festive', price: '$750', stock: 15, imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'sequin dress', description: 'Dazzling sequin mini dress.' },
];

export default function AdminProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(initialMockProducts);
  const { toast } = useToast();

  const addForm = useForm<AdminNewProductInput>({
    resolver: zodResolver(adminNewProductSchema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      stock: 0,
      imageUrl: '',
      description: '',
      dataAiHint: '',
    },
  });

  const editForm = useForm<AdminNewProductInput>({
    resolver: zodResolver(adminNewProductSchema),
  });

  useEffect(() => {
    if (selectedProduct && isEditDialogOpen) {
      editForm.reset({
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        imageUrl: selectedProduct.imageUrl,
        description: selectedProduct.description || '',
        dataAiHint: selectedProduct.dataAiHint || '',
      });
    }
  }, [selectedProduct, isEditDialogOpen, editForm]);

  async function onAddSubmit(data: AdminNewProductInput) {
    try {
      const result = await adminCreateProduct(data);
      if (result.success) {
        toast({
          title: 'Product Created',
          description: result.message,
        });
        const newProduct: Product = { ...data, id: `PROD${Math.floor(Math.random() * 900) + 100}`};
        setProducts(prev => [newProduct, ...prev]);
        addForm.reset();
        setIsAddDialogOpen(false);
      } else {
        toast({ title: 'Error', description: result.message || 'Failed to create product.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  }

  async function onEditSubmit(data: AdminNewProductInput) {
    if (!selectedProduct) return;
    try {
      const result = await adminUpdateProduct(selectedProduct.id, data);
      if (result.success) {
        toast({
          title: 'Product Updated',
          description: result.message,
        });
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...selectedProduct, ...data } : p));
        editForm.reset();
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
      } else {
        toast({ title: 'Error', description: result.message || 'Failed to update product.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  }

  async function onDeleteConfirm() {
    if (!selectedProduct) return;
    try {
      const result = await adminDeleteProduct(selectedProduct.id);
      if (result.success) {
        toast({
          title: 'Product Deleted',
          description: result.message,
        });
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      } else {
        toast({ title: 'Error', description: result.message || 'Failed to delete product.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const ProductFormFields = ({ formInstance }: { formInstance: typeof addForm | typeof editForm }) => (
    <>
      <FormField
        control={formInstance.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Silk Scarf" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formInstance.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Accessories" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formInstance.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input placeholder="e.g., $99.99 or 99.99" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formInstance.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock Quantity</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 50" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formInstance.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com/image.png" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formInstance.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the product..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formInstance.control}
        name="dataAiHint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>AI Image Hint (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., silk scarf floral" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Products</h2>
          <p className="text-muted-foreground">View, add, edit, or delete products from your inventory.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new product to your store.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
                <ProductFormFields formInstance={addForm} />
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => addForm.reset()}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={addForm.formState.isSubmitting}>
                    {addForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for &quot;{selectedProduct?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <ProductFormFields formInstance={editForm} />
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => { editForm.reset(); setSelectedProduct(null); }}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                  {editForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              &quot;{selectedProduct?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProduct(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {editForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>A list of all products in your store.</CardDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="pl-8 w-full sm:w-1/3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 hidden md:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden md:table-cell">
                    <Image src={product.imageUrl} alt={product.name} width={48} height={48} className="rounded" data-ai-hint={product.dataAiHint || 'product image'} />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="hidden sm:table-cell">{product.price}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => openEditDialog(product)}>
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => openDeleteDialog(product)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
          </div>
          {/* Add pagination controls here if needed */}
        </CardFooter>
      </Card>
    </div>
  );
}

    