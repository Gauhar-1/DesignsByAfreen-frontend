
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

// Mock data - replace with actual data fetching
const mockProducts = [
  { id: '1', name: 'Elegant Evening Gown', category: 'Bridal', price: '$1200', stock: 10, imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'gown fashion' },
  { id: '2', name: 'Chic Casual Blazer', category: 'Casual', price: '$350', stock: 25, imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'blazer model' },
  { id: '3', name: 'Festive Sequin Dress', category: 'Festive', price: '$750', stock: 15, imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'sequin dress' },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Products</h2>
            <p className="text-muted-foreground">View, add, edit, or delete products from your inventory.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>

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
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden md:table-cell">
                    <Image src={product.imageUrl} alt={product.name} width={48} height={48} className="rounded" data-ai-hint={product.dataAiHint} />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="hidden sm:table-cell">{product.price}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
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
            Showing <strong>1-{mockProducts.length}</strong> of <strong>{mockProducts.length}</strong> products
          </div>
          {/* Add pagination controls here if needed */}
        </CardFooter>
      </Card>
    </div>
  );
}
