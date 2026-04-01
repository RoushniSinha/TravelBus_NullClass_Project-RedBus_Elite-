import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RoomSelection } from "@/components/rooms/RoomSelection";
import { toast } from "@/hooks/use-toast";
import type { Room } from "@/types/api";

const SelectRoom = () => {
  const handleRoomSelect = (room: Room) => {
    toast({
      title: "Room Selected!",
      description: `You selected Room ${room.roomNumber} - ${room.type}. ₹${room.currentPrice}/night`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-24">
        <RoomSelection 
          hotelId="hotel001"
          checkIn="2024-03-15"
          checkOut="2024-03-18"
          guests={2}
          onSelect={handleRoomSelect} 
        />
      </div>
      <Footer />
    </div>
  );
};

export default SelectRoom;
