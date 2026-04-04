import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bus, Map, ClipboardList, Users, Star, BookOpen, Tag, Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout({ admin }: { admin: any }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Buses', path: '/admin/buses', icon: Bus },
    { name: 'Routes', path: '/admin/routes', icon: Map },
    { name: 'Bookings', path: '/admin/bookings', icon: ClipboardList },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Stories', path: '/admin/stories', icon: BookOpen },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'My Profile', path: '/admin/profile', icon: User },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex flex-col border-r border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Bus className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">TravelBus Admin</span>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
