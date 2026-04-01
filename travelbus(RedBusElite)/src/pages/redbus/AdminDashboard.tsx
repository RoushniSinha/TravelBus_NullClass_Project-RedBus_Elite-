import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Users, Bus, MapPin, CreditCard, Star, BookOpen, Ticket, TrendingUp, Activity, Bell, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/redbus/Navbar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Bookings', value: '2,847', icon: Ticket, change: '+12%' },
  { label: 'Revenue', value: '₹18.5L', icon: TrendingUp, change: '+8%' },
  { label: 'Active Buses', value: '156', icon: Bus, change: '+3' },
  { label: 'Users', value: '12,450', icon: Users, change: '+156' },
  { label: 'Avg EliteScore', value: '4.2', icon: Star, change: '+0.1' },
];

const bookingTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`, bookings: 60 + Math.floor(Math.random() * 80), revenue: 40000 + Math.floor(Math.random() * 60000),
}));

const topRoutes = [
  { route: 'Delhi→Agra', bookings: 342 }, { route: 'Mumbai→Pune', bookings: 298 },
  { route: 'Blr→Chennai', bookings: 256 }, { route: 'Hyd→Vjwd', bookings: 198 },
  { route: 'Delhi→Jaipur', bookings: 187 },
];

const statusDist = [
  { name: 'Confirmed', value: 68, color: 'hsl(var(--primary))' },
  { name: 'Cancelled', value: 18, color: 'hsl(var(--destructive))' },
  { name: 'Completed', value: 14, color: 'hsl(var(--muted-foreground))' },
];

const recentBookings = [
  { pnr: 'RBE7K2M1N', route: 'Delhi → Agra', amount: 850, status: 'CONFIRMED' },
  { pnr: 'RBEX9P3Q2', route: 'Mumbai → Pune', amount: 650, status: 'CONFIRMED' },
  { pnr: 'RBE3T8R5S', route: 'Bangalore → Chennai', amount: 1200, status: 'CANCELLED' },
  { pnr: 'RBEW4U6V7', route: 'Hyderabad → Vijayawada', amount: 780, status: 'CONFIRMED' },
  { pnr: 'RBE1Y9Z8A', route: 'Delhi → Jaipur', amount: 950, status: 'CONFIRMED' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const sidebar = [
    { key: 'overview', label: 'Overview', icon: BarChart3, path: '' },
    { key: 'bookings', label: 'Bookings', icon: Ticket, path: '/admin/bookings' },
    { key: 'fleet', label: 'Fleet', icon: Bus, path: '/admin/buses' },
    { key: 'routes', label: 'Routes', icon: MapPin, path: '/admin/routes' },
    { key: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { key: 'reviews', label: 'Reviews', icon: Star, path: '/admin/reviews' },
    { key: 'stories', label: 'Stories', icon: BookOpen, path: '/admin/stories' },
    { key: 'coupons', label: 'Coupons', icon: Tag, path: '/admin/coupons' },
    { key: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ];

  const handleNav = (item: typeof sidebar[0]) => {
    if (item.path) navigate(item.path);
    else setActiveTab(item.key);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <aside className="hidden lg:block w-56 border-r border-border bg-card h-[calc(100vh-4rem)] sticky top-16 p-4">
          <h2 className="font-display font-bold text-sm text-muted-foreground mb-4">ADMIN</h2>
          {sidebar.map(item => (
            <button key={item.key} onClick={() => handleNav(item)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${activeTab === item.key && !item.path ? 'gradient-hero text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6">
          <div className="lg:hidden mb-4">
            <Tabs value={activeTab} onValueChange={v => {
              const item = sidebar.find(s => s.key === v);
              if (item?.path) navigate(item.path);
              else setActiveTab(v);
            }}>
              <TabsList className="flex-wrap h-auto">{sidebar.map(s => <TabsTrigger key={s.key} value={s.key} className="text-xs">{s.label}</TabsTrigger>)}</TabsList>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.map((s, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-display font-bold">{s.value}</p>
                      </div>
                      <div className="gradient-hero w-10 h-10 rounded-lg flex items-center justify-center">
                        <s.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <Badge className="mt-2 bg-primary/10 text-primary text-xs">{s.change}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="font-display text-sm">Bookings Trend (30 days)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={bookingTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="font-display text-sm">Top Routes</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={topRoutes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="route" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader><CardTitle className="font-display text-sm">Booking Status</CardTitle></CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                        {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle className="font-display text-sm">Recent Bookings</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentBookings.map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium">{b.pnr}</p>
                          <p className="text-xs text-muted-foreground">{b.route}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">₹{b.amount}</p>
                          <Badge className={b.status === 'CONFIRMED' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}>{b.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Activity */}
            <Card>
              <CardHeader><CardTitle className="font-display text-sm flex items-center gap-2"><Activity className="h-4 w-4" /> Live Activity</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">• New booking RBE9X2K — Delhi → Agra — ₹850 — 2 min ago</p>
                  <p className="text-muted-foreground">• User registered — priya@email.com — 5 min ago</p>
                  <p className="text-muted-foreground">• Booking cancelled RBEW4V — Mumbai → Pune — 8 min ago</p>
                  <p className="text-muted-foreground">• New review — ★4.5 — VRL Travels — 12 min ago</p>
                  <p className="text-muted-foreground">• Story approved — "My Goa Trip" by Rahul S. — 15 min ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
