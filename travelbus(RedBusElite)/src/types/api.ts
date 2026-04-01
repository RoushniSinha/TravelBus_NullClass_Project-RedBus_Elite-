// API Types for Java Spring Boot Backend Integration
// These types match the expected DTOs from your Spring Boot backend

// ==================== BOOKING & CANCELLATION ====================
export interface Booking {
  id: string;
  userId: string;
  type: 'FLIGHT' | 'HOTEL' | 'BUS';
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';
  bookingDate: string;
  travelDate: string;
  totalAmount: number;
  details: FlightBookingDetails | HotelBookingDetails | BusBookingDetails;
  cancellation?: Cancellation;
}

export interface FlightBookingDetails {
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  passengers: Passenger[];
  seatClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface HotelBookingDetails {
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomCount: number;
}

export interface BusBookingDetails {
  busOperator: string;
  busType: string;
  departure: string;
  arrival: string;
  departureTime: string;
  seatNumbers: string[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  seatNumber?: string;
}

export interface Cancellation {
  id: string;
  bookingId: string;
  reason: CancellationReason;
  customReason?: string;
  requestedAt: string;
  processedAt?: string;
  refund: Refund;
}

export type CancellationReason = 
  | 'CHANGE_OF_PLANS'
  | 'MEDICAL_EMERGENCY'
  | 'WEATHER_CONDITIONS'
  | 'BETTER_PRICE_FOUND'
  | 'SCHEDULE_CONFLICT'
  | 'OTHER';

export interface Refund {
  id: string;
  bookingId: string;
  originalAmount: number;
  refundAmount: number;
  refundPercentage: number;
  status: RefundStatus;
  initiatedAt: string;
  completedAt?: string;
  paymentMethod: string;
}

export type RefundStatus = 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// ==================== REVIEW & RATING ====================
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  entityId: string;
  entityType: 'HOTEL' | 'FLIGHT' | 'BUS';
  rating: number;
  title: string;
  content: string;
  images: ReviewImage[];
  createdAt: string;
  updatedAt?: string;
  helpfulCount: number;
  isVerifiedBooking: boolean;
  reply?: ReviewReply;
  flagged: boolean;
}

export interface ReviewImage {
  id: string;
  url: string;
  caption?: string;
}

export interface ReviewReply {
  id: string;
  content: string;
  authorName: string;
  authorRole: 'ADMIN' | 'OWNER';
  createdAt: string;
}

export interface ReviewFlag {
  id: string;
  reviewId: string;
  reason: 'INAPPROPRIATE' | 'SPAM' | 'FAKE' | 'OFFENSIVE';
  description?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface CreateReviewRequest {
  entityId: string;
  entityType: 'HOTEL' | 'FLIGHT' | 'BUS';
  rating: number;
  title: string;
  content: string;
  images?: File[];
}

// ==================== FLIGHT STATUS ====================
export interface FlightStatus {
  flightNumber: string;
  airline: string;
  status: FlightStatusType;
  departure: AirportInfo;
  arrival: AirportInfo;
  scheduledDeparture: string;
  scheduledArrival: string;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  actualDeparture?: string;
  actualArrival?: string;
  delayMinutes: number;
  delayReason?: string;
  gate?: string;
  terminal?: string;
  aircraft?: string;
  lastUpdated: string;
}

export type FlightStatusType = 
  | 'SCHEDULED'
  | 'BOARDING'
  | 'DEPARTED'
  | 'IN_FLIGHT'
  | 'LANDED'
  | 'ARRIVED'
  | 'DELAYED'
  | 'CANCELLED';

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
}

// ==================== SEAT & ROOM SELECTION ====================
export interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  column: string;
  type: 'WINDOW' | 'MIDDLE' | 'AISLE';
  class: 'ECONOMY' | 'BUSINESS' | 'FIRST';
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'SELECTED';
  price: number;
  isPremium: boolean;
  hasExtraLegroom: boolean;
  isEmergencyExit: boolean;
}

export interface SeatMap {
  flightId: string;
  aircraft: string;
  rows: SeatRow[];
}

export interface SeatRow {
  rowNumber: number;
  seats: Seat[];
  isExitRow: boolean;
}

export interface Room {
  id: string;
  roomNumber: string;
  type: 'STANDARD' | 'DELUXE' | 'SUITE' | 'PREMIUM';
  floor: number;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
  basePrice: number;
  currentPrice: number;
  capacity: number;
  bedType: 'SINGLE' | 'DOUBLE' | 'QUEEN' | 'KING' | 'TWIN';
  amenities: string[];
  images: string[];
  view: 'CITY' | 'GARDEN' | 'POOL' | 'SEA' | 'MOUNTAIN';
  size: number; // in sq meters
}

export interface SeatSelectionRequest {
  flightId: string;
  passengerId: string;
  seatId: string;
}

export interface RoomSelectionRequest {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

// ==================== DYNAMIC PRICING ====================
export interface PricingInfo {
  itemId: string;
  itemType: 'FLIGHT' | 'HOTEL' | 'BUS';
  basePrice: number;
  currentPrice: number;
  discount?: number;
  priceFactors: PriceFactor[];
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  priceFreeze?: PriceFreeze;
  lastUpdated: string;
}

export interface PriceFactor {
  type: 'DEMAND' | 'HOLIDAY' | 'WEEKEND' | 'SEASONAL' | 'EARLY_BIRD' | 'LAST_MINUTE';
  impact: number; // percentage change
  description: string;
}

export interface PriceHistory {
  itemId: string;
  dataPoints: PriceDataPoint[];
}

export interface PriceDataPoint {
  date: string;
  price: number;
  demandLevel: string;
}

export interface PriceFreeze {
  id: string;
  itemId: string;
  frozenPrice: number;
  freezeFee: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'USED';
}

// ==================== AI RECOMMENDATIONS ====================
export interface Recommendation {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'FLIGHT' | 'HOTEL' | 'BUS';
  item: RecommendedItem;
  score: number;
  reasons: RecommendationReason[];
  createdAt: string;
}

export interface RecommendedItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  location?: string;
}

export interface RecommendationReason {
  type: 'PAST_BOOKING' | 'SIMILAR_USERS' | 'TRENDING' | 'PRICE_DROP' | 'LOCATION_PREFERENCE' | 'RATING';
  description: string;
  confidence: number;
}

export interface UserPreference {
  id: string;
  userId: string;
  preferredAirlines: string[];
  preferredHotelChains: string[];
  budgetRange: { min: number; max: number };
  preferredAmenities: string[];
  travelStyle: 'BUDGET' | 'COMFORT' | 'LUXURY';
}

export interface RecommendationFeedback {
  recommendationId: string;
  feedback: 'LIKE' | 'DISLIKE';
  reason?: string;
}

// ==================== API RESPONSE WRAPPERS ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}
