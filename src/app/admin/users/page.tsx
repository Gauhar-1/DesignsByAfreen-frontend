
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit3, ShieldCheck, ShieldOff } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockUsers = [
  { id: 'USR001', name: 'Sophia Lorenza', email: 'sophia@example.com', role: 'Customer', joined: '2024-01-15', avatar: 'https://placehold.co/40x40.png?text=SL', dataAiHint: 'woman portrait' },
  { id: 'USR002', name: 'Isabelle Moreau', email: 'isabelle@example.com', role: 'Customer', joined: '2024-03-22', avatar: 'https://placehold.co/40x40.png?text=IM', dataAiHint: 'person avatar' },
  { id: 'USR003', name: 'Admin User', email: 'admin@designsbyafreen.com', role: 'Admin', joined: '2023-12-01', avatar: 'https://placehold.co/40x40.png?text=AU', dataAiHint: 'professional person' },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Users</h2>
            <p className="text-muted-foreground">View, edit roles, or manage user accounts.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-5 w-5" /> Add New User
        </Button>
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
              {mockUsers.map((user) => (
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
            Showing <strong>1-{mockUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
          </div>
          {/* Add pagination controls here if needed */}
        </CardFooter>
      </Card>
    </div>
  );
}
