import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import { useToast } from '@/hooks/use-toast';

const availableTags = ['Solo', 'Budget', 'Family', 'Adventure', 'Friends', 'Food', 'Night Travel', 'Comfort', 'Fun'];

export default function StoryCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [route, setRoute] = useState('');
  const [operator, setOperator] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const toggleTag = (tag: string) => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handlePublish = () => {
    toast({ title: '🎉 Story Published!', description: 'Your story is pending review.' });
    navigate('/stories');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate('/stories')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> {t('common.back')}</Button>
        <h1 className="text-2xl font-display font-bold mb-6">{t('stories.share')}</h1>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'gradient-hero' : 'bg-muted'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold">Journey Details</h3>
            <div><Label>Route (e.g. Mumbai → Goa)</Label><Input value={route} onChange={e => setRoute(e.target.value)} /></div>
            <div><Label>Operator</Label><Input value={operator} onChange={e => setOperator(e.target.value)} /></div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map(tag => (
                  <Badge key={tag} variant={tags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer ${tags.includes(tag) ? 'gradient-hero text-primary-foreground' : ''}`}
                    onClick={() => toggleTag(tag)}>{tag}</Badge>
                ))}
              </div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full gradient-hero text-primary-foreground">{t('common.next')}</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold">Your Story</h3>
            <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div>
              <Label>Story</Label>
              <Textarea rows={8} value={body} onChange={e => setBody(e.target.value)} placeholder="Share your travel experience..." />
              <p className="text-xs text-muted-foreground mt-1">{body.split(/\s+/).filter(Boolean).length} words</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>{t('common.back')}</Button>
              <Button onClick={() => setStep(3)} className="flex-1 gradient-hero text-primary-foreground">{t('common.next')}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold">Photos</h3>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop up to 5 photos</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>{t('common.back')}</Button>
              <Button onClick={handlePublish} className="flex-1 gradient-hero text-primary-foreground">Publish Story</Button>
            </div>
          </div>
        )}
      </div>
      <RedFooter />
    </div>
  );
}
