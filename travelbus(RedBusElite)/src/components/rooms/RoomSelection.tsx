import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Bed, 
  Maximize, 
  Eye,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Bath,
  UtensilsCrossed,
  Star,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockRooms } from "@/data/mockData";
import type { Room } from "@/types/api";

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  TV: Tv,
  AC: Wind,
  "Mini Bar": Coffee,
  Bathtub: Bath,
  Kitchenette: UtensilsCrossed,
};

const roomTypeColors = {
  STANDARD: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DELUXE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  SUITE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  PREMIUM: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const viewLabels = {
  CITY: "🏙️ City View",
  GARDEN: "🌳 Garden View",
  POOL: "🏊 Pool View",
  SEA: "🌊 Sea View",
  MOUNTAIN: "⛰️ Mountain View",
};

interface RoomSelectionProps {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  onSelect: (room: Room) => void;
}

export function RoomSelection({ hotelId, checkIn, checkOut, guests, onSelect }: RoomSelectionProps) {
  const [rooms] = useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [previewRoom, setPreviewRoom] = useState<Room | null>(null);
  const [filter, setFilter] = useState<"all" | "available">("available");

  const filteredRooms = rooms.filter((room) => {
    if (filter === "available") return room.status === "AVAILABLE";
    return true;
  });

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">Select Your Room</h1>
          <p className="text-muted-foreground mt-2">
            {checkIn} to {checkOut} • {guests} Guest{guests > 1 ? "s" : ""} • {nights} Night{nights > 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Rooms
          </Button>
          <Button
            variant={filter === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("available")}
          >
            Available Only
          </Button>
        </div>

        {/* Room Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredRooms.map((room, index) => {
            const discount = Math.round((1 - room.currentPrice / room.basePrice) * 100);
            const isSelected = selectedRoom?.id === room.id;
            
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden transition-all cursor-pointer ${
                    isSelected 
                      ? "ring-2 ring-primary shadow-elevated" 
                      : room.status === "AVAILABLE" 
                        ? "hover:shadow-elevated" 
                        : "opacity-60"
                  }`}
                  onClick={() => room.status === "AVAILABLE" && setSelectedRoom(room)}
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img 
                      src={room.images[0]} 
                      alt={room.type}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={roomTypeColors[room.type]}>
                        {room.type}
                      </Badge>
                      {discount > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>
                    {room.status !== "AVAILABLE" && (
                      <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                        <span className="text-background font-semibold text-lg">
                          {room.status === "BOOKED" ? "Booked" : "Under Maintenance"}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-3 right-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewRoom(room);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    {/* Room Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Room {room.roomNumber}</h3>
                        <p className="text-sm text-muted-foreground">
                          {viewLabels[room.view]} • Floor {room.floor}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Up to {room.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span>{room.bedType}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Maximize className="h-4 w-4" />
                        <span>{room.size} m²</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.amenities.slice(0, 4).map((amenity) => {
                        const Icon = amenityIcons[amenity] || Building2;
                        return (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            <Icon className="h-3 w-3 mr-1" />
                            {amenity}
                          </Badge>
                        );
                      })}
                      {room.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-end justify-between pt-3 border-t">
                      <div>
                        {discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ₹{room.basePrice}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-primary">
                          ₹{room.currentPrice}
                        </span>
                        <span className="text-sm text-muted-foreground">/night</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total for {nights} nights</p>
                        <p className="font-semibold">₹{room.currentPrice * nights}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg"
          >
            <div className="container max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="font-semibold">Room {selectedRoom.roomNumber} - {selectedRoom.type}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{selectedRoom.currentPrice * nights} for {nights} nights
                </p>
              </div>
              <Button size="lg" onClick={() => onSelect(selectedRoom)}>
                Book This Room
              </Button>
            </div>
          </motion.div>
        )}

        {/* Room Preview Dialog */}
        <Dialog open={!!previewRoom} onOpenChange={() => setPreviewRoom(null)}>
          <DialogContent className="max-w-2xl">
            {previewRoom && (
              <>
                <DialogHeader>
                  <DialogTitle>Room {previewRoom.roomNumber} - {previewRoom.type}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <img 
                    src={previewRoom.images[0]} 
                    alt={previewRoom.type}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Room Details</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• {viewLabels[previewRoom.view]}</li>
                        <li>• Floor {previewRoom.floor}</li>
                        <li>• {previewRoom.size} m²</li>
                        <li>• {previewRoom.bedType} bed</li>
                        <li>• Up to {previewRoom.capacity} guests</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {previewRoom.amenities.map((amenity) => (
                          <li key={amenity}>• {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {previewRoom.status === "AVAILABLE" && (
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedRoom(previewRoom);
                        setPreviewRoom(null);
                      }}
                    >
                      Select This Room - ₹{previewRoom.currentPrice}/night
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default RoomSelection;
