import { useState, useEffect } from 'react';
import { Ticket, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import { bookingApi } from '@/services/mockApi';
import type { BookingData } from '@/data/busData';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getMyBookings().then(b => { setBookings(b); setLoading(false); });
  }, []);

  const filtered = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => b.pnr.toLowerCase().includes(search.toLowerCase()) || b.fromCity.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => s === 'CONFIRMED' ? 'bg-primary/10 text-primary' : s === 'CANCELLED' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold flex items-center gap-2"><Ticket className="h-6 w-6" /> Bookings Management</h1>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by PNR or city..." className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50 text-left">
                <th className="p-3">PNR</th><th className="p-3">Route</th><th className="p-3">Date</th>
                <th className="p-3">Passengers</th><th className="p-3">Amount</th><th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings found</td></tr>
                ) : filtered.map(b => (
                  <tr key={b.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium">{b.pnr}</td>
                    <td className="p-3">{b.fromCity} → {b.toCity}</td>
                    <td className="p-3">{b.date}</td>
                    <td className="p-3">{b.passengers.length}</td>
                    <td className="p-3 font-semibold">₹{b.totalFare}</td>
                    <td className="p-3"><Badge className={statusColor(b.status)}>{b.status}</Badge></td>
                    <td className="p-3"><Button variant="outline" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
