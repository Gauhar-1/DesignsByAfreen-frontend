
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockOrders = [
  { id: 'ORD001', customer: 'Sophia Lorenza', date: '2024-07-20', total: '$1250.00', status: 'Shipped', payment: 'Paid' },
  { id: 'ORD002', customer: 'Isabelle Moreau', date: '2024-07-19', total: '$750.00', status: 'Processing', payment: 'Pending' },
  { id: 'ORD003', customer: 'Olivia Chen', date: '2024-07-18', total: '$350.00', status: 'Delivered', payment: 'Paid' },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Orders</h2>
            <p className="text-muted-foreground">View and process customer orders.</p>
        </div>
        {/* Potentially add a 'Create Manual Order' button if needed */}
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
                    <Badge variant={
                      order.status === 'Shipped' ? 'secondary' : 
                      order.status === 'Delivered' ? 'default' : // Using 'default' for success-like
                      order.status === 'Processing' ? 'outline' : // Using 'outline' for neutral
                      'destructive' // For 'Cancelled' or other issues
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     <Badge variant={order.payment === 'Paid' ? 'default' : 'destructive'}>
                        {order.payment}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-primary">
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
          {/* Add pagination controls here if needed */}
        </CardFooter>
      </Card>
    </div>
  );
}
