import React from 'react';
import { MessageSquare, Users, TrendingUp, Search, Plus, ChevronRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function CommunityForumPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Community Forum</h1>
          <p className="text-slate-500">Connect with fellow travelers, share tips, and ask questions.</p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10">
          <Plus className="w-5 h-5" /> Start Discussion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 5 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Travel Tips</span>
                    <span className="text-xs font-medium text-slate-400">Posted by Alex • 5h ago</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Best time to travel from Mumbai to Goa by bus?</h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    I'm planning a trip next month and wondering if I should take the overnight sleeper or the morning luxury bus...
                  </p>
                  <div className="flex gap-6 pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><MessageSquare className="w-4 h-4" /> 24 Replies</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><TrendingUp className="w-4 h-4" /> 156 Views</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] space-y-6">
            <h3 className="text-xl font-bold">Forum Categories</h3>
            <div className="space-y-2">
              {['General Discussion', 'Travel Tips', 'Route Queries', 'Bus Reviews', 'Lost & Found'].map(cat => (
                <button key={cat} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-all text-left group">
                  <span className="font-bold text-slate-300 group-hover:text-white">{cat}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Top Contributors</h3>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {['AS', 'MK', 'RP'][i-1]}
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-slate-900">{['Ankit Sharma', 'Meera Kapoor', 'Rahul Prasad'][i-1]}</div>
                    <div className="text-xs font-medium text-slate-400">542 Points</div>
                  </div>
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
