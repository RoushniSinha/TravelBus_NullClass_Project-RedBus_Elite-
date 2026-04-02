import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bus, Clock, Shield, ArrowRight, Info, User } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth } from '../../firebase';
import { doc, getDoc, onSnapshot, collection, updateDoc, setDoc, writeBatch, query, where } from 'firebase/firestore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SeatSelectionPage() {
  const [searchParams] = useSearchParams();
  const busId = searchParams.get('busId');
  const routeId = searchParams.get('routeId');
  const travelDate = searchParams.get('date');
  const [bus, setBus] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    if (!busId || !routeId || !travelDate) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Bus Details
        const busRes = await fetch(`/api/buses/${busId}`);
        const busData = await busRes.json();
        if (busData.success) setBus(busData.bus);

        // Fetch Seats
        const seatsRes = await fetch(`/api/buses/${busId}/routes/${routeId}/seats?date=${travelDate}`);
        const seatsData = await seatsRes.json();
        
        if (seatsData.success) {
          const allSeats = Array.from({ length: 40 }, (_, i) => {
            const seatId = `S${i + 1}`;
            const isBooked = seatsData.bookedSeats.includes(seatId);
            const lock = seatsData.lockedSeats.find((l: any) => l.seatNumber === seatId);
            
            return {
              id: seatId,
              status: isBooked ? 'booked' : (lock ? 'locked' : 'available'),
              lockedBy: lock ? lock.uid : null,
              type: i % 4 < 2 ? 'window' : 'aisle'
            };
          });
          setSeats(allSeats);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds for real-time-ish updates

    return () => clearInterval(interval);
  }, [busId, routeId, travelDate]);

  // Countdown timer
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTimeLeft(600);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Unlock all selected seats if time runs out
          selectedSeats.forEach(seatId => unlockSeat(seatId));
          setSelectedSeats([]);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats]);

  const unlockSeat = async (seatId: string) => {
    try {
      await fetch(`/api/buses/${busId}/routes/${routeId}/seats/unlock`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatNumber: seatId, travelDate, uid: auth.currentUser?.uid })
      });
    } catch (e) {
      console.error("Unlock error:", e);
    }
  };

  const toggleSeat = async (seatId: string) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const seat = seats.find(s => s.id === seatId);
    if (!seat) return;

    try {
      if (seat.status === 'available') {
        if (selectedSeats.length >= 6) {
          alert("You can only select up to 6 seats.");
          return;
        }
        
        const res = await fetch(`/api/buses/${busId}/routes/${routeId}/seats/lock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatNumber: seatId, travelDate, uid: auth.currentUser.uid })
        });
        
        const data = await res.json();
        if (data.success) {
          setSelectedSeats(prev => [...prev, seatId]);
          setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'locked', lockedBy: auth.currentUser?.uid } : s));
        } else {
          alert(data.error || "Failed to lock seat");
        }
      } else if (seat.status === 'locked' && seat.lockedBy === auth.currentUser.uid) {
        await unlockSeat(seatId);
        setSelectedSeats(prev => prev.filter(s => s !== seatId));
        setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'available', lockedBy: null } : s));
      }
    } catch (error) {
      console.error("Error toggling seat:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !bus) return <LoadingSpinner />;
  if (!bus) return <div className="p-20 text-center">Bus not found</div>;

  const handleProceed = () => {
    navigate('/booking/passengers', { 
      state: { 
        bus, 
        selectedSeats, 
        routeId, 
        travelDate,
        timeLeft 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-[#F97316] transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180" /> Back to Search
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{bus.operatorName}</h1>
            <p className="text-slate-400 text-sm font-medium">{bus.fromCity} → {bus.toCity}</p>
          </div>
          <div className="w-24"></div> {/* Spacer */}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Seat Map */}
          <div className="flex-grow">
            <div className="bg-[#111111] p-10 rounded-3xl border border-[#2a2a2a] shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#2a2a2a]">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">Select Your Seats</h2>
                  {selectedSeats.length > 0 && (
                    <div className="flex items-center gap-2 text-[#F97316] font-bold text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      Time left: {formatTime(timeLeft)}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#1f2937] rounded border border-[#2d3748]"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#F97316] rounded"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#374151] rounded border border-[#4b5563]"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked</span>
                  </div>
                </div>
              </div>

              <div className="max-w-xs mx-auto space-y-10">
                {/* Driver Section */}
                <div className="flex justify-between items-center px-4 py-2 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] mb-8">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Front</span>
                  <div className="w-8 h-8 bg-[#1f2937] rounded-lg flex items-center justify-center border border-[#2d3748]">
                    <Bus className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Driver</span>
                </div>

                {/* Seats Grid */}
                <div className="grid grid-cols-4 gap-y-6 gap-x-4">
                  {seats.map((seat, i) => {
                    const isBooked = seat.status === 'booked';
                    const isLockedByMe = seat.status === 'locked' && seat.lockedBy === auth.currentUser?.uid;
                    const isLockedByOthers = seat.status === 'locked' && seat.lockedBy !== auth.currentUser?.uid;
                    
                    return (
                      <div key={seat.id} className={`flex justify-center ${i % 4 === 1 ? 'mr-10' : ''}`}>
                        <button
                          disabled={isBooked || isLockedByOthers}
                          onClick={() => toggleSeat(seat.id)}
                          className={`w-12 h-12 rounded-xl border transition-all flex items-center justify-center text-[10px] font-bold relative group ${
                            isBooked 
                              ? 'bg-[#374151] border-[#4b5563] text-slate-500 opacity-60 cursor-not-allowed'
                              : isLockedByOthers
                                ? 'bg-[#2d2416] border-[#92400e] text-[#d97706] cursor-not-allowed'
                                : isLockedByMe
                                  ? 'bg-[#F97316] border-[#F97316] text-white shadow-lg shadow-[#F97316]/20 scale-110'
                                  : 'bg-[#1f2937] border-[#2d3748] text-slate-400 hover:border-[#F97316] hover:scale-105'
                          }`}
                        >
                          <div className="absolute top-1 left-1.5 text-[8px] opacity-50">{seat.id}</div>
                          <User className={`w-5 h-5 ${isLockedByMe ? 'text-white' : 'text-slate-400 group-hover:text-[#F97316]'}`} />
                          {isLockedByOthers && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#111111] animate-pulse"></div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-[380px] space-y-6">
            <div className="bg-[#111111] p-8 rounded-3xl border border-[#2a2a2a] shadow-2xl space-y-8 sticky top-24">
              <h3 className="text-xl font-bold text-white">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Selected Seats</span>
                  <span className="text-white font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Base Fare</span>
                  <span className="text-white font-bold">₹{selectedSeats.length * bus.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Taxes & Fees</span>
                  <span className="text-white font-bold">₹{selectedSeats.length > 0 ? 30 : 0}</span>
                </div>
                <div className="pt-4 border-t border-[#2a2a2a] flex justify-between items-center">
                  <span className="text-white font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#F97316]">
                    ₹{selectedSeats.length > 0 ? (selectedSeats.length * bus.price) + 30 : 0}
                  </span>
                </div>
              </div>

              <div className="bg-[#1e3a5f] border border-[#2563eb] rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-[#93c5fd] flex-shrink-0" />
                <p className="text-[11px] text-[#93c5fd] leading-relaxed font-medium">
                  Seats are locked for 10 minutes once you proceed. Complete your booking before the timer expires.
                </p>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={handleProceed}
                className="w-full bg-[#F97316] text-white py-4 rounded-xl font-bold hover:bg-[#ea6c05] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F97316]/10"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
