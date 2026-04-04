import React, { memo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Bell, User, LogOut, Menu, X, Navigation, Sun, Moon, Globe, Check, Shield } from 'lucide-react';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

const UserNavbar = memo(({ user, role }: { user: any; role: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

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

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('rb_lang', code);
    setIsLangOpen(false);
    
    if (user) {
      fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, preferredLang: code })
      });
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Bus className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tighter">
                Travel<span className="text-red-600">Bus</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('nav.search')}</Link>
            <Link to="/live-tracking" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1">
              <Navigation className="w-4 h-4" /> {t('nav.live_tracking')}
            </Link>
            <Link to="/stories" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('nav.stories')}</Link>
            
            <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
              >
                <Globe className="h-5 w-5" />
                <span className="text-xs font-bold uppercase">{i18n.language}</span>
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        {i18n.language === lang.code && <Check className="w-4 h-4 text-red-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="text-slate-400 hover:text-red-600 relative p-2">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1.5 pr-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user.email?.[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.displayName?.split(' ')[0] || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                    <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <User className="h-4 w-4" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link to="/my-bookings" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Bus className="h-4 w-4" />
                      <span>{t('nav.my_bookings')}</span>
                    </Link>
                    {role === 'admin' && (
                      <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Shield className="h-4 w-4" />
                        <span>{t('nav.admin')}</span>
                      </Link>
                    )}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('nav.login')}</Link>
                <Link to="/register" className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/10">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-400">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              <Link to="/search" className="block px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">{t('nav.search')}</Link>
              <Link to="/stories" className="block px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">{t('nav.stories')}</Link>
              <Link to="/live-tracking" className="block px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">{t('nav.live_tracking')}</Link>
              
              <div className="h-px bg-slate-100 my-4"></div>
              
              <div className="px-4 py-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Language</div>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold border transition-all ${
                        i18n.language === lang.code 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-white border-slate-100 text-slate-600'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <>
                  <div className="h-px bg-slate-100 my-4"></div>
                  <Link to="/profile" className="block px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">{t('nav.profile')}</Link>
                  <Link to="/my-bookings" className="block px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl">{t('nav.my_bookings')}</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl">{t('nav.logout')}</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link to="/login" className="flex items-center justify-center px-4 py-3 text-base font-bold text-slate-600 bg-slate-50 rounded-xl">{t('nav.login')}</Link>
                  <Link to="/register" className="flex items-center justify-center px-4 py-3 text-base font-bold text-white bg-red-600 rounded-xl">{t('nav.register')}</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export default UserNavbar;
