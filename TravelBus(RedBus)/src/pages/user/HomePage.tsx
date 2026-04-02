import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Star, Shield, Clock, Bus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  const features = [
    { icon: Star, title: 'Elite Experience', desc: 'Premium buses with high EliteScore ratings for comfort and cleanliness.' },
    { icon: Shield, title: 'Safe Travel', desc: 'Verified operators and real-time tracking for your safety.' },
    { icon: Clock, title: 'Punctual', desc: 'We value your time. Our buses are known for their on-time performance.' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000" 
            alt="Bus travel" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Travel the <span className="text-blue-400">Elite</span> Way
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-200 max-w-2xl mx-auto"
          >
            Book premium bus tickets across India with real-time tracking and elite comfort.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="From City" 
                  className="bg-transparent border-none w-full focus:ring-0 font-medium"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
              <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="To City" 
                  className="bg-transparent border-none w-full focus:ring-0 font-medium"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
              <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="text-slate-400 w-5 h-5" />
                <input 
                  type="date" 
                  className="bg-transparent border-none w-full focus:ring-0 font-medium"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" /> Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose TravelBus?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">We redefine bus travel with premium services and modern technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Routes</h2>
            <p className="text-slate-500">Most traveled routes by our elite members.</p>
          </div>
          <button className="text-blue-600 font-bold hover:underline">View All Routes</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { from: 'Mumbai', to: 'Pune', price: '499', img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=800' },
            { from: 'Delhi', to: 'Agra', price: '899', img: 'https://images.unsplash.com/photo-1564507592333-c60657451ddc?auto=format&fit=crop&q=80&w=800' },
            { from: 'Bangalore', to: 'Chennai', price: '799', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800' },
            { from: 'Hyderabad', to: 'Bangalore', price: '1299', img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800' },
          ].map((route, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={route.img} 
                alt={`${route.from} to ${route.to}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <div className="text-white font-bold text-lg">{route.from} → {route.to}</div>
                <div className="text-blue-400 font-medium">Starting from ₹{route.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
