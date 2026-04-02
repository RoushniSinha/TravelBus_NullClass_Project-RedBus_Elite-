import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Mail, Phone, Globe, Shield, LogOut, Camera, Star, ClipboardList, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', bio: '' });

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser(data);
          setFormData({ name: data.name || '', phone: data.phone || '', bio: data.bio || '' });
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'users', auth.currentUser.uid), formData);
    setUser({ ...user, ...formData });
    setEditing(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-80 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white shadow-lg">
                {user?.name?.[0] || user?.email?.[0].toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-blue-700 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-400 font-medium">{user?.email}</p>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">12</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bookings</div>
              </div>
              <div className="w-px bg-slate-100"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">5</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stories</div>
              </div>
              <div className="w-px bg-slate-100"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">4.8</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
              </div>
            </div>
          </div>

          <nav className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-1">
            {[
              { label: 'My Profile', icon: User, active: true },
              { label: 'My Bookings', icon: ClipboardList },
              { label: 'Travel Stories', icon: BookOpen },
              { label: 'Settings', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900">Personal Information</h3>
              {!editing && (
                <button 
                  onClick={() => setEditing(true)}
                  className="text-sm font-bold text-blue-600 hover:underline uppercase tracking-widest"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="tel" 
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">About You</label>
                <textarea 
                  disabled={!editing}
                  rows={4}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all resize-none"
                  placeholder="Tell us about your travel style..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              {editing && (
                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xl font-bold">Elite Membership</h4>
              <p className="text-slate-400 text-sm">You are a Gold Member. Enjoy exclusive benefits on every booking.</p>
            </div>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all whitespace-nowrap">
              View Benefits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
