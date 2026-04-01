import { useState } from 'react';
import { Bus, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import { mockBuses, type BusData } from '@/data/busData';
import EliteScoreDisplay from '@/components/redbus/EliteScoreDisplay';

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<BusData[]>(mockBuses);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editBus, setEditBus] = useState<BusData | null>(null);

  const filtered = buses.filter(b =>
    b.operator.toLowerCase().includes(search.toLowerCase()) ||
    b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.fromCity.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setBuses(prev => prev.map(b => b.id === id ? { ...b, isActive: false } : b));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold flex items-center gap-2"><Bus className="h-6 w-6" /> Fleet Management</h1>
          <Button className="gradient-hero text-primary-foreground" onClick={() => { setEditBus(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Bus
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search buses..." className="pl-10" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50 text-left">
                <th className="p-3">Bus #</th><th className="p-3">Operator</th><th className="p-3">Type</th>
                <th className="p-3">Route</th><th className="p-3">Price</th><th className="p-3">Seats</th>
                <th className="p-3">Rating</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium">{b.busNumber}</td>
                    <td className="p-3">{b.operator}</td>
                    <td className="p-3"><Badge variant="outline">{b.busType}</Badge></td>
                    <td className="p-3">{b.fromCity} → {b.toCity}</td>
                    <td className="p-3">₹{b.price}</td>
                    <td className="p-3">{b.availableSeats}/{b.totalSeats}</td>
                    <td className="p-3"><EliteScoreDisplay score={b.rating} size="sm" /></td>
                    <td className="p-3"><Badge className={b.isActive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}>{b.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditBus(b); setShowForm(true); }}><Edit className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editBus ? 'Edit Bus' : 'Add New Bus'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Operator</Label><Input defaultValue={editBus?.operator} /></div>
            <div><Label>Bus Number</Label><Input defaultValue={editBus?.busNumber} /></div>
            <div><Label>Bus Type</Label>
              <Select defaultValue={editBus?.busType || 'AC Sleeper'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Volvo Multi-Axle', 'AC Semi-Sleeper'].map(t =>
                    <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Price</Label><Input type="number" defaultValue={editBus?.price} /></div>
            <div><Label>From City</Label><Input defaultValue={editBus?.fromCity} /></div>
            <div><Label>To City</Label><Input defaultValue={editBus?.toCity} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="gradient-hero text-primary-foreground" onClick={() => setShowForm(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
