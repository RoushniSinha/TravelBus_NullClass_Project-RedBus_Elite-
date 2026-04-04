import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ArrowRight, ArrowLeft, Ticket, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../../firebase';

export default function PassengerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, selectedSeats, routeId, travelDate, timeLeft: initialTimeLeft } = location.state || {};
  const [route, setRoute] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: auth.currentUser?.email || '',
    phone: ''
  });
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft || 600);

  useEffect(() => {
    if (!bus || !selectedSeats || !routeId) {
      navigate('/');
      return;
    }

    const fetchRoute = async () => {
      try {
        const res = await fetch(`/api/routes/${routeId}`);
        const data = await res.json();
        if (data.success) {
          setRoute(data.route);
          // Set default boarding and dropping points
          if (data.route.waypoints?.length >= 2) {
            setBoardingPoint(data.route.waypoints[0].city);
            setDroppingPoint(data.route.waypoints[data.route.waypoints.length - 1].city);
          }
        }
      } catch (e) {
        console.error("Error fetching route:", e);
      }
    };

    fetchRoute();

    setPassengers(selectedSeats.map((seat: string) => ({
      seatNumber: seat,
      name: '',
      age: '',
      gender: 'Male'
    })));
  }, [bus, selectedSeats, routeId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePassengerChange = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, amount: selectedSeats.length * bus.price })
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
      } else {
        alert(data.error || "Invalid coupon");
        setDiscount(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const [isInitiating, setIsInitiating] = useState(false);

  const handleProceed = async () => {
    // Basic validation
    const isInvalid = passengers.some(p => !p.name || !p.age) || !contactInfo.phone || !boardingPoint || !droppingPoint;
    if (isInvalid) {
      alert("Please fill all details");
      return;
    }

    setIsInitiating(true);
    try {
      const fare = {
        base: selectedSeats.length * bus.price,
        tax: 30, // Fixed fee as per prompt
        discount: discount,
        total: (selectedSeats.length * bus.price) + 30 - discount
      };

      const res = await fetch('/api/bookings/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: bus._id || bus.id,
          routeId,
          travelDate,
          seats: selectedSeats,
          passengers,
          contactInfo,
          boardingPoint,
          droppingPoint,
          fare,
          uid: auth.currentUser?.uid
        })
      });

      const data = await res.json();
      if (data.success) {
        navigate('/booking/payment', {
          state: {
            bookingId: data.bookingId,
            razorpayOrderId: data.razorpayOrderId,
            amount: data.amount,
            bus,
            selectedSeats,
            routeId,
            travelDate,
            passengers,
            contactInfo,
            boardingPoint,
            droppingPoint,
            fare,
            timeLeft
          }
        });
      } else {
        alert(data.error || "Failed to initiate booking");
      }
    } catch (error) {
      console.error("Initiation error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsInitiating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-red-600 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to seat selection
            </button>
            <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-orange-200">
              <Clock className="w-4 h-4" /> Time left: {formatTime(timeLeft)}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Passenger Details</h1>
            <p className="text-slate-500 text-sm">Please enter the details of all passengers</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-6">
              <section className="space-y-6">
                {passengers.map((p, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-red-600" />
                        <h3 className="font-bold text-slate-900 text-lg">Passenger {i + 1}</h3>
                      </div>
                      <div className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest">
                        Seat {p.seatNumber}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Full Name</label>
                        <input 
                          type="text" 
                          value={p.name}
                          onChange={(e) => handlePassengerChange(i, 'name', e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Age</label>
                        <input 
                          type="number" 
                          value={p.age}
                          onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                          placeholder="25"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Gender</label>
                        <select 
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(i, 'gender', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none appearance-none"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 transition-colors">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-slate-900 text-lg">Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500">Mobile Number</label>
                    <div className="flex">
                      <span className="bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl px-4 py-3 text-slate-500 font-bold text-sm flex items-center">+91</span>
                      <input 
                        type="tel" 
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder="9876543210"
                        maxLength={10}
                        className="flex-1 bg-white border border-slate-200 rounded-r-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-slate-900 text-lg">Boarding & Dropping Points</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500">Boarding Point</label>
                    <select 
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Select Point</option>
                      {route?.waypoints?.filter((w: any) => w.type !== 'destination').map((w: any, idx: number) => (
                        <option key={idx} value={w.city}>{w.city} ({w.time})</option>
                      ))}
                      {!route?.waypoints && (
                        <>
                          <option>Main Bus Terminal (09:00 PM)</option>
                          <option>City Center Mall (09:30 PM)</option>
                          <option>Railway Station Gate 2 (10:00 PM)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500">Dropping Point</label>
                    <select 
                      value={droppingPoint}
                      onChange={(e) => setDroppingPoint(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Select Point</option>
                      {route?.waypoints?.filter((w: any) => w.type !== 'origin').map((w: any, idx: number) => (
                        <option key={idx} value={w.city}>{w.city} ({w.time})</option>
                      ))}
                      {!route?.waypoints && (
                        <>
                          <option>Central Drop-off (05:00 AM)</option>
                          <option>Airport Terminal 1 (05:30 AM)</option>
                          <option>Highway Junction (06:00 AM)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:w-96 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-8 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900">Fare Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Base Fare ({selectedSeats.length} Seats)</span>
                    <span className="text-slate-900 font-bold">₹{selectedSeats.length * bus.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Taxes & Fees</span>
                    <span className="text-slate-900 font-bold">₹{selectedSeats.length > 0 ? 30 : 0}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="font-medium">Coupon Discount</span>
                      <span className="font-bold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <span className="text-slate-900 font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-red-600">
                      ₹{(selectedSeats.length * bus.price) + (selectedSeats.length > 0 ? 30 : 0) - discount}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Apply Coupon</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="CODE100"
                      className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button 
                      onClick={validateCoupon}
                      disabled={isValidatingCoupon || !couponCode}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleProceed}
                  disabled={isInitiating}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/10 disabled:opacity-50"
                >
                  {isInitiating ? 'Processing...' : 'Proceed to Payment'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 transition-colors">
                <ShieldCheck className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                  Your booking is secured with 256-bit encryption. We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
