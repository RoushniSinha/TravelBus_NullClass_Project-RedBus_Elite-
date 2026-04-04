import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, MapPin, Calendar, Clock, User, Phone, Share2, Download, ArrowRight, Bus } from 'lucide-react';
import { motion } from 'motion/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, pnr } = location.state || {};

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        if (data.success) {
          setBooking(data.booking);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div className="p-20 text-center">Booking not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto border border-orange-200">
            <CheckCircle2 className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="text-slate-500">Your ticket has been sent to {booking.contactInfo.email}</p>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden transition-colors">
          <div className="bg-red-600 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">PNR Number</div>
              <div className="text-4xl font-black tracking-tighter">{booking.pnr}</div>
            </div>
            <div className="flex gap-4">
              <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border border-white/10">
                <Download className="w-4 h-4" /> Download Ticket
              </button>
              <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border border-white/10">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                    <Bus className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus Details</div>
                    <div className="font-bold text-slate-900 text-lg">{booking.busId.busType}</div>
                    <div className="text-sm text-slate-500 font-medium">{booking.busId.busNumber}</div>
                  </div>
                </div>

                <div className="space-y-8 relative">
                  <div className="absolute left-[5px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-red-600 to-slate-200"></div>
                  <div className="flex items-start gap-6 relative">
                    <div className="w-3 h-3 bg-red-600 rounded-full mt-1.5 relative z-10 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-slate-900">{booking.routeId.departureTime}</div>
                      <div className="font-black text-slate-400 uppercase text-[10px] tracking-widest">{booking.routeId.fromCity}</div>
                      <p className="text-xs text-slate-500 font-medium">{booking.boardingPoint}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 relative">
                    <div className="w-3 h-3 bg-slate-200 rounded-full mt-1.5 relative z-10 border border-slate-300"></div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-slate-900">{booking.routeId.arrivalTime}</div>
                      <div className="font-black text-slate-400 uppercase text-[10px] tracking-widest">{booking.routeId.toCity}</div>
                      <p className="text-xs text-slate-500 font-medium">{booking.droppingPoint}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                    <div className="font-bold text-slate-900">{new Date(booking.travelDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seats</div>
                    <div className="font-bold text-red-600">{booking.seats.join(', ')}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passengers</div>
                  <div className="space-y-3">
                    {booking.passengers.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">{p.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{p.seatNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</div>
                  <div className="font-bold text-slate-900">+91 1800-ELITE-BUS</div>
                </div>
              </div>
              <Link to="/my-bookings" className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-900/10">
                Go to My Bookings <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
