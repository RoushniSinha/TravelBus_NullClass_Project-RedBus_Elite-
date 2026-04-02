import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, Star, Bus, ArrowRight, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Query for global notifications OR notifications specific to this user
    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', ['all', auth.currentUser.uid]),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    const batch = writeBatch(db);
    unread.forEach(n => {
      batch.update(doc(db, 'notifications', n.id), { read: true });
    });
    await batch.commit();
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 font-medium">Stay updated with your bookings and community activity.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-blue-600 hover:underline uppercase tracking-widest"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400 italic">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white p-6 rounded-3xl border shadow-sm flex gap-6 group transition-all cursor-pointer ${
                n.read ? 'border-slate-100 opacity-75' : 'border-blue-200 bg-blue-50/30'
              }`}
              onClick={() => !n.read && updateDoc(doc(db, 'notifications', n.id), { read: true })}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                n.type === 'success' ? 'bg-green-50 text-green-600' :
                n.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                n.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {n.type === 'success' ? <CheckCircle className="w-6 h-6" /> :
                 n.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> :
                 n.type === 'error' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-slate-900 group-hover:text-blue-600 transition-colors ${!n.read ? 'text-blue-900' : ''}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{n.message}</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="p-2 text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 transition-all" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
