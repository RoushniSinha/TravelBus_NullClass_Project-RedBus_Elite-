import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import BusCard from '@/components/redbus/BusCard';
import { busApi } from '@/services/mockApi';
import type { BusData } from '@/data/busData';

export default function SearchResultsPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const date = params.get('date') || '';
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('bestRated');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [showFilters, setShowFilters] = useState(false);
  const [busTypeFilter, setBusTypeFilter] = useState<string[]>([]);

  useEffect(() => {
    busApi.search(from, to, date).then(r => { setBuses(r); setLoading(false); });
  }, [from, to, date]);

  const filtered = buses
    .filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])
    .filter(b => busTypeFilter.length === 0 || busTypeFilter.includes(b.busType))
    .sort((a, b) => {
      if (sort === 'lowestPrice') return a.price - b.price;
      if (sort === 'departure') return a.departureTime.localeCompare(b.departureTime);
      return b.rating - a.rating;
    });

  const busTypes = [...new Set(buses.map(b => b.busType))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">{from} → {to}</h1>
            <p className="text-sm text-muted-foreground">{date} · {filtered.length} buses found</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-1" /> {t('search.filters')}
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bestRated">{t('search.bestRated')}</SelectItem>
                <SelectItem value="lowestPrice">{t('search.lowestPrice')}</SelectItem>
                <SelectItem value="departure">{t('search.departure')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-card border border-border rounded-xl p-4 space-y-6 sticky top-20">
              <div>
                <h3 className="font-semibold mb-3">{t('search.busType')}</h3>
                {busTypes.map(bt => (
                  <label key={bt} className="flex items-center gap-2 mb-2 text-sm cursor-pointer">
                    <Checkbox checked={busTypeFilter.includes(bt)}
                      onCheckedChange={(c) => setBusTypeFilter(c ? [...busTypeFilter, bt] : busTypeFilter.filter(x => x !== bt))} />
                    {bt}
                  </label>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-3">{t('search.priceRange')}</h3>
                <Slider min={0} max={3000} step={100} value={priceRange} onValueChange={setPriceRange} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹{priceRange[0]}</span><span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">{t('common.loading')}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">{t('search.noResults')}</p>
              </div>
            ) : (
              filtered.map(bus => (
                <BusCard key={bus.id} bus={bus}
                  onSelectSeats={(b) => navigate(`/seat-selection?busId=${b.id}&from=${from}&to=${to}&date=${date}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <RedFooter />
    </div>
  );
}
