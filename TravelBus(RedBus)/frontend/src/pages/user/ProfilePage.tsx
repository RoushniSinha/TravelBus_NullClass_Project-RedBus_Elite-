import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { User as UserIcon, Mail, Phone, Globe, Shield, LogOut, Camera, Star, ClipboardList, BookOpen, Bell, Lock, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    preferredLang: 'en',
    notificationPreferences: {
      email: true,
      sms: true,
      push: true,
      promotions: false
    }
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser(data);
        setFormData({ 
          name: data.name || '', 
          phone: data.phone || '', 
          preferredLang: data.preferredLang || 'en',
          notificationPreferences: data.notificationPreferences || {
            email: true,
            sms: true,
            push: true,
            promotions: false
          }
        });
      }

      // Fetch Reviews
      const reviewsQuery = query(collection(db, 'reviews'), where('userId', '==', auth.currentUser.uid));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), formData);
      
      // Update MongoDB
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: auth.currentUser.uid, ...formData })
      });

      // Update i18n if language changed
      if (formData.preferredLang !== i18n.language) {
        i18n.changeLanguage(formData.preferredLang);
        localStorage.setItem('rb_lang', formData.preferredLang);
      }

      setUser({ ...user, ...formData });
      setEditing(false);
      alert(t('profile.save_success', 'Profile updated successfully!'));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(t('profile.save_error', 'Failed to update profile.'));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    // Mock Cloudinary Upload
    // In a real app, you'd use a FormData and fetch to Cloudinary
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      // For demo, we'll just store the base64 or a mock URL
      const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid}`;
      
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), { avatar: mockUrl });
      setUser({ ...user, avatar: mockUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t('profile.delete_confirm'))) return;
    
    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid));
        await auth.currentUser.delete();
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Please re-authenticate to delete your account.");
    }
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { id: 'personal', label: t('profile.personal_info'), icon: UserIcon },
    { id: 'notifications', label: t('profile.notifications'), icon: Bell },
    { id: 'security', label: t('profile.security'), icon: Shield },
    { id: 'reviews', label: t('profile.my_reviews'), icon: Star },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-6 transition-colors">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-bold border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0] || user?.email?.[0].toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 hover:bg-blue-700 transition-all cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-slate-400 font-medium">{user?.email}</p>
            </div>
          </div>

          <nav className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-1 transition-colors">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors"
            >
              {activeTab === 'personal' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('profile.personal_info')}</h3>
                    {!editing && (
                      <button 
                        onClick={() => setEditing(true)}
                        className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest"
                      >
                        {t('profile.edit_profile')}
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t('profile.full_name')}</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="text" 
                            disabled={!editing}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t('profile.email')}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="email" 
                            disabled
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white opacity-60 cursor-not-allowed"
                            value={user?.email || ''}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t('profile.phone')}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="tel" 
                            disabled={!editing}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Preferred Language</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <select 
                            disabled={!editing}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all appearance-none"
                            value={formData.preferredLang}
                            onChange={(e) => setFormData({ ...formData, preferredLang: e.target.value })}
                          >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="mr">मराठी (Marathi)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {editing && (
                      <div className="flex gap-4">
                        <button 
                          type="submit"
                          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                        >
                          {t('profile.save_changes')}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setEditing(false)}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                          {t('profile.cancel')}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('profile.notifications')}</h3>
                  <div className="space-y-6">
                    {[
                      { id: 'email', label: 'Email Notifications', desc: 'Receive booking confirmations and updates via email.' },
                      { id: 'sms', label: 'SMS Notifications', desc: 'Get real-time trip alerts and PNR details on your phone.' },
                      { id: 'push', label: 'Push Notifications', desc: 'Stay updated with app alerts and live tracking info.' },
                      { id: 'promotions', label: 'Promotional Offers', desc: 'Be the first to know about discounts and elite deals.' },
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900 dark:text-white">{pref.label}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{pref.desc}</div>
                        </div>
                        <button 
                          onClick={() => {
                            const newPrefs = { ...formData.notificationPreferences, [pref.id]: !formData.notificationPreferences[pref.id as keyof typeof formData.notificationPreferences] };
                            setFormData({ ...formData, notificationPreferences: newPrefs });
                            // Auto-save for notifications
                            updateDoc(doc(db, 'users', auth.currentUser!.uid), { notificationPreferences: newPrefs });
                          }}
                          className={`w-14 h-8 rounded-full relative transition-all ${
                            formData.notificationPreferences[pref.id as keyof typeof formData.notificationPreferences] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            formData.notificationPreferences[pref.id as keyof typeof formData.notificationPreferences] ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('profile.security')}</h3>
                    
                    {/* Change Password */}
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-6">
                      <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                        <Lock className="w-5 h-5 text-blue-600" />
                        {t('profile.change_password')}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('profile.old_password')}</label>
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('profile.new_password')}</label>
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all">
                        Update Password
                      </button>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Active Sessions
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">Chrome on MacOS</div>
                            <div className="text-xs text-slate-500">Mumbai, India • Active now</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">Current</div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-[32px] border border-red-100 dark:border-red-900/20 space-y-4">
                        <div className="flex items-center gap-3 text-red-600 font-bold">
                          <Trash2 className="w-5 h-5" />
                          {t('profile.delete_account')}
                        </div>
                        <p className="text-sm text-red-500/80">Once you delete your account, there is no going back. Please be certain.</p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/10"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('profile.my_reviews')}</h3>
                  {reviews.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Star className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't shared any travel experiences yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900 dark:text-white">{review.busName || 'Elite Express'}</div>
                              <div className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              <Star className="w-3 h-3 fill-current" /> {review.rating}
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
