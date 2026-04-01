import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, Moon, Sun, Globe, User, LogOut, Ticket, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-hero p-2 rounded-xl">
            <Bus className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">RedBus Elite</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/bus-tickets" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.busTickets')}
          </Link>
          <Link to="/railways" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.trainTickets')}
          </Link>
          <Link to="/stories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.stories')}
          </Link>
          <Link to="/community" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Community
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.myBookings')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><Globe className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map(l => (
                <DropdownMenuItem key={l.code} onClick={() => i18n.changeLanguage(l.code)}
                  className={i18n.language === l.code ? 'bg-accent' : ''}>
                  {l.flag} {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">{user?.name}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" /> {t('nav.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
                  <Ticket className="h-4 w-4 mr-2" /> {t('nav.myBookings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <BarChart3 className="h-4 w-4 mr-2" /> Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>
                  <LogOut className="h-4 w-4 mr-2" /> {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} className="gradient-hero text-primary-foreground" size="sm">
              {t('nav.login')}
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-3 space-y-2">
          <Link to="/bus-tickets" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>{t('nav.busTickets')}</Link>
          <Link to="/railways" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>{t('nav.trainTickets')}</Link>
          <Link to="/stories" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>{t('nav.stories')}</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>{t('nav.myBookings')}</Link>
          )}
        </div>
      )}
    </nav>
  );
}
