import { useState } from 'react';
import { Users, Search, Ban, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/redbus/Navbar';

interface UserEntry {
  id: string; name: string; email: string; role: string; bookings: number;
  joined: string; isActive: boolean;
}

const mockUsers: UserEntry[] = [
  { id: 'U1', name: 'Admin User', email: 'admin@redbusexpress.com', role: 'admin', bookings: 0, joined: '2025-01-01', isActive: true },
  { id: 'U2', name: 'Rahul Sharma', email: 'rahul@email.com', role: 'user', bookings: 5, joined: '2026-01-15', isActive: true },
  { id: 'U3', name: 'Priya Patel', email: 'priya@email.com', role: 'user', bookings: 12, joined: '2025-11-20', isActive: true },
  { id: 'U4', name: 'Arjun Reddy', email: 'arjun@email.com', role: 'user', bookings: 3, joined: '2026-02-10', isActive: true },
  { id: 'U5', name: 'Meera Nair', email: 'meera@email.com', role: 'user', bookings: 8, joined: '2025-09-05', isActive: false },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [banUser, setBanUser] = useState<UserEntry | null>(null);
  const [banReason, setBanReason] = useState('');

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    setBanUser(null); setBanReason('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Users className="h-6 w-6" /> User Management</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-10" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50 text-left">
                <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th>
                <th className="p-3">Bookings</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3"><Badge variant="outline">{u.role}</Badge></td>
                    <td className="p-3">{u.bookings}</td>
                    <td className="p-3">{u.joined}</td>
                    <td className="p-3"><Badge className={u.isActive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}>{u.isActive ? 'Active' : 'Banned'}</Badge></td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => u.isActive ? setBanUser(u) : toggleBan(u.id)}>
                          <Ban className="h-3 w-3 mr-1" /> {u.isActive ? 'Ban' : 'Unban'}
                        </Button>
                        <Button variant="ghost" size="icon"><Bell className="h-3 w-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!banUser} onOpenChange={() => setBanUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ban {banUser?.name}?</DialogTitle></DialogHeader>
          <Textarea value={banReason} onChange={e => setBanReason(e.target.value)} placeholder="Reason for ban..." />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => banUser && toggleBan(banUser.id)}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
