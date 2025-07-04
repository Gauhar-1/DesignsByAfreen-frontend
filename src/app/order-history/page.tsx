
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Loader2, Package, Eye, ClipboardList, MapPin, CalendarDays, CreditCard } from 'lucide-react';
import { fetchOrders, type Order as ApiOrderType } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getUserIdFromToken } from '@/lib/auth';
import axios from 'axios';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<ApiOrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrderType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadOrders() {
      try {
        const userId = getUserIdFromToken();
        if(!userId) {
            return console.log('No user ID found in token.'); // Handle case where user ID is not available
        }
        setIsLoading(true);
        setError(null);
        const fetchedOrders = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/order-history`, {
          params: { userId },
        });
        setOrders(fetchedOrders.data);
      } catch (err) {
        setError('Failed to fetch your order history.');
        toast({ title: 'Error', description: 'Could not fetch order history.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [toast]);

  const openDialog = (order: ApiOrderType) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: ApiOrderType['status']) => {
    switch (status) {
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'default';
      case 'Processing': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
    const getPaymentStatusBadgeVariant = (status: ApiOrderType['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'outline';
      case 'Refunded': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12 md:py-16 text-center">
        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Loading Order History...</h1>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12 md:py-16 text-center">
        <ClipboardList className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Error Loading Orders</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Your Order History</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here you can track your past and current orders with Designs by Afreen.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center">
          <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <p className="text-xl text-muted-foreground mb-4">You have not placed any orders yet.</p>
          <Link href="/portfolio" passHref>
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>A list of all your orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>{order.createdAt}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openDialog(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/30">
                    <div>
                      <h3 className="font-semibold">{order._id}</h3>
                      <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                    </div>
                     <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                     <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground">Total</span>
                        <span>{order.total}</span>
                      </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => openDialog(order)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details: {selectedOrder?._id}</DialogTitle>
            <DialogDescription>
              Viewing full details for your order placed on {selectedOrder?.createdAt}.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><CalendarDays size={18} /> Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Date:</strong> {selectedOrder.createdAt}</p>
                    <div className="flex items-center text-sm"><strong className="mr-1">Status:</strong> <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></div>
                    <p><strong>Total:</strong> <span className="font-semibold">{selectedOrder.total}</span></p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><CreditCard size={18} /> Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                    <div className="flex items-center text-sm"><strong className="mr-1">Status:</strong> <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge></div>
                  </CardContent>
                </Card>
              </div>
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
                      <Image src={item.imageUrl || 'https://placehold.co/64x64.png'} alt={item.name} width={64} height={64} className="rounded object-cover aspect-square" data-ai-hint={item.dataAiHint} />
                      <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
