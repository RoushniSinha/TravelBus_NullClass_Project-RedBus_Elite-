import { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import { useToast } from '@/hooks/use-toast';

interface NotifHistory { id: string; title: string; audience: string; channels: string[]; sentAt: string; delivered: number; }

const history: NotifHistory[] = [
  { id: 'N1', title: 'Summer Sale - 50% off!', audience: 'All Users', channels: ['Email', 'Push'], sentAt: '2026-03-28', delivered: 8450 },
  { id: 'N2', title: 'New routes added!', audience: 'All Users', channels: ['Email'], sentAt: '2026-03-25', delivered: 12000 },
  { id: 'N3', title: 'Journey Reminder', audience: 'Booking Users', channels: ['SMS', 'Push'], sentAt: '2026-03-29', delivered: 156 },
];

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [audience, setAudience] = useState('all');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(true);

  const handleSend = () => {
    if (!title || !body) { toast({ title: 'Error', description: 'Fill all fields', variant: 'destructive' }); return; }
    const channels = [email && 'Email', sms && 'SMS', push && 'Push'].filter(Boolean).join(', ');
    toast({ title: '✅ Notification Sent', description: `"${title}" via ${channels} to ${audience}` });
    setTitle(''); setBody('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Bell className="h-6 w-6" /> Notification Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Compose Notification</h3>
            <div className="space-y-4">
              <div><Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                    <SelectItem value="active">Active Bookers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title..." /></div>
              <div><Label>Message</Label><Textarea rows={4} value={body} onChange={e => setBody(e.target.value)} placeholder="Notification body..." /></div>
              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><Switch checked={email} onCheckedChange={setEmail} /> Email</label>
                  <label className="flex items-center gap-2 text-sm"><Switch checked={sms} onCheckedChange={setSms} /> SMS</label>
                  <label className="flex items-center gap-2 text-sm"><Switch checked={push} onCheckedChange={setPush} /> Push</label>
                </div>
              </div>
              <Button onClick={handleSend} className="w-full gradient-hero text-primary-foreground">
                <Send className="h-4 w-4 mr-2" /> Send Notification
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Recent Broadcasts</h3>
            <div className="space-y-3">
              {history.map(n => (
                <div key={n.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.audience} · {n.sentAt}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{n.delivered} delivered</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {n.channels.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
