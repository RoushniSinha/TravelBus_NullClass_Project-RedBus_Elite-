import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, Share2, MapPin, Calendar, Bus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookingConfirmPage() {
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) return <div className="p-20 text-center">No booking found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-900/10"
        >
          <CheckCircle className="w-10 h-10" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Booking Confirmed!</h1>
          <p className="text-slate-500 text-lg">Your elite journey is all set. Have a safe travel!</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-blue-600 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-70">PNR Number</div>
              <div className="text-2xl font-bold tracking-widest">{booking.pnr}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl backdrop-blur-md transition-all">
              <Download className="w-5 h-5" />
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl backdrop-blur-md transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{new Date(booking.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase">{booking.fromCity}</div>
                </div>
                <div className="flex-grow flex items-center gap-2">
                  <div className="h-px bg-slate-200 flex-grow relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-bold text-slate-400">8h 30m</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{new Date(booking.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase">{booking.toCity}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Passengers</h3>
                <div className="space-y-3">
                  {booking.passengers.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="font-bold text-slate-700">{p.name} <span className="text-slate-400 font-medium ml-2">({p.age}, {p.gender})</span></div>
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold">{p.seat}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Journey Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Date of Travel</div>
                      <div className="font-bold text-slate-900">{new Date(booking.departureTime).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Boarding Point</div>
                      <div className="font-bold text-slate-900">Main Bus Terminal, Platform 4</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Total Amount Paid</div>
                <div className="text-3xl font-bold text-blue-600">₹{booking.totalFare}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col md:flex-row justify-center gap-4">
          <Link to="/my-bookings" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all text-center">
            View My Bookings
          </Link>
          <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10">
            Book Another Journey <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
