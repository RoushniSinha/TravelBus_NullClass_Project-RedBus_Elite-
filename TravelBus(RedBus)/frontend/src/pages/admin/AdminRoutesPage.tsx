import React, { useState, useEffect } from 'react';
import { Map, Plus, Search, Edit2, Trash2, MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [newRoute, setNewRoute] = useState({
    fromCity: '',
    toCity: '',
    distance: '',
    duration: '',
    basePrice: 0,
    isActive: true
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'routes'));
    setRoutes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await updateDoc(doc(db, 'routes', editingRoute.id), {
          ...newRoute,
          basePrice: Number(newRoute.basePrice)
        });
      } else {
        await addDoc(collection(db, 'routes'), {
          ...newRoute,
          basePrice: Number(newRoute.basePrice),
          createdAt: new Date().toISOString()
        });
      }
      setShowModal(false);
      setEditingRoute(null);
      setNewRoute({ fromCity: '', toCity: '', distance: '', duration: '', basePrice: 0, isActive: true });
      fetchRoutes();
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  const handleEdit = (route: any) => {
    setEditingRoute(route);
    setNewRoute({
      fromCity: route.fromCity,
      toCity: route.toCity,
      distance: route.distance,
      duration: route.duration,
      basePrice: route.basePrice,
      isActive: route.isActive
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Route Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Define and manage travel routes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"
        >
          <Plus className="w-5 h-5" /> Add New Route
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search routes..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Distance/Duration</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <MapPin className="w-4 h-4 text-blue-500" /> {route.fromCity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <Navigation className="w-4 h-4 text-green-500" /> {route.toCity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{route.distance}</div>
                    <div className="text-xs text-slate-400">{route.duration}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{route.basePrice}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(route)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={async () => { if(confirm('Delete this route?')) { await deleteDoc(doc(db, 'routes', route.id)); fetchRoutes(); } }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
              <div className="space-y-4">
                <input type="text" placeholder="From City" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" value={newRoute.fromCity} onChange={(e) => setNewRoute({...newRoute, fromCity: e.target.value})} required />
                <input type="text" placeholder="To City" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" value={newRoute.toCity} onChange={(e) => setNewRoute({...newRoute, toCity: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Distance (e.g. 150 km)" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" value={newRoute.distance} onChange={(e) => setNewRoute({...newRoute, distance: e.target.value})} required />
                  <input type="text" placeholder="Duration (e.g. 3h 30m)" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" value={newRoute.duration} onChange={(e) => setNewRoute({...newRoute, duration: e.target.value})} required />
                </div>
                <input type="number" placeholder="Base Price" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" value={newRoute.basePrice} onChange={(e) => setNewRoute({...newRoute, basePrice: Number(e.target.value)})} required />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingRoute(null); }} className="flex-grow py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-grow py-3 bg-blue-600 text-white rounded-xl font-bold">Save Route</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
