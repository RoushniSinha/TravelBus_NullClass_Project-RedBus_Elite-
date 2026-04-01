import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RoomSelection } from "@/components/rooms/RoomSelection";
import { useBooking } from "@/context/BookingContext";
import type { Room } from "@/types/api";

const BookingRoomSelect = () => {
  const navigate = useNavigate();
  const { booking, setSelectedRoom } = useBooking();
  const sp = booking.searchParams;

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    navigate("/booking/payment");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-24">
        <RoomSelection
          hotelId={booking.selectedResult?.id || "hotel001"}
          checkIn={sp?.checkIn || new Date().toISOString().split("T")[0]}
          checkOut={sp?.checkOut || new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]}
          guests={sp?.guests || 2}
          onSelect={handleRoomSelect}
        />
      </div>
      <Footer />
    </div>
  );
};

export default BookingRoomSelect;
