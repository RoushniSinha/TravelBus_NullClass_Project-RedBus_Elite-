import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plane, 
  Building2, 
  Bus, 
  Calendar, 
  Clock, 
  Users,
  MapPin,
  MoreVertical,
  Eye,
  XCircle,
  Download,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CancellationDialog, RefundTracker } from "./CancellationDialog";
import { mockBookings } from "@/data/mockData";
import type { Booking, CancellationReason } from "@/types/api";

const typeIcons = {
  FLIGHT: Plane,
  HOTEL: Building2,
  BUS: Bus,
};

const statusColors = {
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return booking.status === "CONFIRMED";
    if (filter === "completed") return booking.status === "COMPLETED";
    if (filter === "cancelled") return booking.status === "CANCELLED";
    return true;
  });

  const handleCancelBooking = async (reason: CancellationReason, customReason?: string) => {
    if (!selectedBooking) return;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: "CANCELLED" as const,
              cancellation: {
                id: `CN${Date.now()}`,
                bookingId: b.id,
                reason,
                customReason,
                requestedAt: new Date().toISOString(),
                refund: {
                  id: `RF${Date.now()}`,
                  bookingId: b.id,
                  originalAmount: b.totalAmount,
                  refundAmount: b.totalAmount,
                  refundPercentage: 100,
                  status: "INITIATED" as const,
                  initiatedAt: new Date().toISOString(),
                  paymentMethod: "Original Payment Method",
                },
              },
            }
          : b
      )
    );
  };

  const getBookingDetails = (booking: Booking) => {
    const details = booking.details;
    
    if (booking.type === "FLIGHT" && "flightNumber" in details) {
      return {
        title: `${details.departure} → ${details.arrival}`,
        subtitle: `${details.airline} • ${details.flightNumber}`,
        time: `${details.departureTime} - ${details.arrivalTime}`,
        passengers: details.passengers.length,
      };
    }
    
    if (booking.type === "HOTEL" && "hotelName" in details) {
      return {
        title: details.hotelName,
        subtitle: details.roomType,
        time: `${details.checkIn} to ${details.checkOut}`,
        passengers: details.guests,
      };
    }
    
    if (booking.type === "BUS" && "busOperator" in details) {
      return {
        title: `${details.departure} → ${details.arrival}`,
        subtitle: `${details.busOperator} • ${details.busType}`,
        time: details.departureTime,
        passengers: details.seatNumbers.length,
      };
    }
    
    return { title: "", subtitle: "", time: "", passengers: 0 };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all your travel bookings</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 bg-muted rounded-lg p-1">
          {(["all", "upcoming", "completed", "cancelled"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredBookings.map((booking, index) => {
          const Icon = typeIcons[booking.type];
          const details = getBookingDetails(booking);
          
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-elevated transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Type Icon */}
                    <div className="bg-primary/10 p-6 flex items-center justify-center md:w-24">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Booking Details */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{details.title}</h3>
                            <Badge className={statusColors[booking.status]}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{details.subtitle}</p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Ticket
                            </DropdownMenuItem>
                            {booking.status === "CONFIRMED" && (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setCancelDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {details.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {details.passengers} {details.passengers === 1 ? "Guest" : "Guests"}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                          <span className="text-sm text-muted-foreground">Total Amount</span>
                          <p className="text-xl font-bold text-primary">
                            ₹{booking.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Refund Tracker for Cancelled Bookings */}
                  {booking.cancellation && (
                    <div className="border-t p-4 bg-muted/30">
                      <RefundTracker
                        status={booking.cancellation.refund.status}
                        amount={booking.cancellation.refund.refundAmount}
                        initiatedAt={booking.cancellation.refund.initiatedAt}
                        completedAt={booking.cancellation.refund.completedAt}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        )}
      </div>

      <CancellationDialog
        booking={selectedBooking}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
}

export default BookingDashboard;
