
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Loader2, Ban, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminNewUserSchema, type AdminNewUserInput, adminEditUserSchema, type AdminEditUserInput } from '@/lib/schemas/authSchemas';
import { useToast } from '@/hooks/use-toast';
import { adminCreateUser, adminUpdateUser, adminBlockUser, adminUnblockUser } from '@/actions/authActions';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
  joined: string;
  avatar: string;
  dataAiHint?: string;
  isBlocked?: boolean;
}

const initialMockUsers: User[] = [
  { id: 'USR001', name: 'Sophia Lorenza', email: 'sophia@example.com', role: 'Customer', joined: '2024-01-15', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman portrait', isBlocked: false },
  { id: 'USR002', name: 'Isabelle Moreau', email: 'isabelle@example.com', role: 'Customer', joined: '2024-03-22', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'person avatar', isBlocked: true },
  { id: 'USR003', name: 'Admin User', email: 'admin@designsbyafreen.com', role: 'Admin', joined: '2023-12-01', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'professional person', isBlocked: false },
  { id: 'USR004', name: 'Charles Xavier', email: 'charles@example.com', role: 'Admin', joined: '2024-02-10', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'man thinking', isBlocked: false },
  { id: 'USR005', name: 'Diana Prince', email: 'diana@example.com', role: 'Customer', joined: '2024-05-01', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman smiling', isBlocked: false },
];

const userRoles: User['role'][] = ['Customer', 'Admin'];
const userStatuses = ['Active', 'Blocked'];


export default function AdminUsersPage() {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialMockUsers);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');


  const addUserForm = useForm<AdminNewUserInput>({
    resolver: zodResolver(adminNewUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Customer',
    },
  });

  const editUserForm = useForm<AdminEditUserInput>({
    resolver: zodResolver(adminEditUserSchema),
  });
  
  useEffect(() => {
    if (selectedUserForEdit && isEditUserDialogOpen) {
      editUserForm.reset({
        name: selectedUserForEdit.name,
        email: selectedUserForEdit.email,
        role: selectedUserForEdit.role,
      });
    }
  }, [selectedUserForEdit, isEditUserDialogOpen, editUserForm]);

  async function onAddUserSubmit(data: AdminNewUserInput) {
    try {
      const result = await adminCreateUser(data);
      if (result.success) {
        toast({
          title: 'User Created',
          description: result.message,
        });
        const newUser: User = { 
          ...data, 
          id: `USR${Math.floor(Math.random()*900)+100}`, 
          joined: new Date().toISOString().split('T')[0], 
          avatar: `https://placehold.co/40x40.png`,
          dataAiHint: 'new user',
          isBlocked: false,
        };
        setUsers(prev => [newUser, ...prev]);
        addUserForm.reset();
        setIsAddUserDialogOpen(false);
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

  async function onEditUserSubmit(data: AdminEditUserInput) {
    if (!selectedUserForEdit) return;
    try {
      const result = await adminUpdateUser(selectedUserForEdit.id, data);
      if (result.success) {
        toast({
          title: 'User Updated',
          description: result.message,
        });
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === selectedUserForEdit.id ? { ...u, ...data } : u
          )
        );
        editUserForm.reset();
        setIsEditUserDialogOpen(false);
        setSelectedUserForEdit(null);
      } else {
        toast({ title: 'Error', description: result.message || 'Failed to update user.', variant: 'destructive' });
      }
    } catch (error) {
       toast({ title: 'Error', description: (error as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  }
  
  const handleToggleBlockUser = async (userId: string, currentBlockedStatus: boolean | undefined) => {
    const action = currentBlockedStatus ? adminUnblockUser : adminBlockUser;
    const actionName = currentBlockedStatus ? 'Unblocked' : 'Blocked';
    try {
      const result = await action(userId);
      if (result.success) {
        toast({
          title: `User ${actionName}`,
          description: result.message,
        });
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? { ...u, isBlocked: !currentBlockedStatus } : u
          )
        );
      } else {
        toast({ title: 'Error', description: result.message || `Failed to ${actionName.toLowerCase()} user.`, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUserForEdit(user);
    setIsEditUserDialogOpen(true);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = term === '' || user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = 
        statusFilter === 'All' ||
        (statusFilter === 'Active' && !user.isBlocked) ||
        (statusFilter === 'Blocked' && user.isBlocked);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Users</h2>
            <p className="text-muted-foreground">View, add new, or block/unblock user accounts.</p>
        </div>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
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
            <Form {...addUserForm}>
              <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-4 py-4">
                <FormField control={addUserForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addUserForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addUserForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addUserForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{userRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline" onClick={() => addUserForm.reset()}>Cancel</Button></DialogClose>
                  <Button type="submit" disabled={addUserForm.formState.isSubmitting}>
                    {addUserForm.formState.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : ('Create User')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={(isOpen) => { setIsEditUserDialogOpen(isOpen); if (!isOpen) setSelectedUserForEdit(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update details for {selectedUserForEdit?.name}.
            </DialogDescription>
          </DialogHeader>
          <Form {...editUserForm}>
            <form onSubmit={editUserForm.handleSubmit(onEditUserSubmit)} className="space-y-4 py-4">
              <FormField control={editUserForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={editUserForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={editUserForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{userRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="outline" onClick={() => { editUserForm.reset(); setSelectedUserForEdit(null); }}>Cancel</Button></DialogClose>
                <Button type="submit" disabled={editUserForm.formState.isSubmitting}>
                  {editUserForm.formState.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>


      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>A list of all registered users.</CardDescription>
           <div className="pt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search users by name or email..." 
                className="pl-8 w-full sm:w-2/3 lg:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-[150px]">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        {userRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        {userStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 hidden md:table-cell">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.isBlocked ? 'opacity-60 bg-muted/30' : ''}>
                  <TableCell className="hidden md:table-cell">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint || 'user avatar'} />
                      <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                     <Badge variant={user.role === 'Admin' ? 'secondary' : 'outline'}>{user.role}</Badge>
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    {user.isBlocked ? (
                      <Badge variant="destructive">Blocked</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    {/* Placeholder for Edit Button - to be re-added if functionality is desired */}
                    {/* <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => openEditDialog(user)} title="Edit User">
                         <Pencil className="h-4 w-4" />
                         <span className="sr-only">Edit User</span>
                    </Button> */}
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleBlockUser(user.id, user.isBlocked)}
                        title={user.isBlocked ? "Unblock User" : "Block User"}
                        className={user.isBlocked ? "hover:text-green-600" : "hover:text-destructive"}
                      >
                        {user.isBlocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        <span className="sr-only">{user.isBlocked ? "Unblock User" : "Block User"}</span>
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No users match your current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            {filteredUsers.length > 0
              ? <>Showing <strong>{Math.min(1, filteredUsers.length)}-{filteredUsers.length}</strong> of {users.length} total users</>
              : <>No users matching filters. (<strong>{users.length}</strong> total users)</>
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
