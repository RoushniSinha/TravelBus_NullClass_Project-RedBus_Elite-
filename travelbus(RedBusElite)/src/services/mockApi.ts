import { mockBuses, generateSeats, mockStories, mockCoupons, type BusData, type SeatData, type BookingData, type StoryData } from '@/data/busData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// In-memory stores
let bookings: BookingData[] = JSON.parse(localStorage.getItem('rbe_bookings') || '[]');
let seatCache: Record<string, SeatData[]> = {};

function saveBookings() {
  localStorage.setItem('rbe_bookings', JSON.stringify(bookings));
}

export const busApi = {
  search: async (from: string, to: string, date: string): Promise<BusData[]> => {
    await delay(400);
    const fl = from.toLowerCase(), tl = to.toLowerCase();
    return mockBuses.filter(b =>
      b.fromCity.toLowerCase().includes(fl) && b.toCity.toLowerCase().includes(tl)
    );
  },

  getSeats: async (busId: string): Promise<SeatData[]> => {
    await delay(300);
    if (!seatCache[busId]) seatCache[busId] = generateSeats(busId);
    return seatCache[busId];
  },

  lockSeats: async (busId: string, seatNumbers: string[], userId: string): Promise<boolean> => {
    await delay(200);
    const seats = seatCache[busId] || generateSeats(busId);
    seatNumbers.forEach(sn => {
      const seat = seats.find(s => s.seatNumber === sn);
      if (seat && seat.status === 'AVAILABLE') {
        seat.status = 'LOCKED';
        seat.lockedBy = userId;
        seat.lockedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      }
    });
    seatCache[busId] = seats;
    return true;
  },

  unlockSeats: async (busId: string, seatNumbers: string[]): Promise<boolean> => {
    await delay(100);
    const seats = seatCache[busId];
    if (seats) {
      seatNumbers.forEach(sn => {
        const seat = seats.find(s => s.seatNumber === sn);
        if (seat && seat.status === 'LOCKED') {
          seat.status = 'AVAILABLE';
          seat.lockedBy = undefined;
          seat.lockedUntil = undefined;
        }
      });
    }
    return true;
  },
};

export const bookingApi = {
  create: async (booking: Omit<BookingData, 'id' | 'pnr' | 'status' | 'createdAt'>): Promise<BookingData> => {
    await delay(500);
    const newBooking: BookingData = {
      ...booking,
      id: `BK${Date.now()}`,
      pnr: `RBE${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    saveBookings();
    return newBooking;
  },

  getMyBookings: async (): Promise<BookingData[]> => {
    await delay(300);
    bookings = JSON.parse(localStorage.getItem('rbe_bookings') || '[]');
    return bookings;
  },

  cancel: async (bookingId: string): Promise<BookingData | null> => {
    await delay(400);
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      bookings[idx].status = 'CANCELLED';
      saveBookings();
      return bookings[idx];
    }
    return null;
  },
};

export const storyApi = {
  getAll: async (tag?: string): Promise<StoryData[]> => {
    await delay(300);
    if (tag && tag !== 'All') return mockStories.filter(s => s.tags.includes(tag));
    return mockStories;
  },

  like: async (storyId: string): Promise<void> => {
    await delay(100);
  },
};

export const couponApi = {
  validate: async (code: string, amount: number): Promise<{ valid: boolean; discount: number; message: string }> => {
    await delay(300);
    const coupon = mockCoupons.find(c => c.code === code.toUpperCase());
    if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
    if (!coupon.isActive) return { valid: false, discount: 0, message: 'Coupon expired' };
    if (amount < coupon.minPurchase) return { valid: false, discount: 0, message: `Minimum purchase ₹${coupon.minPurchase}` };
    let discount = coupon.type === 'PERCENTAGE' ? Math.min(amount * coupon.value / 100, coupon.maxDiscount) : coupon.value;
    return { valid: true, discount, message: `₹${discount} off applied!` };
  },
};
