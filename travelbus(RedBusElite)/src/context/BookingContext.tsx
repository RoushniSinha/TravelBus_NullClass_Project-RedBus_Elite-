import { createContext, useContext, useState, ReactNode } from "react";
import type { Seat, Room } from "@/types/api";

export type BookingType = "FLIGHT" | "HOTEL" | "BUS";

export interface SearchParams {
  type: BookingType;
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers: number;
  class?: string;
  // Hotel specific
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  guests?: number;
}

export interface SearchResult {
  id: string;
  type: BookingType;
  name: string;
  operator: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  features: string[];
  seatsAvailable?: number;
  // Hotel specific
  roomType?: string;
  amenities?: string[];
}

export interface BookingData {
  searchParams: SearchParams | null;
  selectedResult: SearchResult | null;
  selectedSeats: Seat[];
  selectedRoom: Room | null;
  passengerDetails: PassengerDetail[];
  paymentInfo: PaymentInfo | null;
  bookingId: string | null;
}

export interface PassengerDetail {
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  email?: string;
  phone?: string;
}

export interface PaymentInfo {
  method: "CARD" | "UPI" | "NETBANKING" | "WALLET";
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId?: string;
  amount: number;
}

interface BookingContextType {
  booking: BookingData;
  setSearchParams: (params: SearchParams) => void;
  setSelectedResult: (result: SearchResult) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  setSelectedRoom: (room: Room) => void;
  setPassengerDetails: (details: PassengerDetail[]) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  setBookingId: (id: string) => void;
  resetBooking: () => void;
}

const defaultBooking: BookingData = {
  searchParams: null,
  selectedResult: null,
  selectedSeats: [],
  selectedRoom: null,
  passengerDetails: [],
  paymentInfo: null,
  bookingId: null,
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingData>(defaultBooking);

  return (
    <BookingContext.Provider
      value={{
        booking,
        setSearchParams: (params) => setBooking((b) => ({ ...b, searchParams: params })),
        setSelectedResult: (result) => setBooking((b) => ({ ...b, selectedResult: result })),
        setSelectedSeats: (seats) => setBooking((b) => ({ ...b, selectedSeats: seats })),
        setSelectedRoom: (room) => setBooking((b) => ({ ...b, selectedRoom: room })),
        setPassengerDetails: (details) => setBooking((b) => ({ ...b, passengerDetails: details })),
        setPaymentInfo: (info) => setBooking((b) => ({ ...b, paymentInfo: info })),
        setBookingId: (id) => setBooking((b) => ({ ...b, bookingId: id })),
        resetBooking: () => setBooking(defaultBooking),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
