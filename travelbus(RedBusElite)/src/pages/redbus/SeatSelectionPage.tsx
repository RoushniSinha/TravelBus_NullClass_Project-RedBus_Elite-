import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import SeatMap from '@/components/redbus/SeatMap';
import { busApi } from '@/services/mockApi';
import { mockBuses, type SeatData } from '@/data/busData';

export default function SeatSelectionPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const busId = params.get('busId') || '';
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const date = params.get('date') || '';

  const [seats, setSeats] = useState<SeatData[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [timer, setTimer] = useState(600);
  const [loading, setLoading] = useState(true);

  const bus = mockBuses.find(b => b.id === busId);

  useEffect(() => {
    busApi.getSeats(busId).then(s => { setSeats(s); setLoading(false); });
  }, [busId]);

  useEffect(() => {
    if (selected.length === 0) return;
    const interval = setInterval(() => setTimer(t => t <= 0 ? 0 : t - 1), 1000);
    return () => clearInterval(interval);
  }, [selected.length]);

  const toggleSeat = useCallback((sn: string) => {
    setSelected(prev => prev.includes(sn) ? prev.filter(s => s !== sn) : prev.length >= 6 ? prev : [...prev, sn]);
  }, []);

  const selectedSeats = seats.filter(s => selected.includes(s.seatNumber));
  const baseFare = selectedSeats.reduce((a, s) => a + s.price, 0);
  const taxes = Math.round(baseFare * 0.05);
  const serviceFee = selected.length * 20;
  const total = baseFare + taxes + serviceFee;

  const handleContinue = () => {
    const data = { busId, from, to, date, seats: selected, baseFare, taxes, serviceFee, total, operator: bus?.operator || '' };
    sessionStorage.setItem('rbe_seat_selection', JSON.stringify(data));
    navigate('/booking/passengers');
  };

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Navbar /><p>{t('common.loading')}</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-display font-bold mb-6">{t('seats.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <SeatMap seats={seats} selectedSeats={selected} onToggleSeat={toggleSeat} />
          </div>
          <div className="space-y-4">
            {selected.length > 0 && (
              <div className="bg-accent/50 border border-primary/20 rounded-xl p-3 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>{t('seats.lockTimer')}: <strong>{mm}:{ss}</strong></span>
              </div>
            )}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-display font-semibold mb-3">{t('seats.summary')}</h3>
              {bus && (
                <div className="text-sm text-muted-foreground mb-3">
                  <p>{bus.operator} · {bus.busType}</p>
                  <p>{from} → {to} · {date}</p>
                </div>
              )}
              {selectedSeats.length > 0 && (
                <div className="space-y-1 mb-4">
                  {selectedSeats.map(s => (
                    <div key={s.seatNumber} className="flex justify-between text-sm">
                      <span>Seat {s.seatNumber} ({s.deck})</span>
                      <span>₹{s.price}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span>{t('seats.baseFare')}</span><span>₹{baseFare}</span></div>
                <div className="flex justify-between text-sm"><span>{t('seats.taxes')}</span><span>₹{taxes}</span></div>
                <div className="flex justify-between text-sm"><span>{t('seats.serviceFee')}</span><span>₹{serviceFee}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>{t('seats.total')}</span><span className="text-primary">₹{total}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleContinue} disabled={selected.length === 0}
              className="w-full gradient-hero text-primary-foreground">
              {t('seats.continue')} ({selected.length} seats)
            </Button>
          </div>
        </div>
      </div>
      <RedFooter />
    </div>
  );
}
