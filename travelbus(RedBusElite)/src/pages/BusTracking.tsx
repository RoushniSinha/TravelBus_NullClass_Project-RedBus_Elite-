import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, Clock, MapPin, ArrowLeft, Phone, Navigation, Users, Wifi, Wind, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";

const BusTracking = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "Mumbai";
  const to = searchParams.get("to") || "Pune";
  
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("3h 30m");
  const [distance, setDistance] = useState("148 km");

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        const newProgress = prev + 0.5;
        
        // Update ETA
        const remainingTime = Math.round((100 - newProgress) * 2.1);
        const hours = Math.floor(remainingTime / 60);
        const minutes = remainingTime % 60;
        setEta(`${hours}h ${minutes}m`);
        
        // Update distance
        const remainingDist = Math.round((100 - newProgress) * 1.48);
        setDistance(`${remainingDist} km`);
        
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-display font-bold text-foreground">Live Tracking</h1>
                <p className="text-sm text-muted-foreground">{from} → {to}</p>
              </div>
            </Link>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
              Call Driver
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Map Area */}
        <div className="flex-1 relative bg-muted">
          {/* Static Map Image with animated bus */}
          <div className="h-[50vh] lg:h-full w-full relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&h=1080&fit=crop"
              alt="Map"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
            
            {/* Animated Route Line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Route path */}
              <path 
                d="M 10 80 Q 30 60 50 50 Q 70 40 90 20" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth="0.3" 
                fill="none"
                strokeDasharray="2 2"
              />
              {/* Traveled path */}
              <path 
                d="M 10 80 Q 30 60 50 50 Q 70 40 90 20" 
                stroke="hsl(var(--primary))" 
                strokeWidth="0.5" 
                fill="none"
                strokeDasharray={`${progress} 100`}
              />
            </svg>

            {/* Animated Bus Icon */}
            <motion.div
              className="absolute"
              style={{
                left: `${10 + (progress * 0.8)}%`,
                top: `${80 - (progress * 0.6)}%`,
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-12 h-12 gradient-hero rounded-full flex items-center justify-center shadow-elevated">
                <Bus className="h-6 w-6 text-primary-foreground" />
              </div>
            </motion.div>

            {/* Start Point */}
            <div className="absolute left-[10%] top-[80%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-card shadow-lg" />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-medium bg-card px-2 py-1 rounded shadow whitespace-nowrap">{from}</span>
            </div>

            {/* End Point */}
            <div className="absolute left-[90%] top-[20%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-card shadow-lg" />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs font-medium bg-card px-2 py-1 rounded shadow whitespace-nowrap">{to}</span>
            </div>
          </div>

          {/* Map Overlay Info */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 z-10"
          >
            <div className="bg-card/95 backdrop-blur-lg rounded-xl shadow-elevated p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center">
                    <Bus className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground">KA-01-AB-1234</div>
                    <div className="text-sm text-muted-foreground">Volvo Multi-Axle Sleeper</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Speed</div>
                  <div className="font-display font-bold text-foreground">72 km/h</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-96 bg-card border-l border-border overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-semibold text-foreground">Journey Progress</span>
                <span className="text-primary font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-hero rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{from}</span>
                <span>{to}</span>
              </div>
            </div>

            {/* ETA Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">ETA</span>
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{eta}</div>
              </div>
              <div className="bg-accent rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent-foreground mb-1">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm">Distance</span>
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{distance}</div>
              </div>
            </div>

            {/* Bus Details */}
            <div className="bg-muted rounded-xl p-4">
              <h3 className="font-display font-semibold text-foreground mb-4">Bus Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Operator</span>
                  <span className="font-medium text-foreground">TravelBus Express</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bus Type</span>
                  <span className="font-medium text-foreground">AC Sleeper 2+1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seat Number</span>
                  <span className="font-medium text-foreground">U-12</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">Amenities</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Wifi, label: "WiFi" },
                  { icon: Wind, label: "AC" },
                  { icon: Armchair, label: "Sleeper" },
                  { icon: Users, label: "2+1" },
                ].map((amenity, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-3 bg-accent rounded-xl">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Stops */}
            <div>
              <h3 className="font-display font-semibold text-foreground mb-4">Upcoming Stops</h3>
              <div className="space-y-3">
                {[
                  { name: "Lonavala", time: "45 min", status: "next" },
                  { name: "Khandala", time: "1h 15m", status: "upcoming" },
                  { name: "Pune (Wakad)", time: "2h 45m", status: "upcoming" },
                  { name: "Pune (Shivaji Nagar)", time: "3h 30m", status: "final" },
                ].map((stop, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      stop.status === "next" ? "bg-primary animate-pulse" :
                      stop.status === "final" ? "bg-secondary" : "bg-muted-foreground/30"
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{stop.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{stop.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4" />
                Share Location
              </Button>
              <Button className="w-full">
                <Phone className="h-4 w-4" />
                Emergency
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusTracking;
