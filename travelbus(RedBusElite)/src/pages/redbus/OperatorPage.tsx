import { useParams } from 'react-router-dom';
import { Star, Bus, MapPin, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/redbus/Navbar';
import RedFooter from '@/components/redbus/RedFooter';
import EliteScoreDisplay from '@/components/redbus/EliteScoreDisplay';
import { mockBuses } from '@/data/busData';

export default function OperatorPage() {
  const { id } = useParams();
  const operatorBuses = mockBuses.filter(b => b.operator.toLowerCase().replace(/\s+/g, '-') === id);
  const operatorName = operatorBuses[0]?.operator || id || 'Unknown';
  const avgRating = operatorBuses.length > 0
    ? parseFloat((operatorBuses.reduce((a, b) => a + b.rating, 0) / operatorBuses.length).toFixed(1))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="gradient-hero w-16 h-16 rounded-xl flex items-center justify-center">
              <Bus className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">{operatorName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <EliteScoreDisplay score={avgRating} size="sm" />
                <span className="text-sm text-muted-foreground">{operatorBuses.length} buses</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline"><Shield className="h-3 w-3 mr-1" /> Verified Operator</Badge>
            <Badge variant="outline"><Star className="h-3 w-3 mr-1" /> Top Rated</Badge>
          </div>
        </div>

        <h2 className="font-display font-semibold text-lg mb-4">Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operatorBuses.map(bus => (
            <div key={bus.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{bus.busType}</Badge>
                <EliteScoreDisplay score={bus.rating} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-3 w-3 text-primary" />
                {bus.fromCity} → {bus.toCity}
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{bus.departureTime} - {bus.arrivalTime}</span>
                <span className="font-semibold text-foreground">₹{bus.price}</span>
              </div>
            </div>
          ))}
        </div>
        {operatorBuses.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">No buses found for this operator</p>
        )}
      </div>
      <RedFooter />
    </div>
  );
}
