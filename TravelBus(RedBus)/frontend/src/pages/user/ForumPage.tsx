import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ThumbsUp, Eye, Search, Filter, Plus, TrendingUp, Award, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ForumPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [contributors, setContributors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, contributorsRes] = await Promise.all([
          fetch('/api/forum/posts'),
          fetch('/api/forum/top-contributors')
        ]);
        const postsData = await postsRes.json();
        const contributorsData = await contributorsRes.json();
        if (postsData.success) setPosts(postsData.posts);
        if (contributorsData.success) setContributors(contributorsData.contributors);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['All', 'General Discussion', 'Travel Tips', 'Route Queries', 'Bus Reviews', 'Lost & Found'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Community Forum</h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Join the conversation, ask questions, and share your travel wisdom with fellow explorers.
            </p>
          </div>
          <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
            <Plus className="w-5 h-5" />
            <span>Start New Discussion</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search & Categories */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500 transition-colors shadow-sm"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-red-600 border-red-600 text-white' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-red-500/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post, i) => (
                <motion.div 
                  key={post._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-red-500/30 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <button className="p-2 bg-slate-50 rounded-xl border border-slate-200 hover:border-red-500 transition-colors">
                        <ThumbsUp className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
                      </button>
                      <span className="text-sm font-bold text-slate-500">{post.upvotes?.length || 0}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-600">
                        <span>{post.category}</span>
                        <span className="text-slate-200">•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-red-600 transition-colors text-slate-900">{post.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {post.body}
                      </p>
                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center font-bold text-xs text-white">
                            {post.authorName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{post.authorName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <div className="flex items-center gap-1 text-xs">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.repliesCount || 0} replies</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Eye className="w-4 h-4" />
                            <span>{post.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Contributors */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-slate-900">Top Contributors</h3>
              </div>
              <div className="space-y-6">
                {contributors.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-sm text-red-600">
                        {c.initials}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.points} points</p>
                      </div>
                    </div>
                    {i === 0 && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold text-slate-900">Trending Topics</h3>
              </div>
              <div className="space-y-4">
                {['#MumbaiGoaRoute', '#SoloTravelTips', '#BestSleeperBuses', '#MonsoonTravel'].map(tag => (
                  <button key={tag} className="block text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
