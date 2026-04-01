import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/redbus/Navbar';
import { mockBuses } from '@/data/busData';
import 'leaflet/dist/leaflet.css';

export default function AdminRoutesPage() {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBus, setSelectedBus] = useState(mockBuses[0]?.id || '');
  const bus = mockBuses.find(b => b.id === selectedBus);

  useEffect(() => {
    if (!containerRef.current || !bus) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    import('leaflet').then(L => {
      const map = L.map(containerRef.current!);
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);

      const wps = bus.waypoints.map(w => [w[0], w[1]] as [number, number]);
      const poly = L.polyline(wps, { color: '#D84E55', weight: 4 }).addTo(map);
      map.fitBounds(poly.getBounds(), { padding: [50, 50] });

      wps.forEach((wp, i) => {
        const color = i === 0 ? '#22C55E' : i === wps.length - 1 ? '#D84E55' : '#92400E';
        const label = i === 0 ? bus.fromCity : i === wps.length - 1 ? bus.toCity : `Stop ${i}`;
        const icon = L.divIcon({
          html: `<div style="background:${color};color:#fff;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;white-space:nowrap">${label}</div>`,
          iconSize: [70, 22], iconAnchor: [35, 11], className: ''
        });
        L.marker(wp, { icon, draggable: true }).addTo(map);
      });
    });

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [selectedBus]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><MapPin className="h-6 w-6" /> Route Manager</h1>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {mockBuses.slice(0, 10).map(b => (
            <Button key={b.id} variant={selectedBus === b.id ? 'default' : 'outline'} size="sm"
              className={selectedBus === b.id ? 'gradient-hero text-primary-foreground shrink-0' : 'shrink-0'}
              onClick={() => setSelectedBus(b.id)}>
              {b.fromCity} → {b.toCity}
            </Button>
          ))}
        </div>
        <div ref={containerRef} style={{ height: '500px', borderRadius: '0.75rem', overflow: 'hidden' }} />
        <p className="text-xs text-muted-foreground mt-2">Drag markers to adjust waypoints</p>
      </div>
    </div>
  );
}
