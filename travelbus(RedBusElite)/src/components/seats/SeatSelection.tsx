import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Crown, 
  Footprints, 
  DoorOpen, 
  Info,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockSeatMap } from "@/data/mockData";
import type { Seat, SeatMap } from "@/types/api";

interface SeatSelectionProps {
  flightId: string;
  passengerCount: number;
  onSelect: (seats: Seat[]) => void;
}

const seatTypeColors = {
  AVAILABLE: "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 border-green-300 dark:border-green-700",
  BOOKED: "bg-muted cursor-not-allowed border-muted-foreground/20",
  BLOCKED: "bg-muted cursor-not-allowed border-muted-foreground/20",
  SELECTED: "bg-primary text-primary-foreground border-primary",
};

export function SeatSelection({ flightId, passengerCount, onSelect }: SeatSelectionProps) {
  const [seatMap, setSeatMap] = useState<SeatMap>(mockSeatMap);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "BOOKED" || seat.status === "BLOCKED") return;

    if (seat.status === "SELECTED") {
      // Deselect
      const updated = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(updated);
      updateSeatStatus(seat.id, "AVAILABLE");
    } else {
      // Select (if not at max)
      if (selectedSeats.length >= passengerCount) {
        // Remove oldest selection
        const oldest = selectedSeats[0];
        updateSeatStatus(oldest.id, "AVAILABLE");
        const updated = [...selectedSeats.slice(1), { ...seat, status: "SELECTED" as const }];
        setSelectedSeats(updated);
        updateSeatStatus(seat.id, "SELECTED");
      } else {
        setSelectedSeats([...selectedSeats, { ...seat, status: "SELECTED" as const }]);
        updateSeatStatus(seat.id, "SELECTED");
      }
    }
  };

  const updateSeatStatus = (seatId: string, status: Seat["status"]) => {
    setSeatMap((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => ({
        ...row,
        seats: row.seats.map((s) => (s.id === seatId ? { ...s, status } : s)),
      })),
    }));
  };

  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">Select Your Seats</h1>
          <p className="text-muted-foreground mt-2">
            {seatMap.aircraft} • Select {passengerCount} seat{passengerCount > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Seat Map</CardTitle>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-green-200 border border-green-400" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-primary" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-muted" />
                      <span>Booked</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Aircraft Nose */}
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-8 bg-muted rounded-t-full" />
                </div>

                {/* Seat Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-[400px]">
                    {/* Column Labels */}
                    <div className="flex justify-center mb-2 gap-1">
                      <div className="w-8" />
                      {["A", "B", "C", "", "D", "E", "F"].map((col, i) => (
                        <div 
                          key={i} 
                          className={`w-10 text-center text-sm font-medium text-muted-foreground ${col === "" ? "w-6" : ""}`}
                        >
                          {col}
                        </div>
                      ))}
                    </div>

                    {/* Rows */}
                    <div className="space-y-1">
                      {seatMap.rows.map((row) => (
                        <div key={row.rowNumber} className="flex justify-center items-center gap-1">
                          {/* Row Number */}
                          <div className="w-8 text-center text-sm font-medium text-muted-foreground">
                            {row.rowNumber}
                          </div>
                          
                          {/* Seats */}
                          {row.seats.slice(0, 3).map((seat) => (
                            <SeatButton 
                              key={seat.id} 
                              seat={seat} 
                              onClick={() => handleSeatClick(seat)} 
                            />
                          ))}
                          
                          {/* Aisle */}
                          <div className="w-6" />
                          
                          {row.seats.slice(3).map((seat) => (
                            <SeatButton 
                              key={seat.id} 
                              seat={seat} 
                              onClick={() => handleSeatClick(seat)} 
                            />
                          ))}
                          
                          {/* Exit Row Indicator */}
                          {row.isExitRow && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <DoorOpen className="h-3 w-3 mr-1" />
                              Exit
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Aircraft Tail */}
                <div className="flex justify-center mt-4">
                  <div className="w-24 h-6 bg-muted rounded-b-lg" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Summary */}
          <div className="space-y-4">
            {/* Selected Seats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Seats</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSeats.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSeats.map((seat) => (
                      <div 
                        key={seat.id} 
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
                            {seat.seatNumber}
                          </div>
                          <div>
                            <p className="font-medium">{seat.type} Seat</p>
                            <div className="flex gap-1 mt-0.5">
                              {seat.isPremium && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="h-3 w-3 mr-0.5" />
                                  Premium
                                </Badge>
                              )}
                              {seat.hasExtraLegroom && (
                                <Badge variant="secondary" className="text-xs">
                                  <Footprints className="h-3 w-3 mr-0.5" />
                                  Extra Legroom
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{seat.price}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs text-destructive"
                            onClick={() => handleSeatClick(seat)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No seats selected
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Seat Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seat Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">Premium Seat</p>
                    <p className="text-xs text-muted-foreground">Extra comfort & priority boarding</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Footprints className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Extra Legroom</p>
                    <p className="text-xs text-muted-foreground">More space for your legs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DoorOpen className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Exit Row</p>
                    <p className="text-xs text-muted-foreground">Quick exit access</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <Button 
              className="w-full" 
              size="lg"
              disabled={selectedSeats.length !== passengerCount}
              onClick={() => onSelect(selectedSeats)}
            >
              Continue with {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeatButtonProps {
  seat: Seat;
  onClick: () => void;
}

function SeatButton({ seat, onClick }: SeatButtonProps) {
  const isClickable = seat.status === "AVAILABLE" || seat.status === "SELECTED";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={isClickable ? { scale: 1.1 } : undefined}
          whileTap={isClickable ? { scale: 0.95 } : undefined}
          className={`
            w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-colors
            ${seatTypeColors[seat.status]}
            ${seat.isPremium ? "ring-2 ring-amber-400 ring-offset-1" : ""}
          `}
          onClick={onClick}
          disabled={!isClickable}
        >
          {seat.status === "SELECTED" ? (
            <Check className="h-5 w-5" />
          ) : seat.status === "BOOKED" ? (
            <X className="h-4 w-4 text-muted-foreground" />
          ) : (
            <span>{seat.isPremium && <Crown className="h-3 w-3 text-amber-500" />}</span>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <p className="font-medium">Seat {seat.seatNumber}</p>
          <p className="text-xs">{seat.type} • {seat.class}</p>
          {seat.status === "AVAILABLE" && (
            <p className="text-xs font-bold">₹{seat.price}</p>
          )}
          {seat.hasExtraLegroom && (
            <p className="text-xs text-green-600">Extra Legroom</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default SeatSelection;
