import { useState } from 'react';
import { MapPin, Clock, Star, Wifi, Usb, Wind, Tv, Coffee, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import EliteScoreDisplay from '@/components/redbus/EliteScoreDisplay';
import BusRouteMap from '@/components/redbus/BusRouteMap';
import type { BusData } from '@/data/busData';

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-3 w-3" />,
  'USB Charging': <Usb className="h-3 w-3" />,
  'AC': <Wind className="h-3 w-3" />,
  'Entertainment': <Tv className="h-3 w-3" />,
  'Snacks': <Coffee className="h-3 w-3" />,
};

interface Props {
  bus: BusData;
  onSelectSeats: (bus: BusData) => void;
}

export default function BusCard({ bus, onSelectSeats }: Props) {
  const { t } = useTranslation();
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-shadow">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-display font-semibold">{bus.operator}</h3>
              <Badge variant="secondary" className="text-xs">{bus.busType}</Badge>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-center">
                <p className="font-semibold text-lg">{bus.departureTime}</p>
                <p className="text-muted-foreground text-xs">{bus.fromCity}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="h-px w-8 bg-border" />
                <Clock className="h-3 w-3" />
                <span className="text-xs">{bus.duration}</span>
                <div className="h-px w-8 bg-border" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{bus.arrivalTime}</p>
                <p className="text-muted-foreground text-xs">{bus.toCity}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {bus.amenities.slice(0, 4).map(a => (
                <span key={a} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {amenityIcons[a] || null} {a}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <EliteScoreDisplay score={bus.rating} size="sm" />
            <p className="text-xs text-muted-foreground">{bus.availableSeats} {t('search.seatsLeft')}</p>
            <p className="text-2xl font-display font-bold text-primary">₹{bus.price}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
                <Map className="h-3 w-3 mr-1" /> {showMap ? 'Hide' : t('search.viewMap')}
                {showMap ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
              <Button size="sm" className="gradient-hero text-primary-foreground" onClick={() => onSelectSeats(bus)}>
                {t('search.selectSeats')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showMap && (
        <div className="border-t border-border p-4">
          <BusRouteMap busId={bus.id} height="250px" showLiveLocation />
        </div>
      )}
    </div>
  );
}
