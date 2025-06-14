
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck, Package, CalendarDays, User, MapPin, DollarSign, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  imageUrl: string;
  dataAiHint?: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  status: 'Shipped' | 'Processing' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  paymentMethod: 'Credit Card' | 'PayPal' | 'COD' | 'UPI';
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
}

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customer: 'Sophia Lorenza',
    email: 'sophia@example.com',
    date: '2024-07-20',
    total: '$1250.00',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    items: [
      { id: 'P001', name: 'Elegant Evening Gown', quantity: 1, price: '$1200.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'gown fashion' },
      { id: 'P004', name: 'Silk Scarf', quantity: 1, price: '$50.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'silk scarf' },
    ],
    shippingAddress: {
      fullName: 'Sophia Lorenza',
      addressLine1: '123 Luxury Lane',
      city: 'Paris',
      state: 'Ile-de-France',
      zipCode: '75001',
      country: 'France',
    },
  },
  {
    id: 'ORD002',
    customer: 'Isabelle Moreau',
    email: 'isabelle@example.com',
    date: '2024-07-19',
    total: '$750.00',
    status: 'Processing',
    paymentStatus: 'Pending',
    paymentMethod: 'PayPal',
    items: [
      { id: 'P003', name: 'Festive Sequin Dress', quantity: 1, price: '$750.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'sequin dress' },
    ],
    shippingAddress: {
      fullName: 'Isabelle Moreau',
      addressLine1: '456 Style Street',
      city: 'Lyon',
      state: 'Auvergne-Rhône-Alpes',
      zipCode: '69002',
      country: 'France',
    },
  },
  {
    id: 'ORD003',
    customer: 'Olivia Chen',
    email: 'olivia@example.com',
    date: '2024-07-18',
    total: '$350.00',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'COD',
    items: [
      { id: 'P002', name: 'Chic Casual Blazer', quantity: 1, price: '$350.00', imageUrl: 'https://placehold.co/64x64.png', dataAiHint: 'blazer model' },
    ],
    shippingAddress: {
      fullName: 'Olivia Chen',
      addressLine1: '789 Fashion Ave',
      city: 'Marseille',
      state: 'Provence-Alpes-Côte d\'Azur',
      zipCode: '13008',
      country: 'France',
    },
  },
];

export default function AdminOrdersPage() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openViewDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'default'; // Using 'default' for success-like
      case 'Processing': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'outline';
      case 'Refunded': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Orders</h2>
            <p className="text-muted-foreground">View and process customer orders.</p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>A list of all customer orders.</CardDescription>
           <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search orders by ID or customer..." className="pl-8 w-full sm:w-1/3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.date}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => openViewDialog(order)}>
                      <Eye className="h-4 w-4" />
                       <span className="sr-only">View Order</span>
                    </Button>
                     <Button variant="ghost" size="icon" className="hover:text-blue-600">
                      <Truck className="h-4 w-4" />
                       <span className="sr-only">Update Shipping</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{mockOrders.length}</strong> of <strong>{mockOrders.length}</strong> orders
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Viewing full details for order placed by {selectedOrder?.customer}.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><User size={18} /> Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.customer}</p>
                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><CalendarDays size={18} /> Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Date:</strong> {selectedOrder.date}</p>
                    <div className="flex items-center text-sm"><strong className="mr-1">Status:</strong> <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></div>
                    <p><strong>Total:</strong> <span className="font-semibold">{selectedOrder.total}</span></p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><CreditCard size={18} /> Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                  <div className="flex items-center text-sm"><strong className="mr-1">Status:</strong> <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge></div>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><MapPin size={18} /> Shipping Address</CardTitle>
                  </CardHeader>
                <CardContent className="text-sm">
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Package size={18} /> Items Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-md bg-muted/30">
                      <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded object-cover aspect-square" data-ai-hint={item.dataAiHint}/>
                      <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            <Separator className="my-4"/>
             <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                {/* Potential actions like "Mark as Shipped", "Print Invoice", etc. */}
             </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

