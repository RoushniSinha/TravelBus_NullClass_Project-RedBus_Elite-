import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ArrowRight, Shield, Bus } from 'lucide-react';
import { motion } from 'motion/react';

export default function PassengerDetailsPage() {
  const location = useLocation();
  const { bus, selectedSeats } = location.state || {};
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState(
    selectedSeats?.map((seat: string) => ({ seat, name: '', age: '', gender: 'male' })) || []
  );
  const [contact, setContact] = useState({ email: '', phone: '' });

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/booking/payment', { state: { bus, selectedSeats, passengers, contact } });
  };

  if (!bus || !selectedSeats) return <div className="p-20 text-center">Invalid booking state</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-8">
          <form onSubmit={handleProceed} className="space-y-8">
            {/* Passenger Forms */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Passenger Details</h2>
              {passengers.map((p: any, i: number) => (
                <motion.div 
                  key={p.seat}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      {p.seat}
                    </div>
                    <span className="font-bold text-slate-900 uppercase tracking-wide">Passenger {i + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                        value={p.name}
                        onChange={(e) => handlePassengerChange(i, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Age</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="25"
                        value={p.age}
                        onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(i, 'gender', e.target.value)}
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="name@example.com"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="tel" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="+91 9876543210"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
            >
              Proceed to Payment <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:w-96 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Fare Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Base Fare ({selectedSeats.length} Seats)</span>
                <span className="text-slate-900 font-bold">₹{selectedSeats.length * bus.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Taxes & Fees</span>
                <span className="text-slate-900 font-bold">₹{(selectedSeats.length * bus.price * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-slate-900 font-bold">Total Amount</span>
                <span className="text-3xl font-bold text-blue-600">₹{(selectedSeats.length * bus.price * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-400 w-6 h-6" />
              <h3 className="text-lg font-bold">Secure Booking</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your data is encrypted and protected. We never share your personal information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
