import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bus, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) { toast({ title: 'Error', description: 'Fill all fields', variant: 'destructive' }); return; }
    setLoading(true);
    try { await login(loginEmail, loginPass); toast({ title: 'Welcome back!' }); navigate('/'); } catch { toast({ title: 'Login failed', variant: 'destructive' }); } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) { toast({ title: 'Error', description: 'Fill all fields', variant: 'destructive' }); return; }
    setLoading(true);
    try { await register({ name: regName, email: regEmail, password: regPass }); toast({ title: 'Account created!' }); navigate('/'); } catch { toast({ title: 'Registration failed', variant: 'destructive' }); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="gradient-hero p-2 rounded-xl"><Bus className="h-6 w-6 text-primary-foreground" /></div>
            <span className="text-2xl font-display font-bold text-gradient">RedBus Elite</span>
          </Link>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader><CardTitle className="text-center font-display text-2xl">{t('hero.tagline')}</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="w-full"><TabsTrigger value="login" className="flex-1">{t('auth.login')}</TabsTrigger><TabsTrigger value="register" className="flex-1">{t('auth.register')}</TabsTrigger></TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div><Label>{t('auth.email')}</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" className="pl-10" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></div></div>
                  <div><Label>{t('auth.password')}</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type={showPass ? 'text' : 'password'} className="pl-10 pr-10" value={loginPass} onChange={e => setLoginPass(e.target.value)} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                  <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground">{loading ? t('common.loading') : t('auth.login')}</Button>
                  <Button type="button" variant="outline" className="w-full">{t('auth.google')}</Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div><Label>{t('auth.name')}</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-10" value={regName} onChange={e => setRegName(e.target.value)} /></div></div>
                  <div><Label>{t('auth.email')}</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" className="pl-10" value={regEmail} onChange={e => setRegEmail(e.target.value)} /></div></div>
                  <div><Label>{t('auth.phone')}</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-10" value={regPhone} onChange={e => setRegPhone(e.target.value)} /></div></div>
                  <div><Label>{t('auth.password')}</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" className="pl-10" value={regPass} onChange={e => setRegPass(e.target.value)} /></div></div>
                  <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground">{loading ? t('common.loading') : t('auth.register')}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
