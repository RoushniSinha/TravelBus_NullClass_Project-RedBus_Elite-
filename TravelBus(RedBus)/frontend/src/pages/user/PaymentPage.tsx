import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ArrowLeft, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../../firebase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    bus, 
    selectedSeats, 
    routeId, 
    travelDate, 
    passengers, 
    contactInfo, 
    boardingPoint, 
    droppingPoint, 
    fare, 
    timeLeft: initialTimeLeft 
  } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft || 600);

  useEffect(() => {
    if (!bus || !fare) {
      navigate('/');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [bus, fare, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Order on Backend
      const orderRes = await fetch('/api/bookings/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: fare.total, 
          uid: auth.currentUser?.uid 
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Failed to initiate payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'TravelBus Elite',
        description: `Booking for ${bus.busType}`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          // 3. Verify Payment and Confirm Booking
          const confirmRes = await fetch('/api/bookings/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                uid: auth.currentUser?.uid,
                busId: bus._id || bus.id,
                routeId,
                travelDate,
                seats: selectedSeats,
                passengers,
                contactInfo,
                boardingPoint,
                droppingPoint,
                fare
              }
            })
          });

          const confirmData = await confirmRes.json();
          if (confirmData.success) {
            navigate('/booking/confirm', { state: { bookingId: confirmData.bookingId, pnr: confirmData.pnr } });
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: auth.currentUser?.displayName || '',
          email: contactInfo.email,
          contact: contactInfo.phone
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-[#F97316] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Details
          </button>
          <div className="bg-[#1a1000] text-[#F97316] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-[#92400e]">
            <Clock className="w-4 h-4" /> Time left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-[#111111] p-10 rounded-[40px] border border-[#2a2a2a] shadow-2xl space-y-10 transition-colors">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#1a1000] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#92400e]">
              <CreditCard className="w-8 h-8 text-[#F97316]" />
            </div>
            <h2 className="text-3xl font-bold text-white">Secure Payment</h2>
            <p className="text-slate-400">Complete your booking by paying securely via Razorpay</p>
          </div>

          <div className="p-8 bg-[#1a1a1a] rounded-3xl border border-[#2a2a2a] space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total Amount to Pay</span>
              <span className="text-4xl font-bold text-white">₹{fare.total}</span>
            </div>
            <div className="border-t border-[#2a2a2a] pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Bus Type</span>
                <span className="text-white font-bold">{bus.busType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Selected Seats</span>
                <span className="text-[#F97316] font-bold">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Travel Date</span>
                <span className="text-white font-bold">{travelDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handlePayment}
              disabled={isProcessing || timeLeft <= 0}
              className="w-full bg-[#F97316] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#ea6c05] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#F97316]/20 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${fare.total}`} <Lock className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" /> 256-bit SSL Secure Transaction
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: CheckCircle2, label: 'Instant Confirmation' },
            { icon: CheckCircle2, label: 'E-Ticket on WhatsApp' },
            { icon: CheckCircle2, label: 'Easy Cancellation' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-5 bg-[#111111] rounded-2xl border border-[#2a2a2a] transition-colors">
              <item.icon className="w-5 h-5 text-[#F97316]" />
              <span className="text-sm font-bold text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
