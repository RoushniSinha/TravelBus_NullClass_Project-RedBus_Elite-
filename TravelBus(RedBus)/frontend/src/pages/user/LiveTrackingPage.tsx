import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bus, Navigation, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const busIcon = L.divIcon({
  html: `<div class="bg-blue-600 p-2 rounded-full shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s1-1 1-2V7c0-1-1-2-2-2H4c-1 0-2 1-2 2v9c0 1 1 2 2 2h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
        </div>`,
  className: 'custom-bus-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LiveTrackingPage() {
  const [busLocation, setBusLocation] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    // Simulate live tracking updates
    const interval = setInterval(() => {
      setBusLocation(prev => [
        prev[0] + (Math.random() - 0.5) * 0.01,
        prev[1] + (Math.random() - 0.5) * 0.01
      ]);
    }, 5000);

    setLoading(false);

    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-slate-50">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4 bg-slate-50">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">Tracking Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 transition-colors">
      <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Live Bus Tracking</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Bus: MH-01-AB-1234 • Mumbai to Pune
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500">Estimated Arrival</p>
            <p className="font-bold text-slate-900">10:45 AM</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Navigation className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="flex-grow relative z-0">
        <MapContainer 
          center={busLocation} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={busLocation} icon={busIcon}>
            <Popup>
              <div className="p-2 bg-white text-slate-900">
                <p className="font-bold text-blue-600">TravelBus Express</p>
                <p className="text-xs text-slate-600">Current Speed: 45 km/h</p>
                <p className="text-xs text-slate-600">Next Stop: Lonavala</p>
              </div>
            </Popup>
          </Marker>
          <MapRecenter center={busLocation} />
        </MapContainer>

        {/* Floating Info Card */}
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:w-80 z-[1000]">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Location</p>
                <p className="text-sm font-bold text-slate-900">Near Navi Mumbai Expressway</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Speed</p>
                <p className="text-sm font-bold text-slate-900">45 km/h</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Distance Left</p>
                <p className="text-sm font-bold text-slate-900">120 km</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
