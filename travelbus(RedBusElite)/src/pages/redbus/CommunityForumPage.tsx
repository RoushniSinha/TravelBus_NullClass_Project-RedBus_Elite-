import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { useAuth } from '@/context/AuthContext';

const categories = ['general', 'route_tips', 'travel_tips', 'complaints', 'recommendations'] as const;
const categoryLabels: Record<string, string> = {
  general: 'General', route_tips: 'Route Tips', travel_tips: 'Travel Tips',
  complaints: 'Complaints', recommendations: 'Recommendations',
};

interface ForumPost {
  id: string; title: string; body: string; category: string;
  author: string; replies: number; likes: number; createdAt: string;
}

const initialPosts: ForumPost[] = [
  { id: 'FP1', title: 'Best overnight bus from Delhi to Jaipur?', body: 'Looking for recommendations for a comfortable sleeper bus...', category: 'route_tips', author: 'Amit K.', replies: 12, likes: 8, createdAt: '2026-03-28' },
  { id: 'FP2', title: 'Tips for first-time bus travelers', body: 'Here are my top 5 tips for anyone taking their first long-distance bus ride...', category: 'travel_tips', author: 'Priya M.', replies: 24, likes: 45, createdAt: '2026-03-25' },
  { id: 'FP3', title: 'AC not working on VRL Travels route', body: 'Took the Mumbai-Pune VRL bus yesterday and AC was broken...', category: 'complaints', author: 'Rajesh S.', replies: 6, likes: 3, createdAt: '2026-03-29' },
  { id: 'FP4', title: 'Hidden gem: Pune to Goa coastal route', body: 'If you take the Konkan route bus, the views are absolutely stunning...', category: 'recommendations', author: 'Sneha D.', replies: 18, likes: 32, createdAt: '2026-03-20' },
];

export default function CommunityForumPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);

  const handleCreate = () => {
    if (!newTitle || !newBody) return;
    setPosts(prev => [{ id: `FP${Date.now()}`, title: newTitle, body: newBody, category: newCategory, author: 'You', replies: 0, likes: 0, createdAt: new Date().toISOString().split('T')[0] }, ...prev]);
    setNewTitle(''); setNewBody(''); setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">Community Forum</h1>
          {isAuthenticated && (
            <Button className="gradient-hero text-primary-foreground" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Button>
          )}
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(c => <TabsTrigger key={c} value={c}>{categoryLabels[c]}</TabsTrigger>)}
          </TabsList>
        </Tabs>

        <div className="space-y-3 mt-6">
          {filtered.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-card transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{categoryLabels[post.category]}</Badge>
                    <span className="text-xs text-muted-foreground">{post.author} · {post.createdAt}</span>
                  </div>
                  <h3 className="font-display font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{post.body}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.replies} replies</span>
                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {post.likes} likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Post</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Title</Label><Input value={newTitle} onChange={e => setNewTitle(e.target.value)} /></div>
            <div><Label>Body</Label><Textarea rows={4} value={newBody} onChange={e => setNewBody(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="gradient-hero text-primary-foreground">Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RedFooter />
    </div>
  );
}
