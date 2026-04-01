import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { mockBuses } from '@/data/busData';
import 'leaflet/dist/leaflet.css';

interface BusRouteMapProps {
  busId: string;
  height?: string;
  showLiveLocation?: boolean;
}

export default function BusRouteMap({ busId, height = '400px', showLiveLocation = false }: BusRouteMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<any>(null);
  const liveIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const bus = mockBuses.find(b => b.id === busId);

  useEffect(() => {
    if (!bus || !mapContainerRef.current || mapRef.current) return;

    import('leaflet').then(L => {
      const map = L.map(mapContainerRef.current!, { scrollWheelZoom: false });
      mapRef.current = map;

      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileRef.current = L.tileLayer(tileUrl, { attribution: '© OpenStreetMap' }).addTo(map);

      const waypoints = bus.waypoints.map(w => [w[0], w[1]] as [number, number]);
      
      // Route polyline
      const polyline = L.polyline(waypoints, { color: '#D84E55', weight: 4, opacity: 0.8 }).addTo(map);
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

      // Origin marker (green)
      const greenIcon = L.divIcon({
        html: `<div style="background:#22C55E;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">${bus.fromCity}</div>`,
        iconSize: [80, 28], iconAnchor: [40, 14], className: ''
      });
      L.marker(waypoints[0], { icon: greenIcon }).addTo(map);

      // Destination marker (red)
      const redIcon = L.divIcon({
        html: `<div style="background:#D84E55;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">${bus.toCity}</div>`,
        iconSize: [80, 28], iconAnchor: [40, 14], className: ''
      });
      L.marker(waypoints[waypoints.length - 1], { icon: redIcon }).addTo(map);

      // Intermediate stops
      waypoints.slice(1, -1).forEach((wp, i) => {
        const brownIcon = L.divIcon({
          html: `<div style="background:#92400E;color:#fff;width:12px;height:12px;border-radius:3px;border:2px solid #FDE68A"></div>`,
          iconSize: [12, 12], iconAnchor: [6, 6], className: ''
        });
        L.marker(wp, { icon: brownIcon }).bindTooltip(`Rest Stop ${i + 1}`, { direction: 'top' }).addTo(map);
      });

      // Live bus location
      if (showLiveLocation && bus.liveLocation) {
        const liveIcon = L.divIcon({
          html: `<div style="position:relative"><div style="width:14px;height:14px;background:#3B82F6;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(59,130,246,0.5)"></div><div style="position:absolute;top:-3px;left:-3px;width:20px;height:20px;border-radius:50%;border:2px solid #3B82F6;animation:pulse 1.5s infinite"></div></div>`,
          iconSize: [20, 20], iconAnchor: [10, 10], className: ''
        });
        const liveMarker = L.marker([bus.liveLocation[0], bus.liveLocation[1]], { icon: liveIcon }).addTo(map);
        liveMarker.bindTooltip('Live Location', { direction: 'top' });
      }
    });

    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [busId]);

  // Handle theme changes
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      if (tileRef.current) mapRef.current.removeLayer(tileRef.current);
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileRef.current = L.tileLayer(tileUrl, { attribution: '© OpenStreetMap' }).addTo(mapRef.current);
    });
  }, [isDark]);

  if (!bus) return <div className="text-center py-8 text-muted-foreground">Bus not found</div>;

  return (
    <>
      <style>{`@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }`}</style>
      <div ref={mapContainerRef} style={{ height, width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }} />
    </>
  );
}
