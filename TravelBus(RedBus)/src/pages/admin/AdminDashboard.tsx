import { useState, useEffect } from 'react';
import { Users, Bus, ClipboardList, TrendingUp, Star, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    buses: 0,
    bookings: 0,
    revenue: 0,
    reviews: 0,
    stories: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const busesSnap = await getDocs(collection(db, 'buses'));
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        
        let totalRevenue = 0;
        bookingsSnap.forEach(doc => {
          totalRevenue += doc.data().totalFare || 0;
        });

        setStats({
          users: usersSnap.size,
          buses: busesSnap.size,
          bookings: bookingsSnap.size,
          revenue: totalRevenue,
          reviews: 0, // Mock
          stories: 0  // Mock
        });

        const recentQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentBookings(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpiCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'blue' },
    { title: 'Total Bookings', value: stats.bookings, icon: ClipboardList, color: 'green' },
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'purple' },
    { title: 'Active Buses', value: stats.buses, icon: Bus, color: 'amber' },
    { title: 'Pending Reviews', value: stats.reviews, icon: Star, color: 'pink' },
    { title: 'Pending Stories', value: stats.stories, icon: BookOpen, color: 'indigo' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${card.color}-50 text-${card.color}-600`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</div>
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Bookings</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">PNR</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No recent bookings</td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{booking.pnr}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{booking.fromCity} → {booking.toCity}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{booking.totalFare}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-bold transition-all flex items-center justify-between group">
              <span>Add New Bus</span>
              <Bus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl font-bold transition-all flex items-center justify-between group">
              <span>Send Notification</span>
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl font-bold transition-all flex items-center justify-between group">
              <span>Create Coupon</span>
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="pt-8 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">System Status</div>
            <div className="flex items-center gap-3 text-sm font-medium text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
