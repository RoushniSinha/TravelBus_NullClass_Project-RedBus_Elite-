import React, { useState, useEffect } from 'react';
import { Bus, Plus, Search, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBus, setEditingBus] = useState<any>(null);
  const [newBus, setNewBus] = useState({
    busNumber: '',
    busType: 'AC Sleeper',
    fromCity: '',
    toCity: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    totalSeats: 40,
    availableSeats: 40,
    amenities: ['AC', 'Wifi', 'Water'],
    isActive: true
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'buses'));
    setBuses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await updateDoc(doc(db, 'buses', editingBus.id), {
          ...newBus,
          price: Number(newBus.price),
          totalSeats: Number(newBus.totalSeats),
          availableSeats: Number(newBus.availableSeats),
        });
      } else {
        await addDoc(collection(db, 'buses'), {
          ...newBus,
          price: Number(newBus.price),
          totalSeats: Number(newBus.totalSeats),
          availableSeats: Number(newBus.totalSeats),
          avgRating: 0,
          totalReviews: 0,
          createdAt: new Date().toISOString()
        });
      }
      setShowAddModal(false);
      setEditingBus(null);
      setNewBus({
        busNumber: '',
        busType: 'AC Sleeper',
        fromCity: '',
        toCity: '',
        departureTime: '',
        arrivalTime: '',
        price: 0,
        totalSeats: 40,
        availableSeats: 40,
        amenities: ['AC', 'Wifi', 'Water'],
        isActive: true
      });
      fetchBuses();
    } catch (error) {
      console.error("Error saving bus:", error);
    }
  };

  const handleEdit = (bus: any) => {
    setEditingBus(bus);
    setNewBus({
      busNumber: bus.busNumber,
      busType: bus.busType,
      fromCity: bus.fromCity,
      toCity: bus.toCity,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      price: bus.price,
      totalSeats: bus.totalSeats,
      availableSeats: bus.availableSeats,
      amenities: bus.amenities,
      isActive: bus.isActive
    });
    setShowAddModal(true);
  };

  const toggleBusStatus = async (busId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'buses', busId), { isActive: !currentStatus });
    fetchBuses();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bus Management</h1>
          <p className="text-slate-500 font-medium">Manage your fleet and schedules.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"
        >
          <Plus className="w-5 h-5" /> Add New Bus
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by bus number or route..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Buses Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Bus Details</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{bus.busNumber}</div>
                    <div className="text-xs font-medium text-slate-400">{bus.busType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{bus.fromCity} → {bus.toCity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-xs font-medium text-slate-400">{new Date(bus.departureTime).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{bus.price}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleBusStatus(bus.id, bus.isActive)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        bus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {bus.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(bus)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={async () => { if(confirm('Delete this bus?')) { await deleteDoc(doc(db, 'buses', bus.id)); fetchBuses(); } }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

      {/* Add/Edit Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleAddBus} className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">{editingBus ? 'Edit Bus Schedule' : 'Add New Bus'}</h2>
                <button type="button" onClick={() => { setShowAddModal(false); setEditingBus(null); }} className="text-slate-400 hover:text-slate-600"><XCircle className="w-6 h-6" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bus Number</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="KA-01-F-1234"
                    value={newBus.busNumber}
                    onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bus Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBus.busType}
                    onChange={(e) => setNewBus({ ...newBus, busType: e.target.value })}
                  >
                    <option>AC Sleeper</option>
                    <option>Non-AC Sleeper</option>
                    <option>AC Seater</option>
                    <option>Luxury</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">From City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Mumbai"
                    value={newBus.fromCity}
                    onChange={(e) => setNewBus({ ...newBus, fromCity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">To City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Pune"
                    value={newBus.toCity}
                    onChange={(e) => setNewBus({ ...newBus, toCity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Departure Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBus.departureTime}
                    onChange={(e) => setNewBus({ ...newBus, departureTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Arrival Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newBus.arrivalTime}
                    onChange={(e) => setNewBus({ ...newBus, arrivalTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="499"
                    value={newBus.price}
                    onChange={(e) => setNewBus({ ...newBus, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                Create Bus Schedule
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
