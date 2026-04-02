import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, Bus } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.exists() ? userDoc.data().role : (user.email === "rsdivinelight11@gmail.com" ? 'admin' : 'user');
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin accounts only.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user is admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.exists() ? userDoc.data().role : (user.email === "rsdivinelight11@gmail.com" ? 'admin' : 'user');
      
      if (role === 'admin') {
        // Ensure admin doc exists
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString()
          });
        }
        navigate('/admin');
      } else {
        setError('Access denied. Admin accounts only.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1e1e2e] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
          <div className="p-10 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
              <p className="text-slate-400 font-medium">TravelBus Control Centre</p>
            </div>

            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-900/30">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 bg-[#161625] border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="admin@travelbus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="password" 
                    className="w-full pl-12 pr-4 py-4 bg-[#161625] border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/20"
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'} <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1e1e2e] px-4 text-slate-500 font-bold">Or</span></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleAdminLogin}
                disabled={loading}
                className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Admin Google Login
              </button>
            </form>

            <div className="pt-6 border-t border-slate-800 text-center">
              <Link to="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
                <Bus className="w-4 h-4" /> Back to TravelBus
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
