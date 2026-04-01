import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/redbus/Navbar';
import type { BookingData } from '@/data/busData';

export default function BookingConfirmPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('rbe_confirmation');
    if (raw) setBooking(JSON.parse(raw));
  }, []);

  if (!booking) return <div className="min-h-screen bg-background flex items-center justify-center"><Navbar /><p>No booking data</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-lg text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <CheckCircle className="h-20 w-20 text-primary mx-auto mb-4" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold mb-2">
          {t('confirm.title')}
        </motion.h1>

        <div className="bg-card border border-border rounded-xl p-6 mt-6 text-left space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('confirm.pnr')}</p>
            <p className="text-2xl font-display font-bold text-primary">{booking.pnr}</p>
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Route</span><span>{booking.fromCity} → {booking.toCity}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{booking.date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Operator</span><span>{booking.operator}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Passengers</span><span>{booking.passengers.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span>{booking.passengers.map(p => p.seatNumber).join(', ')}</span></div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
              <span>Total Paid</span><span className="text-primary">₹{booking.totalFare}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" /> {t('confirm.download')}</Button>
          <Button variant="outline" className="w-full"><Share2 className="h-4 w-4 mr-2" /> {t('confirm.share')}</Button>
          <Button onClick={() => navigate('/my-bookings')} className="w-full gradient-hero text-primary-foreground">
            {t('confirm.viewBookings')} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>{t('confirm.backHome')}</Button>
        </div>
      </div>
    </div>
  );
}
