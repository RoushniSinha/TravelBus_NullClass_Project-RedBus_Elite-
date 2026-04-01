import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeatSelection } from "@/components/seats/SeatSelection";
import { toast } from "@/hooks/use-toast";
import type { Seat } from "@/types/api";

const SelectSeats = () => {
  const handleSeatSelect = (seats: Seat[]) => {
    toast({
      title: "Seats Selected!",
      description: `You selected ${seats.map(s => s.seatNumber).join(", ")}. Total: ₹${seats.reduce((acc, s) => acc + s.price, 0)}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <SeatSelection 
          flightId="FL001" 
          passengerCount={2} 
          onSelect={handleSeatSelect} 
        />
      </div>
      <Footer />
    </div>
  );
};

export default SelectSeats;
