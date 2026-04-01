import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-4', lg: 'h-12 w-12 border-4' };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('animate-spin rounded-full border-primary border-t-transparent', sizes[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
