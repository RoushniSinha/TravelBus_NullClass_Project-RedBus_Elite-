import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Search, MapPin, ArrowRightLeft, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';

const topRoutes = [
  { from: 'Delhi', to: 'Agra' }, { from: 'Mumbai', to: 'Pune' }, { from: 'Bangalore', to: 'Chennai' },
  { from: 'Hyderabad', to: 'Vijayawada' }, { from: 'Delhi', to: 'Jaipur' }, { from: 'Chennai', to: 'Coimbatore' },
  { from: 'Kolkata', to: 'Patna' }, { from: 'Ahmedabad', to: 'Mumbai' },
];
const busTypes = ['AC Sleeper', 'Volvo', 'AC Seater', 'Non-AC', 'Semi-Sleeper', 'Multi-Axle'];

export default function BusTicketsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="gradient-hero pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-display font-bold text-primary-foreground text-center mb-6">Book Bus Tickets Online</h1>
          <div className="bg-card rounded-2xl p-4 shadow-elevated flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" /><Input placeholder={t('hero.from')} value={from} onChange={e => setFrom(e.target.value)} className="pl-10" /></div>
            <Button variant="ghost" size="icon" onClick={() => { setFrom(to); setTo(from); }} className="shrink-0 rounded-full border border-border"><ArrowRightLeft className="h-4 w-4" /></Button>
            <div className="flex-1 w-full relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" /><Input placeholder={t('hero.to')} value={to} onChange={e => setTo(e.target.value)} className="pl-10" /></div>
            <div className="flex-1 w-full relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="pl-10" /></div>
            <Button onClick={() => from && to && navigate(`/search?from=${from}&to=${to}&date=${date}`)} className="gradient-hero text-primary-foreground px-8 w-full md:w-auto"><Search className="h-4 w-4 mr-2" /> Search</Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-display font-bold mb-4">How to Book</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['1. Search Route', '2. Choose Bus', '3. Select Seats', '4. Pay & Go!'].map((step, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="gradient-hero w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">{i + 1}</div>
              <p className="text-sm font-medium">{step.substring(3)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-display font-bold mb-4">Bus Types</h2>
        <div className="flex flex-wrap gap-2">
          {busTypes.map(bt => <span key={bt} className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm">{bt}</span>)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-display font-bold mb-4">Top Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topRoutes.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:shadow-card transition-shadow"
              onClick={() => navigate(`/search?from=${r.from}&to=${r.to}&date=${date}`)}>
              <span className="text-sm">{r.from} <ChevronRight className="h-3 w-3 inline" /> {r.to}</span>
              <span className="text-xs text-muted-foreground">View buses →</span>
            </div>
          ))}
        </div>
      </section>
      <RedFooter />
    </div>
  );
}
