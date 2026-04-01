import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="font-display font-bold text-lg mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-4">{this.state.error?.message}</p>
          <Button onClick={() => this.setState({ hasError: false })} variant="outline">Try Again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
