import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeatSelection } from "@/components/seats/SeatSelection";
import { useBooking } from "@/context/BookingContext";
import type { Seat } from "@/types/api";

const BookingSeatSelect = () => {
  const navigate = useNavigate();
  const { booking, setSelectedSeats } = useBooking();

  const handleSeatSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
    navigate("/booking/payment");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <SeatSelection
          flightId={booking.selectedResult?.id || "FL001"}
          passengerCount={booking.searchParams?.passengers || 1}
          onSelect={handleSeatSelect}
        />
      </div>
      <Footer />
    </div>
  );
};

export default BookingSeatSelect;
