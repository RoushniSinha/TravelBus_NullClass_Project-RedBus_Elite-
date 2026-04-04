import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Bus, Filter, Star, Clock, MapPin, ChevronRight, Info, Search, Calendar, ChevronLeft, Wifi, Coffee, Tv, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from') || '';
  const toParam = searchParams.get('to') || '';
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [from, setFrom] = useState(fromParam);
  const [to, setTo] = useState(toParam);
  const [date, setDate] = useState(dateParam);

  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-low');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setFrom(fromParam);
    setTo(toParam);
    setDate(dateParam);
    setCurrentPage(1);
  }, [fromParam, toParam, dateParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        // Fetch from Firestore instead of API
        const busesRef = collection(db, 'buses');
        let q = query(busesRef, where('isActive', '==', true));
        
        // Note: Firestore doesn't support case-insensitive regex in query() 
        // without third-party search engines or normalized fields.
        // For now, we'll fetch all active buses and filter in memory for simplicity,
        // or assume exact match if the user typed correctly.
        const querySnapshot = await getDocs(q);
        const busList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Calculate duration
          let duration = '0h 0m';
          if (data.departureTime && data.arrivalTime) {
            const start = new Date(data.departureTime);
            const end = new Date(data.arrivalTime);
            const diffMs = end.getTime() - start.getTime();
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            duration = `${diffHrs}h ${diffMins}m`;
          }

          return {
            id: doc.id,
            busNumber: data.busNumber,
            busType: data.busType,
            operatorName: data.operatorName || 'TravelBus Express', // Fallback
            fromCity: data.fromCity,
            toCity: data.toCity,
            departureTime: data.departureTime ? new Date(data.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
            arrivalTime: data.arrivalTime ? new Date(data.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
            duration: duration,
            price: data.price,
            avgRating: data.avgRating || 0,
            amenities: data.amenities || [],
            availableSeats: data.availableSeats || 0,
            rawDepartureTime: data.departureTime // for sorting
          };
        });

        // Filter by from/to in memory for better UX (case insensitive)
        const filtered = busList.filter(bus => 
          bus.fromCity.toLowerCase() === fromParam.toLowerCase() && 
          bus.toCity.toLowerCase() === toParam.toLowerCase()
        );

        setBuses(filtered);
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (fromParam && toParam) {
      fetchBuses();
    } else {
      setLoading(false);
    }
  }, [fromParam, toParam, dateParam]);

  // Frontend Filtering and Sorting
  const filteredBuses = useMemo(() => {
    let result = [...buses];

    if (selectedTypes.length > 0) {
      result = result.filter(bus => selectedTypes.includes(bus.busType));
    }

    if (selectedTimes.length > 0) {
      result = result.filter(bus => {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        if (selectedTimes.includes('Morning (6am-12pm)') && hour >= 6 && hour < 12) return true;
        if (selectedTimes.includes('Afternoon (12pm-6pm)') && hour >= 12 && hour < 18) return true;
        if (selectedTimes.includes('Evening (6pm-12am)') && hour >= 18 && hour < 24) return true;
        if (selectedTimes.includes('Night (12am-6am)') && hour >= 0 && hour < 6) return true;
        return false;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating-high') return b.avgRating - a.avgRating;
      if (sortBy === 'departure-early') return a.rawDepartureTime.localeCompare(b.rawDepartureTime);
      return 0;
    });

    return result;
  }, [buses, selectedTypes, selectedTimes, sortBy]);

  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const paginatedBuses = filteredBuses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setCurrentPage(1);
  };

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
    setCurrentPage(1);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-3.5 h-3.5" />;
      case 'water': return <Coffee className="w-3.5 h-3.5" />;
      case 'ac': return <Wind className="w-3.5 h-3.5" />;
      case 'tv': return <Tv className="w-3.5 h-3.5" />;
      default: return <Info className="w-3.5 h-3.5" />;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Top Search Bar - Red Header like Image 1 */}
      <div className="bg-red-600 dark:bg-red-700 sticky top-0 z-30 shadow-lg py-6">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-red-100 uppercase tracking-widest ml-1">From</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus-within:bg-white/20 transition-all">
                <MapPin className="w-4 h-4 text-white" />
                <input 
                  type="text" 
                  placeholder="From City" 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white font-bold placeholder:text-red-100/50 w-full text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-red-100 uppercase tracking-widest ml-1">To</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus-within:bg-white/20 transition-all">
                <MapPin className="w-4 h-4 text-white" />
                <input 
                  type="text" 
                  placeholder="To City" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white font-bold placeholder:text-red-100/50 w-full text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-red-100 uppercase tracking-widest ml-1">Date</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 focus-within:bg-white/20 transition-all">
                <Calendar className="w-4 h-4 text-white" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white font-bold w-full text-sm [color-scheme:dark]"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="bg-white text-red-600 px-8 py-3.5 rounded-xl font-black hover:bg-slate-50 transition-all shadow-xl shadow-red-900/20 text-sm uppercase tracking-widest"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">Bus Type</label>
                  <div className="space-y-3">
                    {['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Luxury'].map(type => (
                      <label key={type} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="rounded border-slate-300 dark:border-slate-600 text-red-600 focus:ring-red-500 w-4 h-4 bg-transparent" 
                        />
                        <span className="text-sm font-bold group-hover:text-red-600 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">Departure</label>
                  <div className="space-y-3">
                    {['Morning (6am-12pm)', 'Afternoon (12pm-6pm)', 'Evening (6pm-12am)', 'Night (12am-6am)'].map(time => (
                      <label key={time} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedTimes.includes(time)}
                          onChange={() => toggleTime(time)}
                          className="rounded border-slate-300 dark:border-slate-600 text-red-600 focus:ring-red-500 w-4 h-4 bg-transparent" 
                        />
                        <span className="text-sm font-bold group-hover:text-red-600 transition-colors">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {filteredBuses.length} Buses Available
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 font-bold text-red-600 cursor-pointer"
                >
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating-high">Rating (High to Low)</option>
                  <option value="departure-early">Departure (Early to Late)</option>
                </select>
              </div>
            </div>

            {paginatedBuses.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4 transition-colors">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                  <Bus className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No buses found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try searching for a different route or date.</p>
                <Link to="/" className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
                  Back to Search
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {paginatedBuses.map((bus) => (
                    <motion.div 
                      key={bus.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-red-600/30 transition-all overflow-hidden group"
                    >
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                          <div className="flex-grow space-y-8">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">{bus.operatorName}</h3>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{bus.busType}</p>
                              </div>
                              <div className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 ${
                                bus.avgRating >= 4 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                              }`}>
                                <Star className="w-3.5 h-3.5 fill-current" /> {bus.avgRating > 0 ? bus.avgRating : 'NEW'}
                              </div>
                            </div>

                            <div className="flex items-center gap-12">
                              <div className="space-y-1">
                                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{bus.departureTime}</div>
                                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{bus.fromCity}</div>
                              </div>
                              <div className="flex-grow flex flex-col items-center gap-2">
                                <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">{bus.duration}</div>
                                <div className="h-0.5 bg-slate-100 dark:bg-slate-700 w-full relative rounded-full">
                                  <div className="absolute -top-1 left-0 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                                  <div className="absolute -top-1 right-0 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-2">
                                    <Bus className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 text-right">
                                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{bus.arrivalTime}</div>
                                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{bus.toCity}</div>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-64 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700 pt-8 lg:pt-0 lg:pl-10">
                            <div className="text-right space-y-1">
                              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Starting from</div>
                              <div className="text-4xl font-black text-slate-900 dark:text-white">₹{bus.price}</div>
                            </div>
                            <Link 
                              to={`/bus/${bus.id}?date=${dateParam}`}
                              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black text-center hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs"
                            >
                              View Seats
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700">
                        <div className="flex gap-8">
                          {bus.amenities?.slice(0, 4).map((a: string) => (
                            <div key={a} className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              <div className="text-red-600">{getAmenityIcon(a)}</div> {a}
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                          {bus.availableSeats} Seats Left
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 py-8">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                            currentPage === i + 1 
                              ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' 
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
