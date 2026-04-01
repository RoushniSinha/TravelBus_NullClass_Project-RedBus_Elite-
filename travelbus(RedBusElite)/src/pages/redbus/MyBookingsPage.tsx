import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { bookingApi } from '@/services/mockApi';
import type { BookingData } from '@/data/busData';
import { useToast } from '@/hooks/use-toast';

export default function MyBookingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    bookingApi.getMyBookings().then(b => { setBookings(b); setLoading(false); });
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    await bookingApi.cancel(cancelId);
    setBookings(prev => prev.map(b => b.id === cancelId ? { ...b, status: 'CANCELLED' } : b));
    setCancelId(null);
    toast({ title: 'Booking Cancelled', description: t('bookings.refundInfo') });
  };

  const statusColor = (s: string) => s === 'CONFIRMED' ? 'bg-primary/10 text-primary' : s === 'CANCELLED' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-3xl">
        <h1 className="text-2xl font-display font-bold mb-6">{t('bookings.title')}</h1>
        <Tabs defaultValue="all">
          <TabsList><TabsTrigger value="all">{t('bookings.all')}</TabsTrigger><TabsTrigger value="upcoming">{t('bookings.upcoming')}</TabsTrigger><TabsTrigger value="cancelled">{t('bookings.cancelled')}</TabsTrigger></TabsList>
          {['all', 'upcoming', 'cancelled'].map(tab => (
            <TabsContent key={tab} value={tab}>
              {loading ? <p className="text-center py-10">{t('common.loading')}</p> : (
                <div className="space-y-4 mt-4">
                  {bookings.filter(b => tab === 'all' || (tab === 'upcoming' && b.status === 'CONFIRMED') || (tab === 'cancelled' && b.status === 'CANCELLED')).length === 0 ? (
                    <p className="text-center py-10 text-muted-foreground">{t('bookings.empty')}</p>
                  ) : bookings.filter(b => tab === 'all' || (tab === 'upcoming' && b.status === 'CONFIRMED') || (tab === 'cancelled' && b.status === 'CANCELLED')).map(b => (
                    <div key={b.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">PNR: <strong>{b.pnr}</strong></p>
                          <Badge className={statusColor(b.status)}>{b.status}</Badge>
                        </div>
                        <p className="text-lg font-display font-bold text-primary">₹{b.totalFare}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{b.fromCity} → {b.toCity}</p>
                        <p className="text-muted-foreground">{b.date} · {b.passengers.length} passenger(s) · Seats: {b.passengers.map(p => p.seatNumber).join(', ')}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" /> {t('bookings.download')}</Button>
                        {b.status === 'CONFIRMED' && (
                          <Button variant="outline" size="sm" onClick={() => setCancelId(b.id)}>
                            <X className="h-3 w-3 mr-1" /> {t('bookings.cancel')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('bookings.cancelConfirm')}</DialogTitle>
            <DialogDescription>{t('bookings.refundInfo')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>{t('common.back')}</Button>
            <Button variant="destructive" onClick={handleCancel}>{t('bookings.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RedFooter />
    </div>
  );
}
