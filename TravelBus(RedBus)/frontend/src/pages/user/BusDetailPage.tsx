import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Bus, MapPin, Star, Shield, Coffee, Wifi, Tv, Wind, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function BusDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId');
  const date = searchParams.get('date');
  const [bus, setBus] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const busRes = await fetch(`/api/buses/${id}`);
        const busData = await busRes.json();
        if (busData.success) {
          setBus(busData.bus);
        }

        if (routeId) {
          // In a real app, you might have a specific route detail API
          // For now, we'll fetch from search or similar
          const searchRes = await fetch(`/api/buses/search?from=${searchParams.get('from') || ''}&to=${searchParams.get('to') || ''}&date=${date || ''}`);
          const searchData = await searchRes.json();
          if (searchData.success) {
            const foundRoute = searchData.routes.find((r: any) => r._id === routeId);
            if (foundRoute) setRoute(foundRoute);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, routeId, date]);

  if (loading) return <LoadingSpinner />;
  if (!bus) return <div className="p-20 text-center">Bus not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-8 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{bus.busType}</h1>
            <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
              bus.eliteScore >= 4 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
            }`}>
              <Star className="w-4 h-4 fill-current" /> {bus.eliteScore || 'New'}
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2"><Bus className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {bus.busNumber}</div>
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {bus.operatorName}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase">Ticket Price</div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white">₹{bus.price || 499}</div>
          </div>
          <button 
            onClick={() => navigate(`/seat-selection?busId=${bus._id || bus.id}&routeId=${routeId}&date=${date}`)}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
          >
            Select Seats
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Amenities & Info */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Wind, label: 'AC' },
                { icon: Wifi, label: 'Free Wifi' },
                { icon: Coffee, label: 'Snacks' },
                { icon: Tv, label: 'Entertainment' },
                { icon: Shield, label: 'CCTV' },
                { icon: Clock, label: 'Punctual' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 text-center transition-colors">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Route Information</h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-8 transition-colors">
              <div className="flex items-start gap-6 relative">
                <div className="w-4 h-4 bg-blue-600 rounded-full mt-2 relative z-10 ring-4 ring-blue-100 dark:ring-blue-900/40"></div>
                <div className="absolute left-2 top-4 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -ml-px"></div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{route?.departureTime || '09:00 PM'}</div>
                  <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{route?.fromCity || bus.fromCity}</div>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Main Bus Terminal, Platform 4</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full mt-2 relative z-10 ring-4 ring-slate-100 dark:ring-slate-800/50"></div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{route?.arrivalTime || '05:30 AM'}</div>
                  <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{route?.toCity || bus.toCity}</div>
                  <p className="text-sm text-slate-400 dark:text-slate-500">City Center Drop-off Point</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold">Elite Benefits</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">✓</div>
                <p className="text-sm text-slate-300">Complimentary water bottle and snacks provided on board.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">✓</div>
                <p className="text-sm text-slate-300">Priority boarding for elite members.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">✓</div>
                <p className="text-sm text-slate-300">Fully refundable if cancelled 24h before departure.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
