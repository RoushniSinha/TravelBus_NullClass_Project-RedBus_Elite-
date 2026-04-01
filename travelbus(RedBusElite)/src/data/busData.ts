export interface BusData {
  id: string;
  operator: string;
  busNumber: string;
  busType: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  rating: number;
  waypoints: [number, number][];
  liveLocation: [number, number];
  isActive: boolean;
  date: string;
}

export interface SeatData {
  seatNumber: string;
  type: 'WINDOW' | 'AISLE';
  deck: 'LOWER' | 'UPPER';
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'LADIES';
  price: number;
  lockedBy?: string;
  lockedUntil?: string;
  bookedBy?: string;
}

export interface BookingData {
  id: string;
  busId: string;
  operator: string;
  fromCity: string;
  toCity: string;
  date: string;
  departureTime: string;
  passengers: { name: string; age: number; gender: string; seatNumber: string }[];
  totalFare: number;
  baseFare: number;
  taxes: number;
  serviceFee: number;
  discount: number;
  couponCode?: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  pnr: string;
  createdAt: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface StoryData {
  id: string;
  authorName: string;
  title: string;
  body: string;
  image: string;
  route: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isFeatured: boolean;
}

export interface CouponData {
  code: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  maxDiscount: number;
  minPurchase: number;
  isActive: boolean;
}

export function generateSeats(busId: string): SeatData[] {
  const seats: SeatData[] = [];
  const decks: Array<'LOWER' | 'UPPER'> = ['LOWER', 'UPPER'];
  decks.forEach((deck, di) => {
    for (let row = 1; row <= 10; row++) {
      const cols = ['A', 'B', 'C', 'D'];
      cols.forEach((col, ci) => {
        const seatNumber = `${deck[0]}${row}${col}`;
        const rand = Math.random();
        let status: SeatData['status'] = 'AVAILABLE';
        if (rand < 0.3) status = 'BOOKED';
        else if (rand < 0.35 && ci === 0) status = 'LADIES';
        seats.push({
          seatNumber,
          type: ci === 0 || ci === 3 ? 'WINDOW' : 'AISLE',
          deck,
          status,
          price: deck === 'LOWER' ? 800 + row * 20 : 600 + row * 15,
        });
      });
    }
  });
  return seats;
}

export function generatePNR(): string {
  return 'RBE' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

const routes: [string, string, [number, number][], [number, number]][] = [
  ['Delhi', 'Agra', [[28.6139, 77.209], [27.88, 77.51], [27.1767, 78.0081]], [27.9, 77.7]],
  ['Mumbai', 'Pune', [[19.076, 72.8777], [18.9388, 73.3587], [18.5204, 73.8567]], [18.8, 73.5]],
  ['Bangalore', 'Chennai', [[12.9716, 77.5946], [12.8, 78.7], [13.0827, 80.2707]], [12.9, 79.0]],
  ['Hyderabad', 'Vijayawada', [[17.385, 78.4867], [16.8, 79.5], [16.5062, 80.648]], [17.0, 79.5]],
  ['Delhi', 'Jaipur', [[28.6139, 77.209], [27.6, 76.5], [26.9124, 75.7873]], [27.5, 76.2]],
  ['Chennai', 'Coimbatore', [[13.0827, 80.2707], [11.5, 78.5], [11.0168, 76.9558]], [12.0, 78.5]],
  ['Kolkata', 'Patna', [[22.5726, 88.3639], [24.0, 85.5], [25.6093, 85.1376]], [24.0, 86.0]],
  ['Ahmedabad', 'Mumbai', [[23.0225, 72.5714], [20.5, 73.0], [19.076, 72.8777]], [21.0, 73.0]],
  ['Pune', 'Goa', [[18.5204, 73.8567], [16.5, 73.8], [15.2993, 74.124]], [17.0, 73.9]],
  ['Bangalore', 'Hyderabad', [[12.9716, 77.5946], [15.0, 78.0], [17.385, 78.4867]], [15.0, 78.0]],
];

const operators = ['RedBus Express', 'VRL Travels', 'SRS Travels', 'Orange Tours', 'Kallada Travels',
  'KPN Travels', 'Neeta Travels', 'Paulo Travels', 'Greenline', 'IntrCity SmartBus'];
const busTypes = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Volvo Multi-Axle', 'AC Semi-Sleeper'];
const allAmenities = ['WiFi', 'USB Charging', 'AC', 'Entertainment', 'Snacks', 'Blanket', 'Water Bottle', 'Reading Light'];

export const mockBuses: BusData[] = routes.flatMap(([from, to, waypoints, live], ri) => {
  return [0, 1].map((j) => {
    const id = `BUS${String(ri * 2 + j + 1).padStart(3, '0')}`;
    const depHour = 6 + j * 10 + ri % 5;
    const dur = 4 + (ri % 4);
    const arrHour = depHour + dur;
    return {
      id,
      operator: operators[(ri * 2 + j) % operators.length],
      busNumber: `KA${10 + ri}-${1000 + j * 500 + ri}`,
      busType: busTypes[(ri * 2 + j) % busTypes.length],
      fromCity: from,
      toCity: to,
      departureTime: `${String(depHour % 24).padStart(2, '0')}:${j === 0 ? '00' : '30'}`,
      arrivalTime: `${String(arrHour % 24).padStart(2, '0')}:${j === 0 ? '00' : '30'}`,
      duration: `${dur}h ${j * 30}m`,
      price: 400 + ri * 100 + j * 200,
      totalSeats: 40,
      availableSeats: 15 + (ri + j) % 20,
      amenities: allAmenities.slice(0, 3 + (ri + j) % 5),
      rating: parseFloat((3.5 + ((ri + j) % 15) / 10).toFixed(1)),
      waypoints: waypoints,
      liveLocation: live,
      isActive: true,
      date: new Date().toISOString().split('T')[0],
    };
  });
});

export const mockCoupons: CouponData[] = [
  { code: 'SAVE10', type: 'PERCENTAGE', value: 10, maxDiscount: 200, minPurchase: 500, isActive: true },
  { code: 'FLAT100', type: 'FLAT', value: 100, maxDiscount: 100, minPurchase: 300, isActive: true },
  { code: 'FIRST50', type: 'PERCENTAGE', value: 50, maxDiscount: 500, minPurchase: 200, isActive: true },
  { code: 'SUMMER20', type: 'PERCENTAGE', value: 20, maxDiscount: 300, minPurchase: 600, isActive: true },
  { code: 'FLAT250', type: 'FLAT', value: 250, maxDiscount: 250, minPurchase: 1000, isActive: true },
];

export const mockStories: StoryData[] = [
  { id: 'ST001', authorName: 'Rahul Sharma', title: 'My Solo Trip to Goa on RedBus', body: 'An unforgettable journey through the Western Ghats. The Volvo bus was incredibly comfortable with reclining seats and USB charging. The scenic route via Pune offered breathtaking views of the mountains...', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', route: 'Pune → Goa', tags: ['Solo', 'Budget', 'Adventure'], likes: 156, comments: 23, createdAt: '2026-03-15', isFeatured: true },
  { id: 'ST002', authorName: 'Priya Patel', title: 'Family Road Trip: Mumbai to Pune', body: 'Traveling with kids can be challenging, but the AC Sleeper bus made it a breeze. The kids loved the entertainment system and the spacious seats. We arrived fresh and ready to explore Pune...', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600', route: 'Mumbai → Pune', tags: ['Family', 'Comfort'], likes: 89, comments: 15, createdAt: '2026-03-10', isFeatured: false },
  { id: 'ST003', authorName: 'Arjun Reddy', title: 'Night Journey: Hyderabad to Vijayawada', body: 'The overnight sleeper bus was a game-changer. I slept like a baby and woke up in Vijayawada, fresh and energized. The punctuality was remarkable — arrived exactly on time...', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600', route: 'Hyderabad → Vijayawada', tags: ['Solo', 'Night Travel'], likes: 67, comments: 8, createdAt: '2026-03-05', isFeatured: true },
  { id: 'ST004', authorName: 'Meera Nair', title: 'Exploring South India by Bus', body: 'From Bangalore to Chennai, every kilometer was an adventure. The bus stopped at amazing dhabas along the way. The AC was perfect and amenities were top-notch...', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', route: 'Bangalore → Chennai', tags: ['Adventure', 'Solo', 'Food'], likes: 234, comments: 45, createdAt: '2026-02-28', isFeatured: true },
  { id: 'ST005', authorName: 'Vikram Singh', title: 'Budget Travel: Delhi to Jaipur', body: 'Who says you need to spend a fortune to travel? The non-AC seater bus from Delhi to Jaipur cost me just ₹400 and was surprisingly comfortable. Great value for money...', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600', route: 'Delhi → Jaipur', tags: ['Budget', 'Solo'], likes: 112, comments: 19, createdAt: '2026-02-20', isFeatured: false },
  { id: 'ST006', authorName: 'Ananya Das', title: 'College Friends Reunion via Bus', body: 'Five friends, one bus, countless memories. Our trip from Kolkata to Patna was filled with laughter, chai breaks, and beautiful countryside views...', image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600', route: 'Kolkata → Patna', tags: ['Friends', 'Fun', 'Budget'], likes: 178, comments: 32, createdAt: '2026-02-15', isFeatured: false },
];

export const popularRoutes = [
  { from: 'Delhi', to: 'Agra', price: 400, duration: '4h' },
  { from: 'Mumbai', to: 'Pune', price: 500, duration: '4h' },
  { from: 'Bangalore', to: 'Chennai', price: 700, duration: '6h' },
  { from: 'Hyderabad', to: 'Vijayawada', price: 600, duration: '5h' },
  { from: 'Delhi', to: 'Jaipur', price: 550, duration: '5h' },
  { from: 'Chennai', to: 'Coimbatore', price: 800, duration: '7h' },
];

export const govBuses = [
  { name: 'APSRTC', rating: 3.85, logo: '🚌' },
  { name: 'TGSRTC', rating: 3.71, logo: '🚍' },
  { name: 'Kerala RTC', rating: 3.85, logo: '🚎' },
  { name: 'KTCL', rating: 3.83, logo: '🚐' },
];
