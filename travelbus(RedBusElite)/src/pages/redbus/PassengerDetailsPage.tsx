import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { couponApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface SeatSelection {
  busId: string; from: string; to: string; date: string; seats: string[];
  baseFare: number; taxes: number; serviceFee: number; total: number; operator: string;
}

export default function PassengerDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<SeatSelection | null>(null);
  const [passengers, setPassengers] = useState<{ name: string; age: string; gender: string; seatNumber: string }[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('rbe_seat_selection');
    if (!raw) { navigate('/'); return; }
    const d: SeatSelection = JSON.parse(raw);
    setData(d);
    setPassengers(d.seats.map(s => ({ name: '', age: '', gender: 'MALE', seatNumber: s })));
  }, [navigate]);

  const applyCoupon = async () => {
    if (!data || !coupon) return;
    const res = await couponApi.validate(coupon, data.total);
    if (res.valid) {
      setDiscount(res.discount);
      setCouponApplied(coupon.toUpperCase());
      toast({ title: '🎉 Coupon Applied!', description: res.message });
    } else {
      toast({ title: 'Invalid Coupon', description: res.message, variant: 'destructive' });
    }
  };

  const updatePassenger = (idx: number, field: string, value: string) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleProceed = () => {
    if (passengers.some(p => !p.name || !p.age) || !phone || !email) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    const paymentData = { ...data, passengers, phone, email, discount, couponCode: couponApplied, finalTotal: (data?.total || 0) - discount };
    sessionStorage.setItem('rbe_payment_data', JSON.stringify(paymentData));
    navigate('/booking/payment');
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-3xl">
        <h1 className="text-2xl font-display font-bold mb-6">{t('passenger.title')}</h1>
        <div className="space-y-4">
          {passengers.map((p, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3">Seat {p.seatNumber}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>{t('passenger.name')}</Label>
                  <Input value={p.name} onChange={e => updatePassenger(i, 'name', e.target.value)} />
                </div>
                <div>
                  <Label>{t('passenger.age')}</Label>
                  <Input type="number" value={p.age} onChange={e => updatePassenger(i, 'age', e.target.value)} />
                </div>
                <div>
                  <Label>{t('passenger.gender')}</Label>
                  <RadioGroup value={p.gender} onValueChange={v => updatePassenger(i, 'gender', v)} className="flex gap-3 mt-2">
                    <div className="flex items-center gap-1"><RadioGroupItem value="MALE" id={`m${i}`} /><Label htmlFor={`m${i}`} className="text-sm">{t('passenger.male')}</Label></div>
                    <div className="flex items-center gap-1"><RadioGroupItem value="FEMALE" id={`f${i}`} /><Label htmlFor={`f${i}`} className="text-sm">{t('passenger.female')}</Label></div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-3">{t('passenger.contact')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>{t('passenger.phone')}</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div><Label>{t('passenger.email')}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-3">{t('passenger.coupon')}</h3>
            <div className="flex gap-2">
              <Input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="SAVE10, FLAT100, FIRST50" />
              <Button onClick={applyCoupon} variant="outline">{t('passenger.apply')}</Button>
            </div>
            {couponApplied && <Badge className="mt-2 bg-primary/10 text-primary">{couponApplied} - ₹{discount} off</Badge>}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-3">{t('seats.fare')}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>{t('seats.baseFare')}</span><span>₹{data.baseFare}</span></div>
              <div className="flex justify-between"><span>{t('seats.taxes')}</span><span>₹{data.taxes}</span></div>
              <div className="flex justify-between"><span>{t('seats.serviceFee')}</span><span>₹{data.serviceFee}</span></div>
              {discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-₹{discount}</span></div>}
              <div className="flex justify-between font-semibold pt-2 border-t border-border text-lg">
                <span>{t('seats.total')}</span><span className="text-primary">₹{data.total - discount}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleProceed} className="w-full gradient-hero text-primary-foreground text-lg py-6">
            {t('passenger.proceed')} · ₹{data.total - discount}
          </Button>
        </div>
      </div>
      <RedFooter />
    </div>
  );
}
