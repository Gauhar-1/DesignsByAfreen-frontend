
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit3, ShieldCheck, ShieldOff, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminNewUserSchema, type AdminNewUserInput } from '@/lib/schemas/authSchemas';
import { useToast } from '@/hooks/use-toast';
import { adminCreateUser } from '@/actions/authActions';

// Mock data - replace with actual data fetching
const mockUsers = [
  { id: 'USR001', name: 'Sophia Lorenza', email: 'sophia@example.com', role: 'Customer', joined: '2024-01-15', avatar: 'https://placehold.co/40x40.png?text=SL', dataAiHint: 'woman portrait' },
  { id: 'USR002', name: 'Isabelle Moreau', email: 'isabelle@example.com', role: 'Customer', joined: '2024-03-22', avatar: 'https://placehold.co/40x40.png?text=IM', dataAiHint: 'person avatar' },
  { id: 'USR003', name: 'Admin User', email: 'admin@designsbyafreen.com', role: 'Admin', joined: '2023-12-01', avatar: 'https://placehold.co/40x40.png?text=AU', dataAiHint: 'professional person' },
];

export default function AdminUsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers); // For optimistic updates if needed
  const { toast } = useToast();

  const form = useForm<AdminNewUserInput>({
    resolver: zodResolver(adminNewUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Customer',
    },
  });

  async function onSubmit(data: AdminNewUserInput) {
    try {
      const result = await adminCreateUser(data);
      if (result.success) {
        toast({
          title: 'User Created',
          description: result.message,
        });
        // Optimistically add user to list or refetch
        // For mock, just log:
        console.log('New user added (mock):', { ...data, id: `USR${Math.floor(Math.random()*900)+100}`, joined: new Date().toISOString().split('T')[0] });
        // setUsers(prev => [...prev, { ...data, id: `USR${Math.floor(Math.random()*900)+100}`, joined: new Date().toISOString().split('T')[0], avatar: `https://placehold.co/40x40.png?text=${data.name.substring(0,2).toUpperCase()}` }]);
        form.reset();
        setIsDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to create user.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Users</h2>
            <p className="text-muted-foreground">View, edit roles, or manage user accounts.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-5 w-5" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                     <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>A list of all registered users.</CardDescription>
           <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users by name or email..." className="pl-8 w-full sm:w-1/3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 hidden md:table-cell">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden md:table-cell">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint} />
                      <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                     <Badge variant={user.role === 'Admin' ? 'secondary' : 'outline'}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-primary">
                      <Edit3 className="h-4 w-4" />
                       <span className="sr-only">Edit User</span>
                    </Button>
                    {user.role === 'Admin' ? (
                        <Button variant="ghost" size="icon" className="hover:text-orange-500" title="Revoke Admin">
                            <ShieldOff className="h-4 w-4" />
                            <span className="sr-only">Revoke Admin</span>
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon" className="hover:text-green-600" title="Make Admin">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="sr-only">Make Admin</span>
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{users.length}</strong> of <strong>{users.length}</strong> users
          </div>
          {/* Add pagination controls here if needed */}
        </CardFooter>
      </Card>
    </div>
  );
}
