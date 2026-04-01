import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Share2,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Plane,
  Hotel,
  Bus,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBooking } from "@/context/BookingContext";

const typeIcons = { FLIGHT: Plane, HOTEL: Hotel, BUS: Bus };

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { booking, resetBooking } = useBooking();
  const { selectedResult, selectedSeats, selectedRoom, passengerDetails, paymentInfo, bookingId } = booking;

  if (!selectedResult || !paymentInfo) {
    navigate("/search");
    return null;
  }

  const isHotel = selectedResult.type === "HOTEL";
  const Icon = typeIcons[selectedResult.type];

  const handleNewBooking = () => {
    resetBooking();
    navigate("/search");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking ID is <span className="font-mono font-bold text-foreground">{bookingId}</span>
            </p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Search", "Select", "Payment", "Confirm"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-sm hidden sm:inline text-foreground font-medium">{step}</span>
                {i < 3 && <div className="w-8 h-px bg-primary" />}
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="overflow-hidden">
              <div className="gradient-hero p-4 flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary-foreground" />
                <div>
                  <p className="text-primary-foreground font-semibold">{selectedResult.operator}</p>
                  <p className="text-primary-foreground/80 text-sm">
                    {isHotel ? selectedResult.name : `${selectedResult.from} → ${selectedResult.to}`}
                  </p>
                </div>
              </div>
              <CardContent className="p-6 space-y-5">
                {/* Trip Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {!isHotel && (
                    <>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Route</p>
                          <p className="font-medium">{selectedResult.from} → {selectedResult.to}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Departure</p>
                          <p className="font-medium">{selectedResult.departureTime} • {booking.searchParams?.date}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {isHotel && selectedRoom && (
                    <>
                      <div className="flex items-start gap-3">
                        <Hotel className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Room</p>
                          <p className="font-medium">Room {selectedRoom.roomNumber} - {selectedRoom.type}</p>
                          <p className="text-xs text-muted-foreground">{selectedRoom.bedType} bed • {selectedRoom.size} m²</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Stay</p>
                          <p className="font-medium">{booking.searchParams?.checkIn} → {booking.searchParams?.checkOut}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Seats */}
                {selectedSeats.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Seats</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((s) => (
                          <Badge key={s.id} className="text-sm">{s.seatNumber} ({s.type})</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Passenger */}
                {passengerDetails.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Traveler</p>
                        <p className="font-medium">{passengerDetails[0].name}</p>
                        <p className="text-xs text-muted-foreground">{passengerDetails[0].email} • {passengerDetails[0].phone}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Payment */}
                <Separator />
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{paymentInfo.method}</p>
                        <p className="text-xs text-muted-foreground font-mono">TXN: {paymentInfo.transactionId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">₹{paymentInfo.amount.toLocaleString()}</p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="h-4 w-4" /> Download Ticket
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" /> Share Details
              </Button>
              <Button className="flex-1 gap-2" onClick={handleNewBooking}>
                New Booking <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Info */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              A confirmation email has been sent to {passengerDetails[0]?.email || "your email"}.
              You can also view this booking in{" "}
              <button onClick={() => navigate("/my-bookings")} className="text-primary underline">
                My Bookings
              </button>.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
