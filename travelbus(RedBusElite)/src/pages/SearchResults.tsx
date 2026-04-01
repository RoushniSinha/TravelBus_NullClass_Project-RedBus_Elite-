import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Hotel, Bus, Star, Clock, ArrowRight, Filter, SortAsc } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useBooking, type SearchResult } from "@/context/BookingContext";

// Mock search results
const generateResults = (type: string, from: string, to: string): SearchResult[] => {
  if (type === "HOTEL") {
    return [
      { id: "h1", type: "HOTEL", name: "Taj Palace Hotel", operator: "Taj Hotels", from: to, to: "", departureTime: "14:00", arrivalTime: "12:00", duration: "Per Night", price: 8500, rating: 4.8, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", features: ["WiFi", "Pool", "Spa", "Restaurant"], roomType: "Deluxe", amenities: ["WiFi", "Pool", "Spa"] },
      { id: "h2", type: "HOTEL", name: "The Oberoi", operator: "Oberoi Group", from: to, to: "", departureTime: "15:00", arrivalTime: "11:00", duration: "Per Night", price: 12500, rating: 4.9, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400", features: ["WiFi", "Pool", "Spa", "Gym", "Butler"], roomType: "Suite", amenities: ["WiFi", "Pool", "Butler"] },
      { id: "h3", type: "HOTEL", name: "Holiday Inn Express", operator: "IHG", from: to, to: "", departureTime: "14:00", arrivalTime: "12:00", duration: "Per Night", price: 3200, rating: 4.1, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400", features: ["WiFi", "Breakfast", "Parking"], roomType: "Standard", amenities: ["WiFi", "Breakfast"] },
      { id: "h4", type: "HOTEL", name: "ITC Grand", operator: "ITC Hotels", from: to, to: "", departureTime: "12:00", arrivalTime: "10:00", duration: "Per Night", price: 9800, rating: 4.7, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400", features: ["WiFi", "Pool", "Spa", "Fine Dining"], roomType: "Premium", amenities: ["WiFi", "Pool", "Spa"] },
    ];
  }

  if (type === "BUS") {
    return [
      { id: "b1", type: "BUS", name: "VRL Travels", operator: "VRL Travels", from, to, departureTime: "22:00", arrivalTime: "06:00", duration: "8h", price: 850, rating: 4.3, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400", features: ["AC", "Sleeper", "Charging"], seatsAvailable: 12 },
      { id: "b2", type: "BUS", name: "Orange Travels", operator: "Orange Travels", from, to, departureTime: "21:00", arrivalTime: "05:30", duration: "8.5h", price: 950, rating: 4.5, image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400", features: ["AC", "Sleeper", "WiFi", "Snacks"], seatsAvailable: 8 },
      { id: "b3", type: "BUS", name: "SRS Travels", operator: "SRS Travels", from, to, departureTime: "23:00", arrivalTime: "07:00", duration: "8h", price: 650, rating: 3.9, image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=400", features: ["AC", "Semi-Sleeper"], seatsAvailable: 22 },
    ];
  }

  // Flights
  return [
    { id: "f1", type: "FLIGHT", name: `${from} → ${to}`, operator: "Air India", from, to, departureTime: "06:00", arrivalTime: "08:15", duration: "2h 15m", price: 4500, rating: 4.2, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400", features: ["Meal", "Entertainment", "Baggage 15kg"], seatsAvailable: 45 },
    { id: "f2", type: "FLIGHT", name: `${from} → ${to}`, operator: "IndiGo", from, to, departureTime: "09:30", arrivalTime: "11:45", duration: "2h 15m", price: 3800, rating: 4.0, image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400", features: ["Baggage 15kg"], seatsAvailable: 32 },
    { id: "f3", type: "FLIGHT", name: `${from} → ${to}`, operator: "Vistara", from, to, departureTime: "14:00", arrivalTime: "16:10", duration: "2h 10m", price: 5200, rating: 4.6, image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400", features: ["Meal", "Entertainment", "Baggage 25kg", "Priority"], seatsAvailable: 18 },
    { id: "f4", type: "FLIGHT", name: `${from} → ${to}`, operator: "SpiceJet", from, to, departureTime: "18:30", arrivalTime: "20:45", duration: "2h 15m", price: 3200, rating: 3.8, image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400", features: ["Baggage 15kg"], seatsAvailable: 56 },
    { id: "f5", type: "FLIGHT", name: `${from} → ${to}`, operator: "Air India Express", from, to, departureTime: "21:00", arrivalTime: "23:10", duration: "2h 10m", price: 3500, rating: 4.1, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400", features: ["Meal", "Baggage 20kg"], seatsAvailable: 28 },
  ];
};

const typeIcons = { FLIGHT: Plane, HOTEL: Hotel, BUS: Bus };

const SearchResults = () => {
  const navigate = useNavigate();
  const { booking, setSelectedResult } = useBooking();
  const { searchParams } = booking;
  const [sortBy, setSortBy] = useState("price");
  const [maxPrice, setMaxPrice] = useState([20000]);

  const from = searchParams?.from || "Delhi";
  const to = searchParams?.to || "Mumbai";
  const type = searchParams?.type || "FLIGHT";

  const results = useMemo(() => generateResults(type, from, to), [type, from, to]);

  const filtered = useMemo(() => {
    let r = results.filter((item) => item.price <= maxPrice[0]);
    if (sortBy === "price") r.sort((a, b) => a.price - b.price);
    else if (sortBy === "rating") r.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "duration") r.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    return r;
  }, [results, sortBy, maxPrice]);

  const handleSelect = (result: SearchResult) => {
    setSelectedResult(result);
    if (type === "HOTEL") {
      navigate("/booking/room-select");
    } else {
      navigate("/booking/seat-select");
    }
  };

  const Icon = typeIcons[type];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Search Summary */}
          <div className="bg-muted rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="gradient-hero p-2 rounded-lg">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg">
                  {type === "HOTEL" ? `Hotels in ${to}` : `${from} → ${to}`}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {searchParams?.date || "Today"} • {searchParams?.passengers || 1} traveler{(searchParams?.passengers || 1) > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/search")}>
              Modify Search
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 space-y-5">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <Filter className="h-4 w-4" /> Filters
                    </h3>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price: Low to High</SelectItem>
                        <SelectItem value="rating">Rating: High to Low</SelectItem>
                        <SelectItem value="duration">Departure Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Max Price: ₹{maxPrice[0].toLocaleString()}
                    </label>
                    <Slider value={maxPrice} onValueChange={setMaxPrice} max={20000} min={500} step={500} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-sm text-muted-foreground">{filtered.length} results found</p>
              {filtered.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:shadow-card transition-all overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <img src={result.image} alt={result.name} className="w-full md:w-48 h-40 md:h-auto object-cover" />
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{result.operator}</h3>
                                {type !== "HOTEL" && (
                                  <p className="text-sm text-muted-foreground">{result.from} → {result.to}</p>
                                )}
                                {type === "HOTEL" && (
                                  <p className="text-sm text-muted-foreground">{result.name} • {result.roomType}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium">{result.rating}</span>
                              </div>
                            </div>
                            {type !== "HOTEL" && (
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span className="font-medium text-foreground">{result.departureTime}</span>
                                <div className="flex items-center gap-1 flex-1">
                                  <div className="h-px flex-1 bg-border" />
                                  <span className="text-xs px-2">{result.duration}</span>
                                  <div className="h-px flex-1 bg-border" />
                                </div>
                                <span className="font-medium text-foreground">{result.arrivalTime}</span>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                              {result.features.map((f) => (
                                <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                              ))}
                              {result.seatsAvailable && (
                                <Badge variant="secondary" className="text-xs">{result.seatsAvailable} seats left</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-end justify-between mt-4 pt-3 border-t">
                            <div>
                              <span className="text-2xl font-bold text-primary">₹{result.price.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">
                                {type === "HOTEL" ? "/night" : "/person"}
                              </span>
                            </div>
                            <Button onClick={() => handleSelect(result)} className="gap-2">
                              {type === "HOTEL" ? "Select Room" : "Select Seats"}
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg">No results found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
