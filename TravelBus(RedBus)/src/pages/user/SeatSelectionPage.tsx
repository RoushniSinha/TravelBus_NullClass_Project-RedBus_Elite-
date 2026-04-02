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
  const [bus, setBus] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!busId) return;

    // Fetch Bus Details
    const fetchBus = async () => {
      const busDoc = await getDoc(doc(db, 'buses', busId));
      if (busDoc.exists()) {
        setBus({ id: busDoc.id, ...busDoc.data() });
      }
    };
    fetchBus();

    // Real-time Seats Listener
    const seatsRef = collection(db, 'buses', busId, 'seats');
    const unsubscribe = onSnapshot(seatsRef, async (snapshot) => {
      if (snapshot.empty) {
        // Initialize seats if they don't exist (First time)
        const batch = writeBatch(db);
        const initialSeats = Array.from({ length: 40 }, (_, i) => ({
          id: `S${i + 1}`,
          status: 'available',
          lockedBy: null,
          lockedAt: null,
          type: i % 4 < 2 ? 'window' : 'aisle'
        }));
        
        initialSeats.forEach(seat => {
          const seatDoc = doc(db, 'buses', busId, 'seats', seat.id);
          batch.set(seatDoc, seat);
        });
        await batch.commit();
      } else {
        const seatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setSeats(seatList.sort((a, b) => {
          const numA = parseInt(a.id.substring(1));
          const numB = parseInt(b.id.substring(1));
          return numA - numB;
        }));
        
        // Sync local selection with remote state
        // If a seat we had selected is now booked or locked by someone else, remove it
        setSelectedSeats(prev => prev.filter(seatId => {
          const seat = seatList.find(s => s.id === seatId);
          return seat && seat.status === 'locked' && seat.lockedBy === auth.currentUser?.uid;
        }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [busId]);

  const toggleSeat = async (seatId: string) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const seatRef = doc(db, 'buses', busId!, 'seats', seatId);
    const seat = seats.find(s => s.id === seatId);

    if (!seat) return;

    try {
      if (seat.status === 'available') {
        if (selectedSeats.length >= 6) {
          alert("You can only select up to 6 seats.");
          return;
        }
        // Lock the seat
        await updateDoc(seatRef, {
          status: 'locked',
          lockedBy: auth.currentUser.uid,
          lockedAt: new Date().toISOString()
        });
        setSelectedSeats(prev => [...prev, seatId]);
      } else if (seat.status === 'locked' && seat.lockedBy === auth.currentUser.uid) {
        // Unlock the seat
        await updateDoc(seatRef, {
          status: 'available',
          lockedBy: null,
          lockedAt: null
        });
        setSelectedSeats(prev => prev.filter(s => s !== seatId));
      }
    } catch (error) {
      console.error("Error toggling seat:", error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!bus) return <div className="p-20 text-center">Bus not found</div>;

  const handleProceed = () => {
    navigate('/booking/passengers', { state: { bus, selectedSeats } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Seat Map */}
        <div className="flex-grow space-y-8">
          <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Select Your Seats</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-100 rounded"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-300 rounded"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-400 rounded"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Held by others</span>
                </div>
              </div>
            </div>

            <div className="max-w-xs mx-auto space-y-12">
              {/* Driver Section */}
              <div className="flex justify-end pr-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Bus className="w-6 h-6 text-slate-400" />
                </div>
              </div>

              {/* Seats Grid */}
              <div className="grid grid-cols-4 gap-4">
                {seats.map((seat, i) => {
                  const isBooked = seat.status === 'booked';
                  const isLockedByMe = seat.status === 'locked' && seat.lockedBy === auth.currentUser?.uid;
                  const isLockedByOthers = seat.status === 'locked' && seat.lockedBy !== auth.currentUser?.uid;
                  
                  return (
                    <div key={seat.id} className={`flex justify-center ${i % 4 === 1 ? 'mr-12' : ''}`}>
                      <button
                        disabled={isBooked || isLockedByOthers}
                        onClick={() => toggleSeat(seat.id)}
                        className={`w-10 h-12 rounded-lg border-2 transition-all flex items-center justify-center text-[10px] font-bold relative ${
                          isBooked 
                            ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                            : isLockedByOthers
                              ? 'bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed'
                              : isLockedByMe
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-300'
                        }`}
                      >
                        {seat.id}
                        {isLockedByOthers && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
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
        <div className="lg:w-96 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Booking Summary</h3>
              <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Bus</span>
                  <span className="text-slate-900 font-bold">{bus.busType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Route</span>
                  <span className="text-slate-900 font-bold">{bus.fromCity} → {bus.toCity}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 block">Selected Seats ({selectedSeats.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(s => (
                    <span key={s} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm italic">No seats selected</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Fare</span>
                <span className="text-3xl font-bold text-slate-900">₹{selectedSeats.length * bus.price}</span>
              </div>
              <button
                disabled={selectedSeats.length === 0}
                onClick={handleProceed}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/10"
              >
                Proceed to Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Seats are held for exactly 10 minutes once you proceed. Please complete your booking within the time limit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
