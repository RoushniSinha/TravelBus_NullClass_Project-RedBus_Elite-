import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, ArrowRightLeft, Calendar, Search, Shield, CreditCard, Clock, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { popularRoutes, govBuses } from '@/data/busData';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSearch = () => {
    if (from && to) navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            {t('hero.tagline')}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mt-8 bg-card rounded-2xl p-4 md:p-6 shadow-elevated">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 w-full relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input placeholder={t('hero.from')} value={from} onChange={e => setFrom(e.target.value)} className="pl-10" />
              </div>
              <Button variant="ghost" size="icon" onClick={swap} className="shrink-0 rounded-full border border-border">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 w-full relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                <Input placeholder={t('hero.to')} value={to} onChange={e => setTo(e.target.value)} className="pl-10" />
              </div>
              <div className="flex-1 w-full relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="pl-10" />
              </div>
              <Button onClick={handleSearch} className="gradient-hero text-primary-foreground px-8 w-full md:w-auto">
                <Search className="h-4 w-4 mr-2" /> {t('hero.searchBtn')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold mb-6">{t('common.popularRoutes')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {popularRoutes.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="min-w-[200px] bg-card border border-border rounded-xl p-4 hover:shadow-card transition-shadow cursor-pointer"
              onClick={() => { setFrom(r.from); setTo(r.to); }}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>{r.from}</span><ChevronRight className="h-3 w-3 text-muted-foreground" /><span>{r.to}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>From ₹{r.price}</span><span>{r.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gov Buses */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-display font-bold mb-6">{t('common.govBuses')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {govBuses.map((g, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-card transition-shadow">
              <span className="text-3xl">{g.logo}</span>
              <h3 className="font-semibold mt-2">{g.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-sm">{g.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold mb-6 text-center">{t('common.whyChoose')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: t('common.safeTravel'), desc: t('common.safeTravelDesc') },
            { icon: CreditCard, title: t('common.bestPrice'), desc: t('common.bestPriceDesc') },
            { icon: Clock, title: t('common.easyBooking'), desc: t('common.easyBookingDesc') },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card transition-shadow">
              <div className="gradient-hero w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <RedFooter />
    </div>
  );
}
