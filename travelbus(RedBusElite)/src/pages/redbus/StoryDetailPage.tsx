import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { mockStories } from '@/data/busData';
import { useState } from 'react';

export default function StoryDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const story = mockStories.find(s => s.id === id);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  if (!story) return <div className="min-h-screen bg-background"><Navbar /><div className="pt-20 text-center">Story not found</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/stories')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> {t('common.back')}</Button>
        <img src={story.image} alt={story.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-6" />
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">{story.authorName}</span>
          <span className="text-sm text-muted-foreground">· {story.route}</span>
          <span className="text-sm text-muted-foreground">· {story.createdAt}</span>
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">{story.title}</h1>
        <div className="flex gap-2 mb-6">{story.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
        <p className="text-foreground leading-relaxed mb-8">{story.body}</p>

        <div className="flex items-center gap-4 border-t border-b border-border py-4 mb-6">
          <Button variant={liked ? 'default' : 'outline'} size="sm" onClick={() => setLiked(!liked)} className={liked ? 'gradient-hero text-primary-foreground' : ''}>
            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} /> {story.likes + (liked ? 1 : 0)}
          </Button>
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><MessageCircle className="h-4 w-4" /> {story.comments}</span>
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">Comments</h3>
          <div className="flex gap-2 mb-4">
            <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." />
            <Button className="gradient-hero text-primary-foreground">Post</Button>
          </div>
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-sm font-medium">Anita K.</p>
              <p className="text-sm text-muted-foreground">What an amazing story! I want to take this route too.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-sm font-medium">Ravi M.</p>
              <p className="text-sm text-muted-foreground">Great photos! Which operator did you use?</p>
            </div>
          </div>
        </div>
      </div>
      <RedFooter />
    </div>
  );
}
