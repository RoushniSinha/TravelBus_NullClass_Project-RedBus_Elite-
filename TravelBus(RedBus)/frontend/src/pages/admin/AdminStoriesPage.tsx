import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'stories'));
    setStories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const toggleApproval = async (storyId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'stories', storyId), { isApproved: !currentStatus });
    fetchStories();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Travel Stories</h1>
        <p className="text-slate-500 font-medium">Moderate and manage community travel stories.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search stories..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <motion.div 
            key={story.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="h-48 relative">
              <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                  story.isApproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {story.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="p-6 flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{story.title}</h3>
                  <p className="text-sm text-slate-500">By {story.authorName}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Eye className="w-4 h-4" /> {story.views || 0}
                </div>
              </div>
              <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                {story.content}
              </p>
              <div className="flex gap-2 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => toggleApproval(story.id, story.isApproved)}
                  className={`flex-grow py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    story.isApproved ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}
                >
                  {story.isApproved ? 'Revoke Approval' : 'Approve Story'}
                </button>
                <button 
                  onClick={async () => { if(confirm('Delete this story?')) { await deleteDoc(doc(db, 'stories', story.id)); fetchStories(); } }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
