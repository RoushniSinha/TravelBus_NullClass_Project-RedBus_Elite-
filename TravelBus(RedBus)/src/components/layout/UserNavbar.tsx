import React, { memo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const UserNavbar = memo(({ user, role }: { user: any; role: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', ['all', user.uid]),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    }, (error) => {
      console.error("Error fetching unread count:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bus className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">TravelBus</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-slate-600 hover:text-blue-600 font-medium">Find Bus</Link>
            <Link to="/stories" className="text-slate-600 hover:text-blue-600 font-medium">Stories</Link>
            <Link to="/community" className="text-slate-600 hover:text-blue-600 font-medium">Community</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="text-slate-400 hover:text-blue-600 relative p-2">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.displayName?.[0] || user.email?.[0].toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/my-bookings" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Bus className="w-4 h-4" /> My Bookings
                    </Link>
                    {role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
          <Link to="/search" className="block text-slate-600 font-medium">Find Bus</Link>
          <Link to="/stories" className="block text-slate-600 font-medium">Stories</Link>
          <Link to="/community" className="block text-slate-600 font-medium">Community</Link>
          {user ? (
            <>
              <Link to="/notifications" className="block text-slate-600 font-medium flex items-center justify-between">
                Notifications
                {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className="block text-slate-600 font-medium">Profile</Link>
              <Link to="/my-bookings" className="block text-slate-600 font-medium">My Bookings</Link>
              <button onClick={handleLogout} className="block text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-slate-600 font-medium">Login</Link>
              <Link to="/register" className="block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
});

export default UserNavbar;
