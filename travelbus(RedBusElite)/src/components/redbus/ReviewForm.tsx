import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  bookingId: string;
  busId: string;
  onSubmitted?: () => void;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <Label className="text-sm mb-1 block">{label}</Label>
      <div className="flex gap-0.5">
        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].filter(v => v % 1 === 0).map(star => (
          <button key={star} type="button" onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)} className="p-0.5">
            <Star className={cn('h-6 w-6 transition-colors',
              (hover || value) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewForm({ bookingId, busId, onSubmitted }: ReviewFormProps) {
  const { toast } = useToast();
  const [punctuality, setPunctuality] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [amenities, setAmenities] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liveScore = useMemo(() => {
    if (!punctuality || !cleanliness || !amenities) return null;
    const p = parseFloat(String(punctuality));
    const c = parseFloat(String(cleanliness));
    const a = parseFloat(String(amenities));
    return parseFloat(((p * 0.5) + (c * 0.3) + (a * 0.2)).toFixed(1));
  }, [punctuality, cleanliness, amenities]);

  const scoreColor = liveScore !== null
    ? liveScore >= 4.0 ? 'text-green-500' : liveScore >= 3.0 ? 'text-amber-500' : 'text-red-500'
    : 'text-muted-foreground';

  const handleSubmit = async () => {
    if (!punctuality || !cleanliness || !amenities) {
      toast({ title: 'Error', description: 'Please rate all categories', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    // Mock save to localStorage
    const reviews = JSON.parse(localStorage.getItem('rbe_reviews') || '[]');
    reviews.push({
      id: `REV${Date.now()}`, bookingId, busId, punctuality, cleanliness, amenities,
      eliteScore: liveScore, reviewText, createdAt: new Date().toISOString(), isVerified: true,
    });
    localStorage.setItem('rbe_reviews', JSON.stringify(reviews));
    await new Promise(r => setTimeout(r, 500));
    setSubmitting(false);
    toast({ title: '⭐ Review Submitted!', description: `EliteScore: ${liveScore}` });
    onSubmitted?.();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-display font-semibold text-lg">Rate Your Journey</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StarRating label="Punctuality (50%)" value={punctuality} onChange={setPunctuality} />
        <StarRating label="Cleanliness (30%)" value={cleanliness} onChange={setCleanliness} />
        <StarRating label="Amenities (20%)" value={amenities} onChange={setAmenities} />
      </div>

      {liveScore !== null && (
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your EliteScore</p>
          <p className={cn('text-3xl font-display font-bold', scoreColor)}>{liveScore}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ({punctuality}×0.5) + ({cleanliness}×0.3) + ({amenities}×0.2)
          </p>
        </div>
      )}

      <div>
        <Label>Review (optional)</Label>
        <Textarea rows={3} value={reviewText} onChange={e => setReviewText(e.target.value)}
          placeholder="Share your experience..." maxLength={1000} />
        <p className="text-xs text-muted-foreground mt-1">{reviewText.length}/1000</p>
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full gradient-hero text-primary-foreground">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </div>
  );
}
