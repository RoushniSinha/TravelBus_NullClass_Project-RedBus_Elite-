import { useState } from 'react';
import { BookOpen, Check, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/redbus/Navbar';
import { mockStories, type StoryData } from '@/data/busData';

interface AdminStory extends StoryData { isApproved: boolean; }

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<AdminStory[]>(
    mockStories.map((s, i) => ({ ...s, isApproved: i < 4 }))
  );
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? stories : tab === 'pending' ? stories.filter(s => !s.isApproved) : stories.filter(s => s.isFeatured);

  const approve = (id: string) => setStories(prev => prev.map(s => s.id === id ? { ...s, isApproved: true } : s));
  const toggleFeature = (id: string) => setStories(prev => prev.map(s => s.id === id ? { ...s, isFeatured: !s.isFeatured } : s));
  const remove = (id: string) => setStories(prev => prev.filter(s => s.id !== id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6" /> Story Moderation</h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All ({stories.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stories.filter(s => !s.isApproved).length})</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3 mt-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
              <img src={s.image} alt={s.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-sm truncate">{s.title}</h3>
                  {s.isFeatured && <Badge className="bg-primary/10 text-primary text-xs">Featured</Badge>}
                  {!s.isApproved && <Badge variant="outline" className="text-xs">Pending</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{s.authorName} · {s.route} · {s.createdAt}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{s.body}</p>
                <div className="flex gap-2 mt-2">
                  {!s.isApproved && <Button size="sm" variant="outline" onClick={() => approve(s.id)}><Check className="h-3 w-3 mr-1" /> Approve</Button>}
                  <Button size="sm" variant="outline" onClick={() => toggleFeature(s.id)}>
                    <Award className="h-3 w-3 mr-1" /> {s.isFeatured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(s.id)}>
                    <X className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
