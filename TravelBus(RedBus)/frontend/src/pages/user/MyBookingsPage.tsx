import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ticket, Calendar, MapPin, Bus, ChevronRight, Star, Clock, ShieldCheck, Map, MessageSquare, XCircle, ArrowRight } from 'lucide-react';
import { auth } from '../../firebase';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReviewModal from '../../components/user/ReviewModal';
import { useNavigate, Link } from 'react-router-dom';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`/api/bookings?uid=${auth.currentUser.uid}`);
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

  const handleReviewClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleTrackLive = (booking: any) => {
    navigate(`/bus/${booking.busId._id}`, {
      state: {
        routeId: booking.routeId._id,
        travelDate: booking.travelDate
      }
    });
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Upcoming') return b.status === 'Paid' && new Date(b.travelDate) >= new Date();
    if (activeTab === 'Completed') return b.status === 'Paid' && new Date(b.travelDate) < new Date();
    return b.status === 'Cancelled';
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 transition-colors">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-slate-500 font-medium">Manage your upcoming and past journeys</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 transition-colors">
            {(['Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-200">
              <Bus className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">No {activeTab.toLowerCase()} bookings</h2>
              <p className="text-slate-500">Your {activeTab.toLowerCase()} travel adventures will appear here.</p>
            </div>
            {activeTab === 'Upcoming' && (
              <button 
                onClick={() => navigate('/')}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                Book Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBookings.map((booking) => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-slate-200 p-8 hover:border-red-600/30 transition-all group shadow-sm"
              >
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          booking.status === 'Paid' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {booking.status}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PNR: {booking.pnr}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-slate-900">{booking.fromCity}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Departure</p>
                      </div>
                      <div className="flex-1 px-8 flex flex-col items-center gap-2">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent relative">
                          <Bus className="w-5 h-5 text-red-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Route</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-2xl font-bold text-slate-900">{booking.toCity}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arrival</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-bold text-slate-600">{booking.busId.busType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-bold text-slate-600">Seats: {booking.seats.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64 flex flex-col gap-3">
                    {activeTab === 'Upcoming' && (
                      <>
                        <button 
                          onClick={() => handleTrackLive(booking)}
                          className="w-full bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold border border-slate-200 hover:border-red-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Map className="w-5 h-5 text-green-600" /> Track Live
                        </button>
                        <button 
                          onClick={() => handleCancel(booking._id)}
                          className="w-full bg-slate-50 text-red-600 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          Cancel Ticket
                        </button>
                      </>
                    )}
                    {activeTab === 'Completed' && (
                      <button 
                        onClick={() => handleReviewClick(booking)}
                        className="w-full bg-orange-50 text-orange-600 py-4 rounded-2xl font-bold border border-orange-200 hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" /> Rate Journey
                      </button>
                    )}
                    <Link 
                      to={`/booking/confirm`} 
                      state={{ bookingId: booking._id }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-500 py-4 rounded-2xl font-bold border border-slate-200 hover:text-slate-900 transition-all"
                    >
                      View Ticket <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isReviewModalOpen && selectedBooking && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          booking={selectedBooking}
          onSubmit={() => {
            // Refresh bookings or show success
          }}
        />
      )}
    </div>
  );
}
