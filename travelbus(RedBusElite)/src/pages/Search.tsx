import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Hotel, Bus, Calendar, MapPin, Users, ArrowRight, Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBooking, type BookingType, type SearchParams } from "@/context/BookingContext";

const popularSearches = [
  { from: "Delhi", to: "Mumbai", type: "FLIGHT" as BookingType, price: "₹4,500" },
  { from: "Bangalore", to: "Goa", type: "FLIGHT" as BookingType, price: "₹3,200" },
  { from: "Mumbai", to: "Pune", type: "BUS" as BookingType, price: "₹650" },
  { from: "Chennai", to: "Ooty", type: "BUS" as BookingType, price: "₹850" },
];

const Search = () => {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [activeTab, setActiveTab] = useState<BookingType>("FLIGHT");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [seatClass, setSeatClass] = useState("ECONOMY");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState("1");
  const [guests, setGuests] = useState("2");

  const handleSearch = () => {
    const params: SearchParams = {
      type: activeTab,
      from: from || "Delhi",
      to: to || "Mumbai",
      date: date || new Date().toISOString().split("T")[0],
      passengers: parseInt(passengers),
      class: seatClass,
      ...(activeTab === "HOTEL" && {
        checkIn: checkIn || new Date().toISOString().split("T")[0],
        checkOut: checkOut || new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        rooms: parseInt(rooms),
        guests: parseInt(guests),
      }),
      ...(returnDate && { returnDate }),
    };
    setSearchParams(params);
    navigate("/search-results");
  };

  const handlePopularSearch = (search: typeof popularSearches[0]) => {
    setFrom(search.from);
    setTo(search.to);
    setActiveTab(search.type);
    const params: SearchParams = {
      type: search.type,
      from: search.from,
      to: search.to,
      date: new Date().toISOString().split("T")[0],
      passengers: 1,
    };
    setSearchParams(params);
    navigate("/search-results");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        {/* Hero Search Section */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-3">
                Where would you like to go?
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Search flights, hotels, and buses — all in one place
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="max-w-4xl mx-auto shadow-elevated">
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingType)}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="FLIGHT" className="gap-2">
                        <Plane className="h-4 w-4" /> Flights
                      </TabsTrigger>
                      <TabsTrigger value="HOTEL" className="gap-2">
                        <Hotel className="h-4 w-4" /> Hotels
                      </TabsTrigger>
                      <TabsTrigger value="BUS" className="gap-2">
                        <Bus className="h-4 w-4" /> Buses
                      </TabsTrigger>
                    </TabsList>

                    {/* Flight / Bus Search */}
                    <TabsContent value="FLIGHT" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="From (e.g. Delhi)" value={from} onChange={(e) => setFrom(e.target.value)} className="pl-10" />
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="To (e.g. Mumbai)" value={to} onChange={(e) => setTo(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" />
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" placeholder="Return (optional)" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={passengers} onValueChange={setPassengers}>
                          <SelectTrigger><SelectValue placeholder="Passengers" /></SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} Passenger{n>1?"s":""}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={seatClass} onValueChange={setSeatClass}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ECONOMY">Economy</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="FIRST">First Class</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="HOTEL" className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="City or hotel name (e.g. Mumbai)" value={to} onChange={(e) => setTo(e.target.value)} className="pl-10" />
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" placeholder="Check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="pl-10" />
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" placeholder="Check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={rooms} onValueChange={setRooms}>
                          <SelectTrigger><SelectValue placeholder="Rooms" /></SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n} Room{n>1?"s":""}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={guests} onValueChange={setGuests}>
                          <SelectTrigger><SelectValue placeholder="Guests" /></SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} Guest{n>1?"s":""}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="BUS" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="From (e.g. Bangalore)" value={from} onChange={(e) => setFrom(e.target.value)} className="pl-10" />
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="To (e.g. Chennai)" value={to} onChange={(e) => setTo(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={passengers} onValueChange={setPassengers}>
                          <SelectTrigger><SelectValue placeholder="Passengers" /></SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} Passenger{n>1?"s":""}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <div /> {/* spacer */}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button size="lg" className="w-full mt-4 gap-2" onClick={handleSearch}>
                    <SearchIcon className="h-5 w-5" />
                    Search {activeTab === "FLIGHT" ? "Flights" : activeTab === "HOTEL" ? "Hotels" : "Buses"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-6">Popular Searches</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularSearches.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="hover:shadow-card cursor-pointer transition-all" onClick={() => handlePopularSearch(s)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {s.type === "FLIGHT" ? <Plane className="h-5 w-5 text-primary" /> : <Bus className="h-5 w-5 text-primary" />}
                        <div>
                          <p className="font-medium">{s.from} → {s.to}</p>
                          <p className="text-sm text-muted-foreground">Starting {s.price}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
