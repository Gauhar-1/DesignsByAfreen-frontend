
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck, Package, CalendarDays, User, MapPin, CreditCard, Loader2, ShoppingBag , ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type OrderShippingUpdateInput, orderShippingUpdateSchema } from '@/lib/schemas/orderSchemas';
import { useToast } from '@/hooks/use-toast';
import {  type Order as ApiOrderType } from '@/lib/api';
import { apiUrl, formatDate } from '@/lib/utils';
import axios from 'axios';

const orderStatusOptions: ApiOrderType['status'][] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatusOptions: ApiOrderType['paymentStatus'][] = ['Paid', 'Pending', 'Refunded', 'Failed'];


export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<ApiOrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrderType | null>(null);
  const [isUpdateShippingDialogOpen, setIsUpdateShippingDialogOpen] = useState(false);
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<ApiOrderType | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedOrderForVerification, setSelectedOrderForVerification] = useState<ApiOrderType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedOrders = await axios.get(`${apiUrl}/order`);
        setAllOrders(fetchedOrders.data);
      } catch (err) {
        setError('Failed to fetch orders.');
        toast({ title: 'Error', description: 'Could not fetch orders.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [toast]);

  const shippingForm = useForm<OrderShippingUpdateInput>({
    resolver: zodResolver(orderShippingUpdateSchema),
    defaultValues: {
      status: 'Processing',
    },
  });

  const displayedOrders = useMemo(() => {
    return allOrders
      .filter(order => {
        const term = searchTerm.toLowerCase();
        if (term === '') return true;
        return (
          order._id.toLowerCase().includes(term) ||
          order.customer.toLowerCase().includes(term) ||
          order.phone.toLowerCase().includes(term)
        );
      })
      .filter(order => statusFilter === 'All' || order.status === statusFilter)
      .filter(order => paymentFilter === 'All' || order.paymentStatus === paymentFilter);
  }, [allOrders, searchTerm, statusFilter, paymentFilter]);


  const openViewDialog = (order: ApiOrderType) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const openUpdateShippingDialog = (order: ApiOrderType) => {
    setSelectedOrderForShipping(order);
    shippingForm.reset({ status: order.status });
    setIsUpdateShippingDialogOpen(true);
  };
  
  const openVerifyDialog = (order: ApiOrderType) => {
    setSelectedOrderForVerification(order);
    setIsVerifyDialogOpen(true);
  };

  const onShippingUpdateSubmit = async (status: OrderShippingUpdateInput) => {
    if (!selectedOrderForShipping) return;
    try {
      const result = await axios.put(`${apiUrl}/order/shipping-status`,  status , { params : { orderId: selectedOrderForShipping._id } });
      if (result.data.success && result.data.order) {
        toast({
          title: 'Shipping Updated',
          description: result.data.message,
        });
        setAllOrders(prevOrders =>
          prevOrders.map(o =>
            o._id === selectedOrderForShipping._id ? result.data.order! : o
          )
        );
        setIsUpdateShippingDialogOpen(false);
        setSelectedOrderForShipping(null);
      } else {
        toast({ title: 'Error', description: result.data.message || 'Failed to update shipping.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

    const handlePaymentVerification = async (isApproved: boolean) => {
    if (!selectedOrderForVerification) return;
    setIsVerifying(true);
    try {
      const result = await axios.put(`${apiUrl}/order/payment-status`, { isApproved : isApproved }, { params: { orderId: selectedOrderForVerification._id } });
      if (result.data.success && result.data.order) {
        toast({
          title: 'Payment Verified',
          description: result.data.message,
        });
        setAllOrders(prevOrders =>
          prevOrders.map(o =>
            o._id === selectedOrderForVerification._id ? result.data.order! : o
          )
        );
        setIsVerifyDialogOpen(false);
        setSelectedOrderForVerification(null);
      } else {
        toast({ title: 'Error', description: result.data.message || 'Failed to verify payment.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
        setIsVerifying(false);
    }
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
           <div className="pt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by ID, customer, or email..." 
                className="pl-8 w-full sm:w-2/3 lg:w-1/3" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-[150px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    {orderStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="All">All Payment Statuses</SelectItem>
                    {paymentStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading orders...</p></div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : displayedOrders.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phone No.</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.phone}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell> <Badge variant={getStatusBadgeVariant(order.status)}> {order.status} </Badge> </TableCell>
                        <TableCell> <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}> {order.paymentStatus} </Badge> </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => openViewDialog(order)} title="View Order">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Order</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-blue-600" onClick={() => openUpdateShippingDialog(order)} title="Update Shipping">
                              <Truck className="h-4 w-4" />
                              <span className="sr-only">Update Shipping</span>
                            </Button>
                            {order.paymentMethod === 'upi' && order.paymentStatus === 'Pending' && (
                              <Button variant="outline" size="sm" className="hover:text-primary" onClick={() => openVerifyDialog(order)} title="Verify Payment">
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {displayedOrders.map((order) => (
                  <Card key={order._id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between p-4 bg-muted/30">
                          <div>
                              <h3 className="font-semibold">{order.phone}</h3>
                              <p className="text-sm text-muted-foreground">{order.customer}</p>
                          </div>
                          <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="hover:text-primary h-8 w-8" onClick={() => openViewDialog(order)} title="View Order">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View Order</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="hover:text-blue-600 h-8 w-8" onClick={() => openUpdateShippingDialog(order)} title="Update Shipping">
                                  <Truck className="h-4 w-4" />
                                  <span className="sr-only">Update Shipping</span>
                              </Button>
                          </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Date</span>
                              <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Total</span>
                              <span className="font-medium">{order.total}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Order Status</span>
                              <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                          </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Payment Status</span>
                              <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                          </div>
                      </CardContent>
                      {order.paymentMethod === 'upi' && order.paymentStatus === 'Pending' && (
                          <CardFooter className="p-4 pt-0">
                              <Button variant="outline" size="sm" className="w-full" onClick={() => openVerifyDialog(order)} title="Verify Payment">
                                  <ShieldCheck className="h-4 w-4 mr-1" />
                                  Verify Payment
                              </Button>
                          </CardFooter>
                      )}
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              No orders match your current filters.
            </div>
          )}
        </CardContent>
        {!isLoading && !error && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              {displayedOrders.length > 0 ? <>Showing <strong>{Math.min(1, displayedOrders.length)}-{displayedOrders.length}</strong> of {allOrders.length} total orders</> : <>No orders matching filters. (<strong>{allOrders.length}</strong> total orders)</>}
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details: {selectedOrder?._id}</DialogTitle>
            <DialogDescription> Viewing full details for order placed by {selectedOrder?.customer}. </DialogDescription>
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
                    <p><strong>Phone Number:</strong> {selectedOrder.phone}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><CalendarDays size={18} /> Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
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
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

       <Dialog open={isUpdateShippingDialogOpen} onOpenChange={(isOpen) => { setIsUpdateShippingDialogOpen(isOpen); if (!isOpen) { shippingForm.reset(); setSelectedOrderForShipping(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Shipping Status</DialogTitle>
            <DialogDescription> Update the shipping status for order {selectedOrderForShipping?._id}. </DialogDescription>
          </DialogHeader>
           <Form {...shippingForm}>
            <form onSubmit={shippingForm.handleSubmit(onShippingUpdateSubmit)} className="space-y-4 py-4">
              <FormField
                control={shippingForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatusOptions.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsUpdateShippingDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={shippingForm.formState.isSubmitting}>
                  {shippingForm.formState.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')}
                </Button>
              </DialogFooter>
            </form>
             </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isVerifyDialogOpen} onOpenChange={(isOpen) => { if(!isOpen) setSelectedOrderForVerification(null); setIsVerifyDialogOpen(isOpen); }}>
        <DialogContent className="sm:max-w-2xl mt-12 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Verify UPI Payment</DialogTitle>
            <DialogDescription>
              Verify payment for Order ID: {selectedOrderForVerification?._id} from {selectedOrderForVerification?.customer}.
            </DialogDescription>
          </DialogHeader>
          {selectedOrderForVerification && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className = "space-y-4">
                <h3 className="font-semibold text-lg ">Details</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>UTR/Ref No:</strong></p>
                  <p className="font-mono bg-muted p-2 rounded-md break-all">{selectedOrderForVerification.upiReferenceNumber || 'Not Provided'}</p>
                  <p><strong>Amount:</strong> {selectedOrderForVerification.total}</p>
                </div>
              </div>
              <div className='space-y-4'>
                <h3 className="font-semibold text-lg ">Payment Screenshot</h3>
                {selectedOrderForVerification.paymentScreenshotUri ? (
                  <a href={selectedOrderForVerification.paymentScreenshotUri} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={selectedOrderForVerification.paymentScreenshotUri}
                      alt="Payment Screenshot"
                      width={400}
                      height={600}
                      className="rounded-md border object-contain w-full h-auto max-h-96"
                      data-ai-hint="payment screenshot"
                    />
                  </a>
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted rounded-md p-4">
                    <p className="text-muted-foreground">No screenshot uploaded.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="pt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handlePaymentVerification(false)} disabled={isVerifying}>
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Payment
            </Button>
            <Button onClick={() => handlePaymentVerification(true)} disabled={isVerifying}>
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function adminVerifyPayment(id: string, isApproved: boolean) {
  throw new Error('Function not implemented.');
}

