import { Outlet, useLocation } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'motion/react';

export default function UserLayout({ user, role }: { user: any; role: string | null }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans transition-colors">
      <UserNavbar user={user} role={role} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
