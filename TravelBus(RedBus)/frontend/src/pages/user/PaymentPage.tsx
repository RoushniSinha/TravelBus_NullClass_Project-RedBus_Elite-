import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, ArrowLeft, Clock, Lock, CheckCircle2, Smartphone } from 'lucide-react';
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
    bookingId,
    razorpayOrderId,
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
  const [paymentMethod, setPaymentMethod] = useState('upi');
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

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: Math.round(fare.total * 100),
      currency: 'INR',
      name: 'RedBus Elite',
      description: `${bus.fromCity} → ${bus.toCity}`,
      order_id: razorpayOrderId,
      handler: async (response: any) => {
        try {
          const confirmRes = await fetch('/api/bookings/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            })
          });

          const confirmData = await confirmRes.json();
          if (confirmData.success) {
            navigate('/booking/confirm', { 
              state: { 
                bookingId: confirmData.bookingId, 
                pnr: confirmData.pnr,
                bus,
                selectedSeats,
                travelDate,
                passengers,
                fare
              },
              replace: true
            });
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Confirmation error:", error);
          alert("An error occurred during confirmation.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: passengers[0]?.name || '',
        email: contactInfo.email,
        contact: `+91${contactInfo.phone}`
      },
      theme: {
        color: '#F97316'
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-red-600 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Details
            </button>
          </div>
          
          <div className="bg-orange-50 text-orange-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-between border border-orange-200 shadow-lg shadow-orange-100/20">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 animate-pulse" />
              <span>Seats locked for: <span className="text-xl ml-1">{formatTime(timeLeft)}</span></span>
            </div>
            <span className="text-[10px] uppercase tracking-widest opacity-70">Complete payment before time runs out</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-2xl space-y-8">
              <h2 className="text-2xl font-bold text-slate-900">Select Payment Method</h2>
              
              <div className="space-y-4">
                {/* UPI Option */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-6 ${
                    paymentMethod === 'upi' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-red-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'upi' && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">UPI (GPay, PhonePe, Paytm)</h4>
                    <p className="text-xs text-slate-500 font-medium">Pay instantly using your UPI ID</p>
                  </div>
                </div>

                {/* Card Option */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-6 ${
                    paymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-red-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Credit / Debit Card</h4>
                    <p className="text-xs text-slate-500 font-medium">All major cards supported</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing || timeLeft <= 0}
                  className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/20 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${fare.total}`} <Lock className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-96 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900">Fare Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Base Fare ({selectedSeats.length} Seats)</span>
                  <span className="text-slate-900 font-bold">₹{fare.base}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Taxes & Fees</span>
                  <span className="text-slate-900 font-bold">₹{fare.tax}</span>
                </div>
                {fare.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Coupon Discount</span>
                    <span className="font-bold">-₹{fare.discount}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-red-600">₹{fare.total}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Secured by Razorpay</p>
                    <p className="text-[9px] font-medium">256-bit SSL encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: CheckCircle2, label: 'Instant Confirmation' },
            { icon: CheckCircle2, label: 'E-Ticket on WhatsApp' },
            { icon: CheckCircle2, label: 'Easy Cancellation' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-slate-200 transition-colors">
              <item.icon className="w-5 h-5 text-red-600" />
              <span className="text-sm font-bold text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
