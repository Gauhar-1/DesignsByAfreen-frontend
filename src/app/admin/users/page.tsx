
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Loader2, Ban, CheckCircle2, UsersIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminNewUserSchema, type AdminNewUserInput, adminEditUserSchema, type AdminEditUserInput } from '@/lib/schemas/authSchemas';
import { useToast } from '@/hooks/use-toast';
import { fetchUsers, type User as ApiUserType } from '@/lib/api';
import axios from 'axios';
import { apiUrl } from '@/lib/utils';

const userRoles: ApiUserType['role'][] = ['Customer', 'Admin'];
const userStatuses = ['Active', 'Blocked'];


export default function AdminUsersPage() {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false); // Kept for potential re-activation
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<ApiUserType | null>(null); // Kept for potential re-activation
  const [users, setUsers] = useState<ApiUserType[]>([]);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedUsers = await axios.get(`${apiUrl}/auth/users`);
        if(!fetchedUsers.data){
           toast({ title: 'Error', description: 'Could not fetch users.', variant: 'destructive' });
           return;
        }
        setUsers(fetchedUsers.data);
      } catch (err) {
        setError('Failed to fetch users.');
        toast({ title: 'Error', description: 'Could not fetch users.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, [toast, refresh]);

  const addUserForm = useForm<AdminNewUserInput>({
    resolver: zodResolver(adminNewUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'Customer' },
  });

  const editUserForm = useForm<AdminEditUserInput>({ // Kept for potential re-activation
    resolver: zodResolver(adminEditUserSchema),
  });
  
  useEffect(() => { // Kept for potential re-activation
    if (selectedUserForEdit && isEditUserDialogOpen) {
      editUserForm.reset({
        name: selectedUserForEdit.name, email: selectedUserForEdit.email, role: selectedUserForEdit.role,
      });
    }
  }, [selectedUserForEdit, isEditUserDialogOpen, editUserForm]);

  async function onAddUserSubmit(data: AdminNewUserInput) {
    // try {
    //   const result = await adminCreateUser(data);
    //   if (result.success && result.user) {
    //     toast({ title: 'User Created', description: result.message });
    //     setUsers(prev => [result.user!, ...prev]);
    //     addUserForm.reset();
    //     setIsAddUserDialogOpen(false);
    //   } else {
    //     toast({ title: 'Error', description: result.message || 'Failed to create user.', variant: 'destructive' });
    //   }
    // } catch (err) {
    //   toast({ title: 'Error', description: (err as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    // }
  }

  // Edit user submit logic (kept for potential re-activation)
  async function onEditUserSubmit(data: AdminEditUserInput) {
    if (!selectedUserForEdit) return;
    // try {
    //   const result = await adminUpdateUser(selectedUserForEdit.id, data);
    //   if (result.success && result.user) {
    //     toast({ title: 'User Updated', description: result.message });
    //     setUsers(prevUsers => prevUsers.map(u => u.id === selectedUserForEdit.id ? result.user! : u));
    //     editUserForm.reset();
    //     setIsEditUserDialogOpen(false);
    //     setSelectedUserForEdit(null);
    //   } else {
    //     toast({ title: 'Error', description: result.message || 'Failed to update user.', variant: 'destructive' });
    //   }
    // } catch (err) {
    //    toast({ title: 'Error', description: (err as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    // }
  }
  
  const handleToggleBlockUser = async (userId: string, currentBlockedStatus: boolean | undefined) => {
    
    const actionName = !currentBlockedStatus ;
    try {
      const result = await axios.post(`${apiUrl}/auth/updateBlock`, {
        userId,
        actionName
      });
      if (result.data.success && result.data.user) {
        toast({ title: `User ${actionName}`, description: result.data.message });
        setRefresh(prev => !prev);
      } else {
        toast({ title: 'Error', description: result.data.message , variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message || 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  // Kept for potential re-activation
  // const openEditDialog = (user: ApiUserType) => {
  //   setSelectedUserForEdit(user);
  //   setIsEditUserDialogOpen(true);
  // };

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
        <div> <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Users</h2> <p className="text-muted-foreground">View, add new, or block/unblock user accounts.</p> </div>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          {/* <DialogTrigger asChild> 
            <div>
          <Button className="w-full sm:w-auto"> <UserPlus className="mr-2 h-5 w-5" /> Add New User </Button>
          </div> </DialogTrigger> */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader> <DialogTitle>Add New User</DialogTitle> <DialogDescription> Fill in the details below to create a new user account. </DialogDescription> </DialogHeader>
            <Form {...addUserForm}>
              <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-4 py-4">
                <FormField control={addUserForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addUserForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addUserForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={addUserForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{userRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline" onClick={() => addUserForm.reset()}>Cancel</Button></DialogClose>
                  <Button type="submit" disabled={addUserForm.formState.isSubmitting}> {addUserForm.formState.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : ('Create User')} </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit User Dialog (Kept for potential re-activation) */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={(isOpen) => { setIsEditUserDialogOpen(isOpen); if (!isOpen) setSelectedUserForEdit(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader> <DialogTitle>Edit User</DialogTitle> <DialogDescription> Update details for {selectedUserForEdit?.name}. </DialogDescription> </DialogHeader>
          <Form {...editUserForm}>
            <form onSubmit={editUserForm.handleSubmit(onEditUserSubmit)} className="space-y-4 py-4">
              <FormField control={editUserForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={editUserForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={editUserForm.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent>{userRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="outline" onClick={() => { editUserForm.reset(); setSelectedUserForEdit(null); }}>Cancel</Button></DialogClose>
                <Button type="submit" disabled={editUserForm.formState.isSubmitting}> {editUserForm.formState.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')} </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>User List</CardTitle> <CardDescription>A list of all registered users.</CardDescription>
           <div className="pt-4 space-y-4">
            <div className="relative"> <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> <Input type="search" placeholder="Search users by name or email..." className="pl-8 w-full sm:w-2/3 lg:w-1/3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/> </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-[150px]"> <Select value={roleFilter} onValueChange={setRoleFilter}> <SelectTrigger> <SelectValue placeholder="Filter by Role" /> </SelectTrigger> <SelectContent> <SelectItem value="All">All Roles</SelectItem> {userRoles.map(role => ( <SelectItem key={role} value={role}>{role}</SelectItem> ))} </SelectContent> </Select> </div>
                <div className="flex-1 min-w-[150px]"> <Select value={statusFilter} onValueChange={setStatusFilter}> <SelectTrigger> <SelectValue placeholder="Filter by Status" /> </SelectTrigger> <SelectContent> <SelectItem value="All">All Statuses</SelectItem> {userStatuses.map(status => ( <SelectItem key={status} value={status}>{status}</SelectItem> ))} </SelectContent> </Select> </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading users...</p></div>}
          {error && <div className="text-center py-8 text-destructive">{error}</div>}
          {!isLoading && !error && (
            <Table>
              <TableHeader><TableRow><TableHead className="w-12 hidden md:table-cell">Avatar</TableHead><TableHead>Name</TableHead><TableHead className="hidden sm:table-cell">Phone</TableHead><TableHead className="hidden sm:table-cell">Role</TableHead><TableHead className="hidden md:table-cell">Status</TableHead><TableHead className="hidden md:table-cell">Joined Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className={user.isBlocked ? 'opacity-60 bg-muted/30' : ''}>
                    <TableCell className="hidden md:table-cell"> <Avatar className="h-8 w-8"> <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.dataAiHint || 'user avatar'} /> <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback> </Avatar> </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{user.phone}</TableCell>
                    <TableCell className="hidden sm:table-cell"> <Badge variant={user.role === 'Admin' ? 'secondary' : 'outline'}>{user.role}</Badge> </TableCell>
                    <TableCell className="hidden md:table-cell"> {user.isBlocked ? ( <Badge variant="destructive">Blocked</Badge> ) : ( <Badge variant="default">Active</Badge> )} </TableCell>
                    <TableCell className="hidden md:table-cell">{user.timestamps}</TableCell>
                    <TableCell className="text-right">
                      {/* <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => openEditDialog(user)} title="Edit User"> <Pencil className="h-4 w-4" /> <span className="sr-only">Edit User</span> </Button> */}
                      <Button variant="ghost" size="icon" onClick={() => handleToggleBlockUser(user._id as string ?? '', user.isBlocked)} title={user.isBlocked ? "Unblock User" : "Block User"} className={user.isBlocked ? "hover:text-green-600" : "hover:text-destructive"}> {user.isBlocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />} <span className="sr-only">{user.isBlocked ? "Unblock User" : "Block User"}</span> </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && ( <TableRow> <TableCell colSpan={7} className="text-center text-muted-foreground py-8"> 
                  <UsersIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground"/>
                  No users match your current filters.
                </TableCell> </TableRow> )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!isLoading && !error && (
          <CardFooter> <div className="text-xs text-muted-foreground"> {filteredUsers.length > 0 ? <>Showing <strong>{Math.min(1, filteredUsers.length)}-{filteredUsers.length}</strong> of {users.length} total users</> : <>No users matching filters. (<strong>{users.length}</strong> total users)</> } </div> </CardFooter>
        )}
      </Card>
    </div>
  );
}
