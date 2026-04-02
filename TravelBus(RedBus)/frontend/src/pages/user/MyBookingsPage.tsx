import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, MapPin, Calendar, Clock, ChevronRight, Bus, Star, XCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../../firebase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings?uid=${auth.currentUser?.uid}`);
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled', payment: { ...b.payment, status: 'Refunded' } } : b));
        alert("Booking cancelled successfully!");
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-black text-white py-12 transition-colors">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white">My Bookings</h1>
            <p className="text-slate-400 text-sm">Manage your upcoming and past trips</p>
          </div>
          <div className="flex bg-[#111111] p-1.5 rounded-2xl border border-[#2a2a2a] transition-colors">
            {(['Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-[#111111] p-24 rounded-[40px] border border-[#2a2a2a] text-center space-y-8 transition-colors shadow-2xl">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto border border-[#2a2a2a]">
              <Ticket className="w-12 h-12 text-slate-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">No {activeTab.toLowerCase()} bookings</h3>
              <p className="text-slate-400 max-w-xs mx-auto">You haven't made any {activeTab.toLowerCase()} bookings yet. Ready for a new adventure?</p>
            </div>
            {activeTab === 'Upcoming' && (
              <Link to="/" className="inline-flex items-center gap-2 bg-[#F97316] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#ea6c05] transition-all shadow-lg shadow-[#F97316]/10">
                Book Your First Trip <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] rounded-[32px] border border-[#2a2a2a] shadow-2xl hover:border-[#F97316]/30 transition-all overflow-hidden group"
              >
                <div className="p-10 flex flex-col lg:flex-row gap-10">
                  <div className="flex-grow space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#F97316]/50 transition-colors">
                        <Bus className="w-7 h-7 text-[#F97316]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PNR: {booking.pnr}</div>
                        <div className="font-bold text-white text-xl">{booking.busId.busType}</div>
                      </div>
                      <div className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        booking.status === 'Upcoming' ? 'bg-[#1e3a5f]/20 text-[#93c5fd] border-[#2563eb]/30' :
                        booking.status === 'Completed' ? 'bg-[#064e3b]/20 text-[#6ee7b7] border-[#059669]/30' :
                        'bg-[#450a0a]/20 text-[#fca5a5] border-[#dc2626]/30'
                      }`}>
                        {booking.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">{booking.routeId.departureTime}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{booking.routeId.fromCity}</div>
                      </div>
                      <div className="flex-grow flex items-center gap-3">
                        <div className="h-px bg-[#2a2a2a] flex-grow relative">
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-0.5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                            {booking.routeId.duration}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="text-2xl font-bold text-white">{booking.routeId.arrivalTime}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{booking.routeId.toCity}</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-[#2a2a2a] pt-8 lg:pt-0 lg:pl-10 space-y-8">
                    <div className="text-right space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Travel Date</div>
                      <div className="font-bold text-white text-lg">{new Date(booking.travelDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div className="text-xs font-bold text-[#F97316] bg-[#1a1000] px-3 py-1 rounded-lg border border-[#92400e] inline-block">Seats: {booking.seats.join(', ')}</div>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <Link 
                        to={`/booking/confirm`} 
                        state={{ bookingId: booking._id }}
                        className="w-full flex items-center justify-center gap-2 bg-[#F97316] text-white py-4 rounded-2xl font-bold hover:bg-[#ea6c05] transition-all shadow-lg shadow-[#F97316]/10"
                      >
                        View Ticket <ChevronRight className="w-4 h-4" />
                      </Link>
                      {booking.status === 'Upcoming' && (
                        <button 
                          onClick={() => handleCancel(booking._id)}
                          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-slate-400 py-4 rounded-2xl font-bold border border-[#2a2a2a] hover:bg-[#450a0a]/20 hover:text-red-500 hover:border-red-500/30 transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
