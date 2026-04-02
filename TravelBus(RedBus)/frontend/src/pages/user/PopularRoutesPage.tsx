import React, { useState, useEffect } from 'react';
import { MapPin, Bus, Star, Clock, ArrowRight, Search, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function PopularRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      const querySnapshot = await getDocs(collection(db, 'routes'));
      setRoutes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchRoutes();
  }, []);

  const handleBook = (from: string, to: string) => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?from=${from}&to=${to}&date=${today}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
      {/* Hero */}
      <div className="bg-[#1e1e2e] py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Popular <span className="text-blue-400">Elite</span> Routes
          </motion.h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover the most traveled routes with our premium bus services. Elite comfort, guaranteed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route, i) => (
            <motion.div 
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> From
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{route.fromCity}</div>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="text-blue-600 dark:text-blue-400 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex items-center gap-2 justify-end text-slate-400 text-xs font-bold uppercase tracking-widest">
                      To <MapPin className="w-3 h-3" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{route.toCity}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance</div>
                    <div className="font-bold text-slate-900 dark:text-white">{route.distance}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</div>
                    <div className="font-bold text-slate-900 dark:text-white">{route.duration}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting from</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">₹{route.basePrice}</div>
                  </div>
                  <button 
                    onClick={() => handleBook(route.fromCity, route.toCity)}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
