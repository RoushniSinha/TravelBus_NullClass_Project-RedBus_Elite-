import { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter, Download, Eye, MessageSquare, Send, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingSms, setSendingSms] = useState<string | null>(null);
  const [refunding, setRefunding] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    setBookings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const sendSmsUpdate = async (booking: any) => {
    const message = prompt(`Enter update message for ${booking.pnr}:`, `Elite TravelBus Update: Your bus ${booking.fromCity} to ${booking.toCity} is on time.`);
    
    if (!message) return;

    setSendingSms(booking.id);
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.contact?.phone,
          message: message
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ SMS update sent to ${booking.contact?.phone}`);
      } else {
        alert(`❌ Failed to send SMS: ${data.error}`);
      }
    } catch (error) {
      console.error("SMS Error:", error);
      alert("❌ Failed to send SMS. Check console for details.");
    } finally {
      setSendingSms(null);
    }
  };

  const handleRefund = async (booking: any) => {
    if (!booking.paymentId) {
      alert("No payment ID found for this booking.");
      return;
    }

    const confirmRefund = window.confirm(`Are you sure you want to refund ₹${booking.totalFare} for PNR ${booking.pnr}? This will also cancel the booking.`);
    if (!confirmRefund) return;

    setRefunding(booking.id);
    try {
      const response = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: booking.paymentId,
          amount: booking.totalFare,
          notes: { reason: 'Admin cancelled booking', pnr: booking.pnr },
          adminUid: auth.currentUser?.uid
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update Firestore booking status
        await updateDoc(doc(db, 'bookings', booking.id), {
          status: 'REFUNDED',
          refundId: data.refund.id,
          updatedAt: new Date().toISOString()
        });
        
        alert(`✅ Refund successful! Refund ID: ${data.refund.id}`);
        fetchBookings(); // Refresh list
      } else {
        alert(`❌ Refund failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Refund Error:", error);
      alert("❌ Failed to process refund.");
    } finally {
      setRefunding(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-slate-500 font-medium">View and manage all traveler bookings.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by PNR, user, or route..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filters
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">PNR</th>
                <th className="px-6 py-4">Traveler</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Fare</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 tracking-widest">{booking.pnr}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{booking.contact?.email || 'Guest'}</div>
                    <div className="text-xs font-medium text-slate-400">{booking.passengers?.length} Passenger(s)</div>
                    <div className="text-xs font-bold text-blue-600 mt-1">{booking.contact?.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{booking.fromCity} → {booking.toCity}</div>
                    <div className="text-xs font-medium text-slate-400">{new Date(booking.departureTime).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{booking.totalFare}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'REFUNDED' ? 'bg-red-100 text-red-700' : 
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => sendSmsUpdate(booking)}
                        disabled={sendingSms === booking.id}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all disabled:opacity-50"
                        title="Send SMS Update"
                      >
                        {sendingSms === booking.id ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Send className="w-4 h-4" /></motion.div> : <MessageSquare className="w-4 h-4" />}
                      </button>
                      {booking.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleRefund(booking)}
                          disabled={refunding === booking.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Process Refund"
                        >
                          {refunding === booking.id ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><RefreshCcw className="w-4 h-4" /></motion.div> : <RefreshCcw className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
