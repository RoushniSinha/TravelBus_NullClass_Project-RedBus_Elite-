import { cn } from '@/lib/utils';

interface EliteScoreDisplayProps {
  score: number;
  breakdown?: { punctuality: number; cleanliness: number; amenities: number };
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number) {
  if (score >= 4.0) return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
  if (score >= 3.0) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
}

function getBarColor(score: number) {
  if (score >= 4.0) return 'bg-green-500';
  if (score >= 3.0) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function EliteScoreDisplay({ score, breakdown, size = 'md' }: EliteScoreDisplayProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-2 font-bold',
  };

  return (
    <div className="inline-flex flex-col gap-2">
      <span className={cn('font-display font-semibold rounded-lg border inline-flex items-center gap-1', sizes[size], getScoreColor(score))}>
        ★ {score.toFixed(1)}
      </span>
      {breakdown && size === 'lg' && (
        <div className="space-y-1.5 w-full min-w-[200px]">
          {[
            { label: 'Punctuality (50%)', value: breakdown.punctuality },
            { label: 'Cleanliness (30%)', value: breakdown.cleanliness },
            { label: 'Amenities (20%)', value: breakdown.amenities },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                <span>{m.label}</span><span>{m.value.toFixed(1)}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', getBarColor(m.value))} style={{ width: `${(m.value / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
