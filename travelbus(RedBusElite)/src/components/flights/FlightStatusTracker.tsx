import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plane, 
  Clock, 
  MapPin, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockFlightStatuses } from "@/data/mockData";
import type { FlightStatus, FlightStatusType } from "@/types/api";

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  SCHEDULED: { color: "bg-blue-500", icon: Clock, label: "Scheduled" },
  BOARDING: { color: "bg-amber-500", icon: Plane, label: "Boarding" },
  DEPARTED: { color: "bg-indigo-500", icon: Plane, label: "Departed" },
  IN_FLIGHT: { color: "bg-sky-500", icon: Plane, label: "In Flight" },
  LANDED: { color: "bg-emerald-500", icon: CheckCircle, label: "Landed" },
  ARRIVED: { color: "bg-green-500", icon: CheckCircle, label: "Arrived" },
  DELAYED: { color: "bg-orange-500", icon: AlertTriangle, label: "Delayed" },
  CANCELLED: { color: "bg-red-500", icon: XCircle, label: "Cancelled" },
  ON_TIME: { color: "bg-green-500", icon: CheckCircle, label: "On Time" },
};

interface FlightStatusCardProps {
  flight: FlightStatus;
}

function FlightStatusCard({ flight }: FlightStatusCardProps) {
  const status = statusConfig[flight.status] || statusConfig.SCHEDULED;
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${status.color} bg-opacity-20`}>
              <Plane className={`h-5 w-5 ${status.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{flight.flightNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">{flight.airline}</p>
            </div>
          </div>
          
          <Badge className={`${status.color} text-white`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Route */}
        <div className="flex items-center justify-between py-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{flight.departure.code}</p>
            <p className="text-sm text-muted-foreground">{flight.departure.city}</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-primary to-primary/30 relative">
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2"
                  animate={{ left: ["10%", "90%"] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear",
                    repeatType: "reverse"
                  }}
                >
                  <Plane className="h-4 w-4 text-primary" />
                </motion.div>
              </div>
              <div className="h-2 w-2 rounded-full bg-primary/30" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold">{flight.arrival.code}</p>
            <p className="text-sm text-muted-foreground">{flight.arrival.city}</p>
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Departure</p>
            <p className="text-lg font-semibold">
              {new Date(flight.estimatedDeparture || flight.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            {flight.estimatedDeparture && flight.estimatedDeparture !== flight.scheduledDeparture && (
              <p className="text-xs text-muted-foreground line-through">
                {new Date(flight.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Arrival</p>
            <p className="text-lg font-semibold">
              {new Date(flight.estimatedArrival || flight.scheduledArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            {flight.estimatedArrival && flight.estimatedArrival !== flight.scheduledArrival && (
              <p className="text-xs text-muted-foreground line-through">
                {new Date(flight.scheduledArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        {/* Delay Info */}
        {flight.delayMinutes > 0 && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg mt-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                Delayed by {Math.floor(flight.delayMinutes / 60)}h {flight.delayMinutes % 60}m
              </p>
              {flight.delayReason && (
                <p className="text-xs text-orange-700 dark:text-orange-500 mt-1">
                  {flight.delayReason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-center">
          <div>
            <p className="text-xs text-muted-foreground">Terminal</p>
            <p className="font-medium">{flight.terminal || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gate</p>
            <p className="font-medium">{flight.gate || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Aircraft</p>
            <p className="font-medium text-xs">{flight.aircraft || "-"}</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-muted-foreground">
          <span>Last updated: {new Date(flight.lastUpdated).toLocaleTimeString()}</span>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4 mr-1" />
            Get Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FlightStatusTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [flights, setFlights] = useState<FlightStatus[]>(mockFlightStatuses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFlights(mockFlightStatuses);
      return;
    }
    
    const filtered = mockFlightStatuses.filter(
      (f) => f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFlights(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">Flight Status</h1>
          <p className="text-muted-foreground mt-2">
            Track your flight in real-time
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter flight number (e.g., AI302)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        {/* Flight Cards */}
        <div className="space-y-4">
          {flights.length > 0 ? (
            flights.map((flight, index) => (
              <motion.div
                key={flight.flightNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FlightStatusCard flight={flight} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No flights found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching for AI302, 6E205, or UK834
              </p>
            </div>
          )}
        </div>

        {/* Notification Simulation */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get instant updates about your flight status
                </p>
              </div>
              <Button size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FlightStatusTracker;
