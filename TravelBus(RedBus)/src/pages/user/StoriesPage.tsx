import { Bus, BookOpen, Star, MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function StoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Travel Stories</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Discover amazing journeys shared by our elite community members.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group"
          >
            <div className="h-64 overflow-hidden relative">
              <img 
                src={`https://picsum.photos/seed/travel${i}/800/600`} 
                alt="Travel" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                Adventure
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  JD
                </div>
                <div className="text-sm font-bold text-slate-900">John Doe</div>
                <div className="text-xs font-medium text-slate-400 ml-auto">2 days ago</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">My amazing trip from Delhi to Agra</h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                The journey was absolutely incredible. The Elite Sleeper bus was so comfortable that I slept through most of the trip...
              </p>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400"><Star className="w-4 h-4 text-amber-400" /> 4.5</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400"><BookOpen className="w-4 h-4 text-blue-400" /> 1.2k</div>
                </div>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Story <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
