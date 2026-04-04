import { useState, useEffect } from 'react';
import { Users, Bus, ClipboardList, TrendingUp, Star, BookOpen, ArrowUpRight, ArrowDownRight, Bell, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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

  // Mock chart data
  const chartData = [
    { name: 'Mon', revenue: 4000, bookings: 24 },
    { name: 'Tue', revenue: 3000, bookings: 18 },
    { name: 'Wed', revenue: 2000, bookings: 12 },
    { name: 'Thu', revenue: 2780, bookings: 20 },
    { name: 'Fri', revenue: 1890, bookings: 15 },
    { name: 'Sat', revenue: 2390, bookings: 25 },
    { name: 'Sun', revenue: 3490, bookings: 30 },
  ];

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
    { title: 'Total Users', value: stats.users, icon: Users, color: 'blue', trend: '+12%' },
    { title: 'Total Bookings', value: stats.bookings, icon: ClipboardList, color: 'green', trend: '+8%' },
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'purple', trend: '+24%' },
    { title: 'Active Buses', value: stats.buses, icon: Bus, color: 'amber', trend: 'Stable' },
    { title: 'Pending Reviews', value: stats.reviews, icon: Star, color: 'pink', trend: '-2%' },
    { title: 'Pending Stories', value: stats.stories, icon: BookOpen, color: 'indigo', trend: '+5%' },
  ];

  return (
    <div className="space-y-10 bg-slate-50 min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-600`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  card.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 
                  card.trend.startsWith('-') ? 'bg-red-50 text-red-600' : 
                  'bg-slate-50 text-slate-600'
                }`}>
                  {card.trend}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</div>
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-colors space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Revenue Analytics</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div> Revenue
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-colors space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Booking Trends</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div> Bookings
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#1e293b' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Bar dataKey="bookings" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-colors">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Bookings</h3>
            <button className="text-xs font-bold text-red-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">PNR</th>
                  <th className="px-8 py-4">Route</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 transition-colors">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">No recent bookings</td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 font-bold text-slate-900">{booking.pnr}</td>
                      <td className="px-8 py-4 text-sm text-slate-500 font-medium">{booking.fromCity} → {booking.toCity}</td>
                      <td className="px-8 py-4 font-bold text-slate-900">₹{booking.totalFare}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}>
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
        <div className="bg-white rounded-[40px] p-10 text-slate-900 space-y-8 border border-slate-100 shadow-xl">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl font-bold transition-all flex items-center justify-between group shadow-lg shadow-red-900/20">
              <span>Add New Bus</span>
              <Bus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full bg-slate-100 hover:bg-slate-200 p-5 rounded-2xl font-bold transition-all flex items-center justify-between group text-slate-700">
              <span>Send Notification</span>
              <Bell className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full bg-slate-100 hover:bg-slate-200 p-5 rounded-2xl font-bold transition-all flex items-center justify-between group text-slate-700">
              <span>Create Coupon</span>
              <Tag className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="pt-8 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Status</div>
            <div className="flex items-center gap-3 text-sm font-medium text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
