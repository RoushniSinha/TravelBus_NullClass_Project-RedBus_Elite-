import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Smartphone, Building, Wallet, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { bookingApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

export default function PaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [timer, setTimer] = useState(599);

  useEffect(() => {
    const raw = sessionStorage.getItem('rbe_payment_data');
    if (!raw) { navigate('/'); return; }
    setPaymentData(JSON.parse(raw));
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t <= 0 ? 0 : t - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePay = async () => {
    if (!paymentData) return;
    setProcessing(true);
    try {
      const booking = await bookingApi.create({
        busId: paymentData.busId,
        operator: paymentData.operator,
        fromCity: paymentData.from,
        toCity: paymentData.to,
        date: paymentData.date,
        departureTime: '',
        passengers: paymentData.passengers.map((p: any) => ({ name: p.name, age: parseInt(p.age), gender: p.gender, seatNumber: p.seatNumber })),
        totalFare: paymentData.finalTotal,
        baseFare: paymentData.baseFare,
        taxes: paymentData.taxes,
        serviceFee: paymentData.serviceFee,
        discount: paymentData.discount || 0,
        couponCode: paymentData.couponCode,
        contactPhone: paymentData.phone,
        contactEmail: paymentData.email,
      });
      sessionStorage.setItem('rbe_confirmation', JSON.stringify(booking));
      sessionStorage.removeItem('rbe_seat_selection');
      sessionStorage.removeItem('rbe_payment_data');
      navigate('/booking/confirm');
    } catch {
      toast({ title: 'Payment Failed', description: 'Please try again', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentData) return null;
  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">{t('payment.title')}</h1>
          <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-full text-sm">
            <Clock className="h-4 w-4 text-primary" />{t('payment.payIn')} {mm}:{ss}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="upi" className="bg-card border border-border rounded-xl p-4">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="upi"><Smartphone className="h-4 w-4 mr-1" /> {t('payment.upi')}</TabsTrigger>
                <TabsTrigger value="cards"><CreditCard className="h-4 w-4 mr-1" /> {t('payment.cards')}</TabsTrigger>
                <TabsTrigger value="netbanking"><Building className="h-4 w-4 mr-1" /> Net</TabsTrigger>
                <TabsTrigger value="wallets"><Wallet className="h-4 w-4 mr-1" /> Wallet</TabsTrigger>
              </TabsList>
              <TabsContent value="upi" className="mt-4 space-y-4">
                <div><Label>{t('payment.upiId')}</Label><Input placeholder="yourname@upi" /></div>
                <div className="flex gap-2">
                  {['GPay', 'PhonePe', 'Paytm'].map(w => (
                    <Button key={w} variant="outline" size="sm">{w}</Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="cards" className="mt-4 space-y-4">
                <div><Label>{t('payment.cardNumber')}</Label><Input placeholder="1234 5678 9012 3456" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t('payment.expiry')}</Label><Input placeholder="MM/YY" /></div>
                  <div><Label>{t('payment.cvv')}</Label><Input placeholder="123" type="password" /></div>
                </div>
                <div><Label>{t('payment.nameOnCard')}</Label><Input placeholder="John Doe" /></div>
              </TabsContent>
              <TabsContent value="netbanking" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">{t('payment.selectBank')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(b => (
                    <Button key={b} variant="outline" className="justify-start">{b} Bank</Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="wallets" className="mt-4 space-y-2">
                {['Paytm Wallet', 'Mobikwik', 'Amazon Pay'].map(w => (
                  <Button key={w} variant="outline" className="w-full justify-start">{w}</Button>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-display font-semibold mb-3">Order Summary</h3>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">{paymentData.from} → {paymentData.to}</p>
              <p className="text-muted-foreground">{paymentData.date}</p>
              <p className="text-muted-foreground">{paymentData.passengers?.length} passenger(s)</p>
              <div className="border-t border-border mt-3 pt-3 space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{paymentData.baseFare + paymentData.taxes + paymentData.serviceFee}</span></div>
                {paymentData.discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-₹{paymentData.discount}</span></div>}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>{t('seats.total')}</span><span className="text-primary">₹{paymentData.finalTotal}</span>
                </div>
              </div>
            </div>
            <Button onClick={handlePay} disabled={processing || timer === 0}
              className="w-full mt-4 gradient-hero text-primary-foreground">
              {processing ? t('payment.processing') : `${t('payment.pay')} ₹${paymentData.finalTotal}`}
            </Button>
          </div>
        </div>
      </div>
      <RedFooter />
    </div>
  );
}
