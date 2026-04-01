import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { storyApi } from '@/services/mockApi';
import type { StoryData } from '@/data/busData';

const tags = ['All', 'Solo', 'Budget', 'Family', 'Adventure', 'Friends', 'Food', 'Night Travel', 'Comfort'];

export default function StoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stories, setStories] = useState<StoryData[]>([]);
  const [activeTag, setActiveTag] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storyApi.getAll(activeTag).then(s => { setStories(s); setLoading(false); });
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">{t('stories.title')}</h1>
          <Button className="gradient-hero text-primary-foreground" onClick={() => navigate('/stories/create')}>
            <Plus className="h-4 w-4 mr-1" /> {t('stories.share')}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {tags.map(tag => (
            <Badge key={tag} variant={activeTag === tag ? 'default' : 'outline'}
              className={`cursor-pointer shrink-0 ${activeTag === tag ? 'gradient-hero text-primary-foreground' : ''}`}
              onClick={() => { setActiveTag(tag); setLoading(true); }}>
              {tag}
            </Badge>
          ))}
        </div>

        {loading ? <p className="text-center py-10">{t('common.loading')}</p> : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 mt-4">
            {stories.map(story => (
              <div key={story.id} className="break-inside-avoid mb-4 bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-shadow cursor-pointer"
                onClick={() => navigate(`/stories/${story.id}`)}>
                <img src={story.image} alt={story.title} className="w-full h-48 object-cover" loading="lazy" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">{story.authorName}</span>
                    <span className="text-xs text-muted-foreground">· {story.route}</span>
                  </div>
                  <h3 className="font-display font-semibold mb-1">{story.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{story.body}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {story.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {story.comments}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {story.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <RedFooter />
    </div>
  );
}
