import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Bus, ArrowRight, Star, ShieldCheck, Clock, Users, MessageSquare, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-40"
            poster="https://picsum.photos/seed/bus/1920/1080"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-bus-traveling-on-a-highway-4402-small.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-background"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white">
              Travel with <span className="text-red-600">Elite</span> Comfort
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Premium bus travel experience across India. Book your journey in seconds.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-2xl flex flex-col md:flex-row gap-4 items-center transition-colors"
          >
            <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-red-600 transition-all">
              <MapPin className="w-5 h-5 text-red-600" />
              <input 
                type="text" 
                placeholder="From City" 
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-500 w-full"
              />
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-red-600 transition-all">
              <MapPin className="w-5 h-5 text-red-600" />
              <input 
                type="text" 
                placeholder="To City" 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-500 w-full"
              />
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-red-600 transition-all">
              <Calendar className="w-5 h-5 text-red-600" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-slate-900 font-bold w-full"
              />
            </div>
            <button 
              type="submit"
              className="bg-red-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 w-full md:w-auto"
            >
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Popular Routes</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Most traveled destinations by our community</p>
          </div>
          <Link to="/search" className="text-red-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-all">
            View All Routes <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { from: 'Patna', to: 'Delhi', price: '1250', image: 'patna' },
            { from: 'Mumbai', to: 'Pune', price: '499', image: 'mumbai' },
            { from: 'Delhi', to: 'Agra', price: '899', image: 'delhi' },
            { from: 'Bangalore', to: 'Chennai', price: '799', image: 'bangalore' }
          ].map((route, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              onClick={() => {
                navigate(`/search?from=${route.from}&to=${route.to}&date=${date}`);
              }}
              className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer group hover:border-red-600/50 transition-all shadow-sm"
            >
              <div className="h-48 relative">
                <img 
                  src={`https://picsum.photos/seed/${route.image}/600/400`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={route.from}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">Starting from</p>
                  <p className="text-2xl font-bold text-white">₹{route.price}</p>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{route.from} → {route.to}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Daily Service</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-600 group-hover:bg-red-600 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Elite Benefits Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-slate-900 dark:text-white">Why Choose <span className="text-red-600">Elite</span>?</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                We've redefined bus travel with a focus on punctuality, safety, and unmatched comfort. Experience the difference with our premium fleet.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: 'Verified Safety', desc: 'CCTV monitored and GPS tracked buses.' },
                { icon: Clock, title: 'Punctual Service', desc: '98% on-time departure and arrival rate.' },
                { icon: Star, title: 'Elite Ratings', desc: 'Highest rated bus operator in the region.' },
                { icon: Users, title: '24/7 Support', desc: 'Dedicated support team for your journey.' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 bg-red-900/20 rounded-xl flex items-center justify-center border border-red-900/50">
                    <item.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-800 rounded-[40px] blur-2xl opacity-20"></div>
            <div className="relative bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-200 dark:border-slate-700 space-y-8 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Elite Member Perks</h3>
              <div className="space-y-6">
                {[
                  'Complimentary snacks and water on every trip.',
                  'Priority boarding and seat selection.',
                  'Exclusive discounts on popular routes.',
                  'Free cancellation up to 24 hours before.'
                ].map((perk, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{perk}</p>
                  </div>
                ))}
              </div>
              <button className="w-full bg-slate-900 dark:bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-red-700 transition-all">
                Join Elite Club
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Traveler's Hub</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Connect with fellow travelers and share your experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/stories" className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-200 dark:border-slate-700 hover:border-red-600/50 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-900/50">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Travel Stories</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Read inspiring travel experiences and tips shared by our community members.
            </p>
          </Link>

          <Link to="/forum" className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border border-slate-200 dark:border-slate-700 hover:border-red-600/50 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-900/50">
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Community Forum</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Ask questions, get advice, and discuss everything about bus travel in India.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
