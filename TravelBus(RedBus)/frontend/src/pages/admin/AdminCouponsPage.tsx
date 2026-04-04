import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Calendar, Percent } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minBookingAmount: 0,
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'coupons'));
    setCoupons(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), {
          ...newCoupon,
          discountValue: Number(newCoupon.discountValue),
          minBookingAmount: Number(newCoupon.minBookingAmount)
        });
      } else {
        await addDoc(collection(db, 'coupons'), {
          ...newCoupon,
          discountValue: Number(newCoupon.discountValue),
          minBookingAmount: Number(newCoupon.minBookingAmount),
          createdAt: new Date().toISOString()
        });
      }
      setShowModal(false);
      setEditingCoupon(null);
      setNewCoupon({ code: '', discountType: 'percentage', discountValue: 0, minBookingAmount: 0, expiryDate: '', isActive: true });
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minBookingAmount: coupon.minBookingAmount,
      expiryDate: coupon.expiryDate,
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Coupon Management</h1>
          <p className="text-slate-500 font-medium">Create and manage discount codes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10"
        >
          <Plus className="w-5 h-5" /> Create Coupon
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search coupons..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <motion.div 
            key={coupon.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(coupon)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button 
                onClick={async () => { if(confirm('Delete this coupon?')) { await deleteDoc(doc(db, 'coupons', coupon.id)); fetchCoupons(); } }}
                className="p-2 bg-red-50 text-red-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Tag className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tighter uppercase">{coupon.code}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" /> Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Percent className="w-4 h-4" /> Min Booking: ₹{coupon.minBookingAmount}
              </div>
            </div>
            <div className={`mt-6 text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
              coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {coupon.isActive ? 'Active' : 'Inactive'}
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Coupon Code (e.g. ELITE50)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 uppercase" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} required />
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" value={newCoupon.discountType} onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <input type="number" placeholder="Value" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" value={newCoupon.discountValue} onChange={(e) => setNewCoupon({...newCoupon, discountValue: Number(e.target.value)})} required />
                </div>
                <input type="number" placeholder="Min Booking Amount" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" value={newCoupon.minBookingAmount} onChange={(e) => setNewCoupon({...newCoupon, minBookingAmount: Number(e.target.value)})} required />
                <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})} required />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingCoupon(null); }} className="flex-grow py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-grow py-3 bg-blue-600 text-white rounded-xl font-bold">Save Coupon</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
