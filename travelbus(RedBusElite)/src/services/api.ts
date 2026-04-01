// API Service Layer for Java Spring Boot Backend Integration
// Replace BASE_URL with your actual Spring Boot backend URL

import type {
  Booking,
  Cancellation,
  Refund,
  Review,
  CreateReviewRequest,
  ReviewReply,
  FlightStatus,
  SeatMap,
  Seat,
  SeatSelectionRequest,
  Room,
  RoomSelectionRequest,
  PricingInfo,
  PriceHistory,
  PriceFreeze,
  Recommendation,
  RecommendationFeedback,
  UserPreference,
  PaginatedResponse,
} from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('jwt_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// ==================== BOOKING & CANCELLATION APIs ====================
export const bookingApi = {
  // GET /api/bookings - Get all user bookings
  getBookings: () => apiRequest<Booking[]>('/bookings'),

  // GET /api/bookings/{id} - Get booking by ID
  getBooking: (id: string) => apiRequest<Booking>(`/bookings/${id}`),

  // POST /api/bookings/{id}/cancel - Cancel a booking
  cancelBooking: (id: string, reason: string, customReason?: string) =>
    apiRequest<Cancellation>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason, customReason }),
    }),

  // GET /api/refunds/{bookingId} - Get refund status
  getRefund: (bookingId: string) =>
    apiRequest<Refund>(`/refunds/${bookingId}`),
};

// ==================== REVIEW & RATING APIs ====================
export const reviewApi = {
  // GET /api/reviews/{entityId} - Get reviews for hotel/flight/bus
  getReviews: (entityId: string, params?: { page?: number; sort?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<PaginatedResponse<Review>>(
      `/reviews/${entityId}${query ? `?${query}` : ''}`
    );
  },

  // POST /api/reviews - Create a new review
  createReview: (review: CreateReviewRequest) =>
    apiRequest<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // POST /api/reviews/{id}/flag - Flag inappropriate review
  flagReview: (id: string, reason: string, description?: string) =>
    apiRequest<void>(`/reviews/${id}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason, description }),
    }),

  // POST /api/reviews/{id}/reply - Reply to a review
  replyToReview: (id: string, content: string) =>
    apiRequest<ReviewReply>(`/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // POST /api/reviews/{id}/helpful - Mark review as helpful
  markHelpful: (id: string) =>
    apiRequest<void>(`/reviews/${id}/helpful`, { method: 'POST' }),
};

// ==================== FLIGHT STATUS APIs ====================
export const flightApi = {
  // GET /api/flights/status/{flightNumber} - Get flight status
  getFlightStatus: (flightNumber: string) =>
    apiRequest<FlightStatus>(`/flights/status/${flightNumber}`),

  // GET /api/flights/search - Search flights
  searchFlights: (params: { from: string; to: string; date: string }) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest<FlightStatus[]>(`/flights/search?${query}`);
  },
};

// ==================== SEAT & ROOM SELECTION APIs ====================
export const seatApi = {
  // GET /api/seats/{flightId} - Get seat map
  getSeatMap: (flightId: string) =>
    apiRequest<SeatMap>(`/seats/${flightId}`),

  // POST /api/seats/select - Select a seat
  selectSeat: (request: SeatSelectionRequest) =>
    apiRequest<Seat>('/seats/select', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  // DELETE /api/seats/release/{seatId} - Release a seat
  releaseSeat: (seatId: string) =>
    apiRequest<void>(`/seats/release/${seatId}`, { method: 'DELETE' }),
};

export const roomApi = {
  // GET /api/rooms/{hotelId} - Get available rooms
  getRooms: (hotelId: string) =>
    apiRequest<Room[]>(`/rooms/${hotelId}`),

  // POST /api/rooms/select - Select a room
  selectRoom: (request: RoomSelectionRequest) =>
    apiRequest<Room>('/rooms/select', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};

// ==================== DYNAMIC PRICING APIs ====================
export const pricingApi = {
  // GET /api/pricing/{itemId} - Get current pricing
  getPricing: (itemId: string) =>
    apiRequest<PricingInfo>(`/pricing/${itemId}`),

  // GET /api/pricing/history/{itemId} - Get price history
  getPriceHistory: (itemId: string) =>
    apiRequest<PriceHistory>(`/pricing/history/${itemId}`),

  // POST /api/pricing/freeze/{itemId} - Freeze a price
  freezePrice: (itemId: string) =>
    apiRequest<PriceFreeze>(`/pricing/freeze/${itemId}`, {
      method: 'POST',
    }),
};

// ==================== RECOMMENDATION APIs ====================
export const recommendationApi = {
  // GET /api/recommendations/{userId} - Get recommendations
  getRecommendations: (userId: string) =>
    apiRequest<Recommendation[]>(`/recommendations/${userId}`),

  // POST /api/recommendations/feedback - Submit feedback
  submitFeedback: (feedback: RecommendationFeedback) =>
    apiRequest<void>('/recommendations/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    }),

  // GET /api/preferences/{userId} - Get user preferences
  getPreferences: (userId: string) =>
    apiRequest<UserPreference>(`/preferences/${userId}`),

  // PUT /api/preferences/{userId} - Update user preferences
  updatePreferences: (userId: string, preferences: Partial<UserPreference>) =>
    apiRequest<UserPreference>(`/preferences/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    }),
};

// ==================== AUTH APIs ====================
export const authApi = {
  // POST /api/auth/login
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: { id: string; email: string; name: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),

  // POST /api/auth/register
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest<{ token: string; user: { id: string; email: string; name: string } }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // POST /api/auth/logout
  logout: () =>
    apiRequest<void>('/auth/logout', { method: 'POST' }),
};
