import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, writeBatch } from 'firebase/firestore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const location = useLocation();
  const { bus, selectedSeats, passengers, contact } = location.state || {};
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = (selectedSeats?.length * bus?.price * 1.05).toFixed(2);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order on Backend
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(totalAmount) })
      });
      
      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Should be in VITE_ env for frontend
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'TravelBus Elite',
        description: `Booking for ${bus.fromCity} to ${bus.toCity}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Payment Success Handler
          await completeBooking(response.razorpay_payment_id);
        },
        prefill: {
          name: contact.name || auth.currentUser?.displayName,
          email: contact.email || auth.currentUser?.email,
          contact: contact.phone,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
      setLoading(false);
    }
  };

  const completeBooking = async (paymentId: string) => {
    try {
      const pnr = 'RBE' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const bookingData = {
        userId: auth.currentUser?.uid,
        busId: bus.id,
        busType: bus.busType,
        fromCity: bus.fromCity,
        toCity: bus.toCity,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        pnr,
        passengers,
        contact,
        totalFare: parseFloat(totalAmount),
        status: 'CONFIRMED',
        paymentId,
        createdAt: new Date().toISOString()
      };

      // Use a batch to update seats and create booking
      const batch = writeBatch(db);
      
      // 1. Create Booking
      const bookingRef = doc(collection(db, 'bookings'));
      batch.set(bookingRef, bookingData);

      // 2. Update Seats to 'booked'
      selectedSeats.forEach((seatId: string) => {
        const seatRef = doc(db, 'buses', bus.id, 'seats', seatId);
        batch.update(seatRef, {
          status: 'booked',
          lockedBy: null,
          lockedAt: null
        });
      });

      await batch.commit();

      // Send SMS Confirmation via Backend API
      try {
        const smsMessage = `Elite TravelBus: Booking Confirmed! PNR: ${pnr}. ${bus.fromCity} to ${bus.toCity} on ${bus.departureTime}. Have a safe journey!`;
        await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contact.phone,
            message: smsMessage
          })
        });
      } catch (smsError) {
        console.warn("Failed to send SMS confirmation:", smsError);
      }

      // Add Notification for user
      try {
        await addDoc(collection(db, 'notifications'), {
          userId: auth.currentUser?.uid,
          title: 'Booking Confirmed!',
          message: `Your journey from ${bus.fromCity} to ${bus.toCity} is confirmed. PNR: ${pnr}`,
          type: 'success',
          read: false,
          createdAt: new Date().toISOString()
        });
      } catch (notifError) {
        console.warn("Failed to create notification:", notifError);
      }

      navigate('/booking/confirm', { state: { booking: { id: bookingRef.id, ...bookingData } } });
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Error confirming booking. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  if (!bus || !selectedSeats) return <div className="p-20 text-center">Invalid booking state</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Secure Payment</h1>
          <p className="text-slate-500">Choose your payment method and complete your booking</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
          <div className="flex justify-between items-center pb-8 border-b border-slate-50">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</div>
              <div className="text-4xl font-bold text-slate-900">₹{totalAmount}</div>
            </div>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-bold">Secure SSL</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Payment Methods</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                { id: 'upi', name: 'UPI / GPay / PhonePe', icon: CheckCircle },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <label key={method.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-blue-200 cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-slate-700">{method.name}</span>
                    </div>
                    <input type="radio" name="payment" className="w-5 h-5 text-blue-600 focus:ring-blue-500" defaultChecked={method.id === 'card'} />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium justify-center">
              <Lock className="w-3 h-3" /> 256-bit AES Encryption
            </div>
            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/10"
            >
              {loading ? 'Processing Payment...' : `Pay ₹${totalAmount}`} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-8 opacity-40 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6" />
        </div>
      </div>
    </div>
  );
}
