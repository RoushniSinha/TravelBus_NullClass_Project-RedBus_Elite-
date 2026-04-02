import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Bus, Filter, Star, Clock, MapPin, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          from: from || '',
          to: to || '',
          date: date || ''
        });
        const response = await fetch(`/api/buses/search?${queryParams.toString()}`);
        const data = await response.json();
        if (data.success) {
          // Map backend route data to the format expected by the UI
          const busList = data.routes.map((route: any) => ({
            id: route.busId._id,
            routeId: route._id,
            busType: route.busId.busType,
            operatorName: route.busId.operatorName,
            fromCity: route.fromCity,
            toCity: route.toCity,
            departureTime: route.departureTime,
            arrivalTime: route.arrivalTime,
            duration: route.duration,
            price: route.basePrice,
            avgRating: route.busId.eliteScore,
            amenities: route.busId.amenities,
            availableSeats: route.busId.totalSeats // Simplified for now
          }));
          setBuses(busList);
        }
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (from && to) {
      fetchBuses();
    }
  }, [from, to, date]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">Bus Type</label>
                <div className="space-y-2">
                  {['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Luxury'].map(type => (
                    <label key={type} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">Departure Time</label>
                <div className="space-y-2">
                  {['Morning (6am-12pm)', 'Afternoon (12pm-6pm)', 'Evening (6pm-12am)', 'Night (12am-6am)'].map(time => (
                    <label key={time} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-6">
          <div className="bg-blue-600 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-blue-900/10">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">From</div>
                <div className="text-xl font-bold">{from}</div>
              </div>
              <ChevronRight className="w-6 h-6 opacity-50" />
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">To</div>
                <div className="text-xl font-bold">{to}</div>
              </div>
            </div>
            <div className="bg-blue-500/30 px-4 py-2 rounded-xl border border-blue-400/30">
              <div className="text-xs font-bold uppercase tracking-widest opacity-70">Date</div>
              <div className="font-bold">{date || 'Any Date'}</div>
            </div>
          </div>

          {buses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4 transition-colors">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <Bus className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No buses found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try searching for a different route or date.</p>
              <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Back to Search
              </Link>
            </div>
          ) : (
            buses.map((bus) => (
              <motion.div 
                key={bus.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-grow space-y-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{bus.busType}</h3>
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          bus.avgRating >= 4 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          <Star className="w-3 h-3 fill-current" /> {bus.avgRating || 'New'}
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase">{bus.fromCity}</div>
                        </div>
                        <div className="flex-grow flex items-center gap-2">
                          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow relative">
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-2 text-[10px] font-bold text-slate-400 uppercase">8h 30m</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase">{bus.toCity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-48 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase">Starting from</div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{bus.price}</div>
                      </div>
                      <Link 
                        to={`/bus/${bus.id}?routeId=${bus.routeId}&date=${date}`}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-700 transition-all"
                      >
                        View Seats
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4">
                    {bus.amenities?.slice(0, 3).map((a: string) => (
                      <div key={a} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Info className="w-3 h-3" /> {a}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{bus.availableSeats} Seats Left</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
