import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Bus, Calendar, MapPin, ChevronRight, Download, Star } from 'lucide-react';
import { motion } from 'motion/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setBookings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 font-medium">Manage your upcoming and past journeys.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Upcoming</button>
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">Completed</button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Bus className="w-10 h-10 text-slate-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">No bookings yet</h3>
            <p className="text-slate-500">Your future travel stories start here. Book your first bus today!</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10">
            Find a Bus
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, i) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group"
            >
              <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-grow space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                      {booking.status}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">PNR: {booking.pnr}</div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-slate-900">{new Date(booking.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">{booking.fromCity}</div>
                    </div>
                    <div className="flex-grow flex items-center gap-2">
                      <div className="h-px bg-slate-200 flex-grow relative">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-slate-400">8h 30m</div>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-2xl font-bold text-slate-900">{new Date(booking.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">{booking.toCity}</div>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Calendar className="w-4 h-4 text-blue-600" /> {new Date(booking.departureTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Bus className="w-4 h-4 text-blue-600" /> {booking.busType}
                    </div>
                  </div>
                </div>

                <div className="md:w-48 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase">Total Paid</div>
                    <div className="text-3xl font-bold text-slate-900">₹{booking.totalFare}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                      <Download className="w-4 h-4" /> Ticket
                    </button>
                    <button className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      <Star className="w-4 h-4" /> Review
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
