import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Wifi, Battery, Droplets, Tv, ShieldCheck, Clock, MapPin, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function BusDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId, travelDate } = location.state || {};

  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/routes/${routeId}`);
        const data = await res.json();
        if (data.success) {
          setRoute(data.route);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchDetails();
    } else {
      // Fallback if no routeId in state (e.g. direct access)
      // For now, redirect to home
      navigate('/');
    }
  }, [routeId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!route) return <div className="p-20 text-center">Route details not found</div>;

  const { busId: bus } = route;

  const amenityIcons: any = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'Charging Point': <Battery className="w-5 h-5" />,
    'Water Bottle': <Droplets className="w-5 h-5" />,
    'Entertainment': <Tv className="w-5 h-5" />,
    'CCTV': <ShieldCheck className="w-5 h-5" />,
    'Punctual': <Clock className="w-5 h-5" />,
    'AC': <div className="flex items-center justify-center"><span className="text-xs font-bold">AC</span></div>
  };

  const handleSelectSeats = () => {
    navigate('/booking/seats', {
      state: {
        bus: { ...bus, price: route.basePrice },
        routeId: route._id,
        travelDate
      }
    });
  };

  // Mock coordinates for live tracking
  const positions: [number, number][] = [
    [19.0760, 72.8777], // Mumbai
    [18.5204, 73.8567]  // Pune
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Header Card */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-slate-900">{bus.busType}</h1>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-200">
                <Star className="w-3 h-3 fill-red-600" /> New
              </span>
            </div>
            <div className="flex items-center gap-6 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-red-600" />
                <span>{bus.busNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>{route.fromCity} → {route.toCity}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Price</p>
              <p className="text-4xl font-bold text-slate-900">₹{route.basePrice}</p>
            </div>
            <button 
              onClick={handleSelectSeats}
              className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
            >
              Select Seats
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Amenities & Route Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Amenities */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['AC', 'Free Wifi', 'Snacks', 'Entertainment', 'CCTV', 'Punctual'].map((amenity) => (
                  <div key={amenity} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 transition-colors hover:border-red-600/50 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-red-50 transition-colors">
                      {amenityIcons[amenity.replace('Free ', '')] || <Wifi className="w-5 h-5 text-red-600" />}
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Route Information */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Route Information</h3>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8 transition-colors">
                <div className="flex items-start gap-6 relative">
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-red-600 to-slate-100"></div>
                  <div className="w-6 h-6 bg-red-600 rounded-full flex-shrink-0 relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)] border-4 border-white"></div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">{route.departureTime} PM</p>
                    <p className="font-black text-slate-400 uppercase text-xs tracking-widest">{route.fromCity}</p>
                    <p className="text-sm text-slate-500 font-medium">Main Bus Terminal, Platform 4</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 relative z-10 border-4 border-white"></div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">{route.arrivalTime} PM</p>
                    <p className="font-black text-slate-400 uppercase text-xs tracking-widest">{route.toCity}</p>
                    <p className="text-sm text-slate-500 font-medium">City Center Drop-off Point</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Tracking */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Route Tracking
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{route.fromCity} — {route.toCity}</span>
              </div>
              <div className="h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative">
                <MapContainer center={positions[0]} zoom={7} style={{ height: '100%', width: '100%', background: '#f8fafc' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={positions[0]}>
                    <Popup>{route.fromCity}</Popup>
                  </Marker>
                  <Marker position={positions[1]}>
                    <Popup>{route.toCity}</Popup>
                  </Marker>
                  <Polyline positions={positions} color="#dc2626" weight={4} dashArray="10, 10" />
                  {/* Mock Bus Icon */}
                  <Marker position={[18.8, 73.3]} icon={L.divIcon({
                    className: 'custom-bus-icon',
                    html: `<div class="bg-red-600 p-2 rounded-lg shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s1-1 1-2V7s0-1-1-1h-3"/><path d="M18 5v14"/><path d="M2 8v8a2 2 0 0 0 2 2h14"/><path d="M2 14h12"/><path d="M2 10h12"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg></div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                  })} />
                </MapContainer>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl flex justify-between items-center z-[1000]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-500">{route.fromCity}</span>
                  </div>
                  <div className="flex-1 mx-4 h-1 bg-slate-100 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-red-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{route.toCity}</span>
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Elite Benefits */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-8 transition-colors">
              <h3 className="text-xl font-bold text-slate-900">Elite Benefits</h3>
              <div className="space-y-6">
                {[
                  'Complimentary water bottle and snacks provided on board.',
                  'Priority boarding for elite members.',
                  'Fully refundable if cancelled 24h before departure.'
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
