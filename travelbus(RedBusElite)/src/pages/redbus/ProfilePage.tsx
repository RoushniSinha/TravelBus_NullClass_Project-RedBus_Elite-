import { useTranslation } from 'react-i18next';
import { User, Bell, Globe, Moon, Sun, Monitor, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' }, { code: 'ta', label: 'தமிழ்' }, { code: 'mr', label: 'मराठी' },
];

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-2xl">
        <h1 className="text-2xl font-display font-bold mb-6">{t('profile.title')}</h1>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="gradient-hero w-16 h-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg">{user?.name || 'Guest'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>{t('auth.name')}</Label><Input defaultValue={user?.name} /></div>
              <div><Label>{t('auth.email')}</Label><Input defaultValue={user?.email} /></div>
            </div>
            <Button className="mt-3 gradient-hero text-primary-foreground" onClick={() => toast({ title: 'Profile saved!' })}>{t('common.save')}</Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4" /> {t('profile.language')}</h3>
            <Select value={i18n.language} onValueChange={lng => i18n.changeLanguage(lng)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{languages.map(l => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">{t('profile.theme')}</h3>
            <div className="flex gap-2">
              {([['light', Sun], ['dark', Moon], ['system', Monitor]] as const).map(([t2, Icon]) => (
                <Button key={t2} variant={theme === t2 ? 'default' : 'outline'} size="sm"
                  className={theme === t2 ? 'gradient-hero text-primary-foreground' : ''}
                  onClick={() => setTheme(t2)}>
                  <Icon className="h-4 w-4 mr-1" /> {t2.charAt(0).toUpperCase() + t2.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Bell className="h-4 w-4" /> {t('profile.notifications')}</h3>
            <div className="space-y-3">
              {['Email notifications', 'SMS notifications', 'Push notifications'].map(n => (
                <div key={n} className="flex items-center justify-between">
                  <Label>{n}</Label><Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><MapPin className="h-4 w-4" /> {t('profile.stats')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-2xl font-display font-bold text-primary">12</p>
                <p className="text-xs text-muted-foreground">{t('profile.totalTrips')}</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-2xl font-display font-bold text-primary">₹24,500</p>
                <p className="text-xs text-muted-foreground">{t('profile.amountSpent')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RedFooter />
    </div>
  );
}
