
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit2, Trash2, Loader2, UploadCloud } from 'lucide-react';
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
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminNewProductSchema, type AdminNewProductInput } from '@/lib/schemas/productSchemas';
import { useToast } from '@/hooks/use-toast';
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '@/actions/productActions';

interface Product extends AdminNewProductInput {
  id: string;
}

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addForm = useForm<AdminNewProductInput>({
    resolver: zodResolver(adminNewProductSchema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      stock: 0,
      imageUrl: undefined,
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
        imageUrl: selectedProduct.imageUrl || undefined,
        description: selectedProduct.description || '',
        dataAiHint: selectedProduct.dataAiHint || '',
      });
      setImagePreview(selectedProduct.imageUrl || null);
    }
  }, [selectedProduct, isEditDialogOpen, editForm]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    formInstance: UseFormReturn<AdminNewProductInput>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: 'File too large', description: 'Please upload an image smaller than 2MB.', variant: 'destructive' });
        formInstance.setValue('imageUrl', selectedProduct?.imageUrl || undefined);
        setImagePreview(selectedProduct?.imageUrl || null);
        if (event.target) event.target.value = ''; // Clear the file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        formInstance.setValue('imageUrl', dataUri);
        setImagePreview(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      // If file selection is cancelled or cleared
      const originalImageUrl = formInstance === editForm ? selectedProduct?.imageUrl : undefined;
      formInstance.setValue('imageUrl', originalImageUrl);
      setImagePreview(originalImageUrl || null);
    }
  };

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
        setImagePreview(null);
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
        setImagePreview(null);
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
    setImagePreview(product.imageUrl || null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const ProductFormFields = ({
    formInstance,
    currentImagePreview,
    onImageChangeHandler
  }: {
    formInstance: UseFormReturn<AdminNewProductInput>;
    currentImagePreview: string | null;
    onImageChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
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
        render={({ field }) => ( // `field` is used by RHF for state, but onChange is custom
          <FormItem>
            <FormLabel className="flex items-center">
              <UploadCloud className="h-4 w-4 mr-2 text-muted-foreground" />
              Product Image (max 2MB)
            </FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={onImageChangeHandler}
                className="text-base py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {currentImagePreview && (
        <div className="mt-2">
          <FormLabel>Image Preview</FormLabel>
          <div className="relative w-32 h-32 mt-1 border rounded-md overflow-hidden">
            <Image src={currentImagePreview} alt="Product preview" fill style={{ objectFit: 'cover' }} sizes="128px" />
          </div>
        </div>
      )}
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
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) { addForm.reset(); setImagePreview(null); } }}>
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
                <ProductFormFields 
                  formInstance={addForm} 
                  currentImagePreview={imagePreview} 
                  onImageChangeHandler={(e) => handleImageChange(e, addForm)}
                />
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { addForm.reset(); setImagePreview(null); }}>Cancel</Button>
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

      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) { editForm.reset(); setSelectedProduct(null); setImagePreview(null); } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for &quot;{selectedProduct?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <ProductFormFields 
                formInstance={editForm} 
                currentImagePreview={imagePreview} 
                onImageChangeHandler={(e) => handleImageChange(e, editForm)}
              />
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => { editForm.reset(); setSelectedProduct(null); setImagePreview(null); }}>Cancel</Button>
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
                    {product.imageUrl ? (
                       <Image src={product.imageUrl} alt={product.name} width={48} height={48} className="rounded object-cover aspect-square" data-ai-hint={product.dataAiHint || 'product image'} />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                    )}
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
        </CardFooter>
      </Card>
    </div>
  );
}
