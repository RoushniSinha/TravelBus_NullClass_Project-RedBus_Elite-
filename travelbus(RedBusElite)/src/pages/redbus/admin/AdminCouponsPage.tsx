import { useState } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/redbus/Navbar';
import { mockCoupons, type CouponData } from '@/data/busData';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<(CouponData & { usedCount: number })[]>(
    mockCoupons.map(c => ({ ...c, usedCount: Math.floor(Math.random() * 50) }))
  );
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT', value: 0, maxDiscount: 0, minPurchase: 0 });

  const handleSave = () => {
    if (editIdx !== null) {
      setCoupons(prev => prev.map((c, i) => i === editIdx ? { ...c, ...form } : c));
    } else {
      setCoupons(prev => [...prev, { ...form, isActive: true, usedCount: 0 }]);
    }
    setShowForm(false); setEditIdx(null);
    setForm({ code: '', type: 'PERCENTAGE', value: 0, maxDiscount: 0, minPurchase: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold flex items-center gap-2"><Tag className="h-6 w-6" /> Coupon Management</h1>
          <Button className="gradient-hero text-primary-foreground" onClick={() => { setEditIdx(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Create Coupon
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50 text-left">
                <th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th>
                <th className="p-3">Max Disc.</th><th className="p-3">Min Purchase</th><th className="p-3">Usage</th>
                <th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr></thead>
              <tbody>
                {coupons.map((c, i) => (
                  <tr key={c.code} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-mono font-semibold">{c.code}</td>
                    <td className="p-3"><Badge variant="outline">{c.type === 'PERCENTAGE' ? '%' : '₹'}</Badge></td>
                    <td className="p-3">{c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}</td>
                    <td className="p-3">₹{c.maxDiscount}</td>
                    <td className="p-3">₹{c.minPurchase}</td>
                    <td className="p-3">{c.usedCount}</td>
                    <td className="p-3">
                      <Switch checked={c.isActive} onCheckedChange={() =>
                        setCoupons(prev => prev.map((x, j) => j === i ? { ...x, isActive: !x.isActive } : x))} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditIdx(i); setForm(c); setShowForm(true); }}><Edit className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setCoupons(prev => prev.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3 text-destructive" /></Button>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editIdx !== null ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Code</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
            <div><Label>Type</Label>
              <Select value={form.type} onValueChange={(v: 'PERCENTAGE' | 'FLAT') => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="PERCENTAGE">Percentage</SelectItem><SelectItem value="FLAT">Flat</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Value</Label><Input type="number" value={form.value} onChange={e => setForm({ ...form, value: +e.target.value })} /></div>
            <div><Label>Max Discount (₹)</Label><Input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: +e.target.value })} /></div>
            <div><Label>Min Purchase (₹)</Label><Input type="number" value={form.minPurchase} onChange={e => setForm({ ...form, minPurchase: +e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="gradient-hero text-primary-foreground" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
