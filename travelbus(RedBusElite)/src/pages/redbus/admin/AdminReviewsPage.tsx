import { useState } from 'react';
import { Star, Check, X, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/redbus/Navbar';
import EliteScoreDisplay from '@/components/redbus/EliteScoreDisplay';

interface ReviewEntry {
  id: string; busName: string; userName: string; score: number;
  text: string; isVerified: boolean; status: 'pending' | 'approved' | 'flagged'; date: string;
}

const mockReviews: ReviewEntry[] = [
  { id: 'R1', busName: 'VRL Travels (Mumbai→Pune)', userName: 'Rahul S.', score: 4.2, text: 'Very comfortable ride, AC worked well. Slightly late by 15 mins.', isVerified: true, status: 'approved', date: '2026-03-28' },
  { id: 'R2', busName: 'SRS Travels (Delhi→Agra)', userName: 'Priya P.', score: 3.5, text: 'Decent bus but could improve cleanliness.', isVerified: true, status: 'pending', date: '2026-03-29' },
  { id: 'R3', busName: 'KPN Travels (Chennai→Coimbatore)', userName: 'Arjun R.', score: 4.8, text: 'Best bus experience ever! Everything was perfect.', isVerified: true, status: 'approved', date: '2026-03-27' },
  { id: 'R4', busName: 'Orange Tours (Bangalore→Chennai)', userName: 'Test User', score: 1.2, text: 'Terrible service, never again.', isVerified: false, status: 'flagged', date: '2026-03-30' },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? reviews : reviews.filter(r => r.status === tab);

  const updateStatus = (id: string, status: ReviewEntry['status']) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2"><Star className="h-6 w-6" /> Review Moderation</h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({reviews.filter(r => r.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3 mt-6">
          {filtered.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{r.userName}</span>
                    {r.isVerified && <Badge className="bg-primary/10 text-primary text-xs">Verified</Badge>}
                    <Badge variant="outline" className="text-xs">{r.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{r.busName} · {r.date}</p>
                  <p className="text-sm">{r.text}</p>
                </div>
                <EliteScoreDisplay score={r.score} size="sm" />
              </div>
              <div className="flex gap-2 mt-3">
                {r.status !== 'approved' && (
                  <Button variant="outline" size="sm" onClick={() => updateStatus(r.id, 'approved')}>
                    <Check className="h-3 w-3 mr-1" /> Approve
                  </Button>
                )}
                {r.status !== 'flagged' && (
                  <Button variant="outline" size="sm" onClick={() => updateStatus(r.id, 'flagged')}>
                    <Flag className="h-3 w-3 mr-1" /> Flag
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setReviews(prev => prev.filter(x => x.id !== r.id))}>
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
