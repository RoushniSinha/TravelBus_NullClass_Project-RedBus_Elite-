import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Star, MessageSquare, Share2, Heart, Search, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/api/stories');
        const data = await res.json();
        if (data.success) {
          setStories(data.stories);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.toCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Travel Stories</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Discover real experiences from our community of travelers. Share your own journey and inspire others.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by city or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 hover:border-red-500 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Filter</span>
          </button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, i) => (
            <motion.div 
              key={story._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:border-red-500/50 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={story.images?.[0] || `https://picsum.photos/seed/${story._id}/800/600`} 
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-slate-900">{story.rating}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  <span>{story.fromCity} → {story.toCity}</span>
                </div>
                <h3 className="text-xl font-bold line-clamp-2 group-hover:text-red-600 transition-colors text-slate-900">{story.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                  {story.body}
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center font-bold text-xs text-white">
                      {story.authorName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{story.authorName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{story.likes?.length || 0}</span>
                    </button>
                    <button className="hover:text-red-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-lg font-medium">No stories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
