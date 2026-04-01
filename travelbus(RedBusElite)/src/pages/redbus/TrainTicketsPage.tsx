import { useTranslation } from 'react-i18next';
import { Search, MapPin, Calendar, Train } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';

const trainClasses = [
  { name: '1A - First AC', desc: 'Private cabins with 2/4 berths' },
  { name: '2A - Second AC', desc: 'Curtained berths with AC' },
  { name: '3A - Third AC', desc: 'Open berths with AC' },
  { name: 'SL - Sleeper', desc: 'Open berths without AC' },
  { name: 'CC - Chair Car', desc: 'Comfortable seating with AC' },
];
const popularTrainRoutes = [
  'Delhi → Mumbai', 'Chennai → Bangalore', 'Kolkata → Delhi',
  'Mumbai → Pune', 'Hyderabad → Chennai', 'Delhi → Jaipur',
];

export default function TrainTicketsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-primary/90 to-primary pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Train className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-3xl font-display font-bold text-primary-foreground">Book Train Tickets</h1>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-elevated space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" /><Input placeholder="From Station" className="pl-10" /></div>
              <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" /><Input placeholder="To Station" className="pl-10" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="date" className="pl-10" /></div>
              <Select><SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger><SelectContent>{trainClasses.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select>
              <Select><SelectTrigger><SelectValue placeholder="Quota" /></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="tatkal">Tatkal</SelectItem><SelectItem value="ladies">Ladies</SelectItem></SelectContent></Select>
            </div>
            <Button className="w-full gradient-hero text-primary-foreground"><Search className="h-4 w-4 mr-2" /> Search Trains</Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-display font-bold mb-4">Train Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {trainClasses.map(c => (
            <div key={c.name} className="bg-card border border-border rounded-xl p-4 text-center">
              <h3 className="font-semibold text-sm">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-display font-bold mb-4">Popular Train Routes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularTrainRoutes.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3 text-sm text-center hover:shadow-card transition-shadow cursor-pointer">{r}</div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-display font-bold mb-4">PNR Status</h2>
        <div className="bg-card border border-border rounded-xl p-4 max-w-md mx-auto flex gap-2">
          <Input placeholder="Enter 10-digit PNR Number" />
          <Button className="gradient-hero text-primary-foreground">Check</Button>
        </div>
      </section>
      <RedFooter />
    </div>
  );
}
