import { Bus } from './models/Bus';
import { Route } from './models/Route';
import { Coupon } from './models/Coupon';
import { Story } from './models/Story';
import { ForumPost } from './models/Forum';

const dayMap: Record<string, number> = {
  'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
};

const busesData = [
  // ═══ NORTH INDIA — Uttar Pradesh, Delhi, Punjab, Haryana, Himachal ═══
  {
    busNumber: 'RBE-UP-001',
    operator: 'Pawan Hans Travels',
    busType: 'AC Sleeper',
    fromCity: 'Delhi',
    toCity: 'Lucknow',
    departureTime: '22:00',
    arrivalTime: '06:00',
    duration: '8h 00m',
    distance: '555 km',
    price: 850,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point', 'Reading Light'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.2,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-UP-002',
    operator: 'Raj National Express',
    busType: 'Non-AC Sleeper',
    fromCity: 'Delhi',
    toCity: 'Varanasi',
    departureTime: '20:30',
    arrivalTime: '07:30',
    duration: '11h 00m',
    distance: '821 km',
    price: 600,
    totalSeats: 40,
    amenities: ['Fan', 'Charging Point', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.8,
    busClass: 'ECONOMY'
  },
  {
    busNumber: 'RBE-UP-003',
    operator: 'Orange Travels',
    busType: 'Volvo AC',
    fromCity: 'Delhi',
    toCity: 'Agra',
    departureTime: '06:00',
    arrivalTime: '09:30',
    duration: '3h 30m',
    distance: '233 km',
    price: 450,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.5,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-PB-001',
    operator: 'PEPSU Road Transport',
    busType: 'AC Seater',
    fromCity: 'Delhi',
    toCity: 'Amritsar',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h 00m',
    distance: '449 km',
    price: 700,
    totalSeats: 52,
    amenities: ['AC', 'Charging Point', 'Water Bottle', 'Movie'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.0,
    busClass: 'STANDARD'
  },
  {
    busNumber: 'RBE-HP-001',
    operator: 'HRTC Himachal',
    busType: 'Volvo AC',
    fromCity: 'Delhi',
    toCity: 'Manali',
    departureTime: '17:30',
    arrivalTime: '08:30',
    duration: '15h 00m',
    distance: '540 km',
    price: 1200,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'Pillow', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Wed','Fri','Sat','Sun'],
    rating: 4.3,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-HR-001',
    operator: 'Haryana Roadways',
    busType: 'Non-AC Seater',
    fromCity: 'Delhi',
    toCity: 'Chandigarh',
    departureTime: '08:00',
    arrivalTime: '11:30',
    duration: '3h 30m',
    distance: '248 km',
    price: 280,
    totalSeats: 52,
    amenities: ['Fan', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.5,
    busClass: 'ECONOMY'
  },
  // ═══ WEST INDIA — Maharashtra, Gujarat, Rajasthan, Goa ═══
  {
    busNumber: 'RBE-MH-001',
    operator: 'VRL Travels',
    busType: 'Scania AC',
    fromCity: 'Mumbai',
    toCity: 'Pune',
    departureTime: '07:00',
    arrivalTime: '10:30',
    duration: '3h 30m',
    distance: '149 km',
    price: 550,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Water Bottle', 'Snacks', 'Movie'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.6,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-MH-002',
    operator: 'Neeta Tours',
    busType: 'AC Sleeper',
    fromCity: 'Mumbai',
    toCity: 'Goa',
    departureTime: '21:00',
    arrivalTime: '07:00',
    duration: '10h 00m',
    distance: '594 km',
    price: 950,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Pillow', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.4,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-MH-003',
    operator: 'Shivneri MSRTC',
    busType: 'Volvo AC',
    fromCity: 'Pune',
    toCity: 'Mumbai',
    departureTime: '06:30',
    arrivalTime: '10:00',
    duration: '3h 30m',
    distance: '149 km',
    price: 500,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.5,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-GJ-001',
    operator: 'GSRTC Gujarat',
    busType: 'AC Seater',
    fromCity: 'Ahmedabad',
    toCity: 'Surat',
    departureTime: '09:00',
    arrivalTime: '13:00',
    duration: '4h 00m',
    distance: '264 km',
    price: 380,
    totalSeats: 52,
    amenities: ['AC', 'Charging Point', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.9,
    busClass: 'STANDARD'
  },
  {
    busNumber: 'RBE-GJ-002',
    operator: 'Patel Travels',
    busType: 'Volvo AC',
    fromCity: 'Ahmedabad',
    toCity: 'Mumbai',
    departureTime: '20:00',
    arrivalTime: '06:00',
    duration: '10h 00m',
    distance: '524 km',
    price: 900,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.2,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-RJ-001',
    operator: 'Rajasthan RSRTC',
    busType: 'AC Sleeper',
    fromCity: 'Jaipur',
    toCity: 'Delhi',
    departureTime: '23:00',
    arrivalTime: '05:30',
    duration: '6h 30m',
    distance: '281 km',
    price: 650,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.1,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-RJ-002',
    operator: 'Bikaner Express',
    busType: 'Non-AC Sleeper',
    fromCity: 'Jaipur',
    toCity: 'Jodhpur',
    departureTime: '21:00',
    arrivalTime: '03:30',
    duration: '6h 30m',
    distance: '345 km',
    price: 420,
    totalSeats: 40,
    amenities: ['Fan', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.7,
    busClass: 'ECONOMY'
  },
  {
    busNumber: 'RBE-GA-001',
    operator: 'Kadamba KTC',
    busType: 'Volvo AC',
    fromCity: 'Panaji',
    toCity: 'Mumbai',
    departureTime: '18:00',
    arrivalTime: '05:00',
    duration: '11h 00m',
    distance: '594 km',
    price: 1100,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'USB Charging', 'Water Bottle', 'Snacks', 'Movie'],
    operatesOn: ['Mon','Wed','Fri','Sat','Sun'],
    rating: 4.4,
    busClass: 'LUXURY'
  },
  // ═══ SOUTH INDIA — Tamil Nadu, Kerala, Karnataka, Andhra, Telangana ═══
  {
    busNumber: 'RBE-TN-001',
    operator: 'TNSTC Tamil Nadu',
    busType: 'AC Sleeper',
    fromCity: 'Chennai',
    toCity: 'Bangalore',
    departureTime: '22:30',
    arrivalTime: '05:30',
    duration: '7h 00m',
    distance: '346 km',
    price: 750,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point', 'Reading Light'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.3,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-TN-002',
    operator: 'SRM Travels',
    busType: 'Scania AC',
    fromCity: 'Chennai',
    toCity: 'Coimbatore',
    departureTime: '21:00',
    arrivalTime: '05:00',
    duration: '8h 00m',
    distance: '497 km',
    price: 900,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Blanket', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.6,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-TN-003',
    operator: 'Sugama Tourist',
    busType: 'Non-AC Sleeper',
    fromCity: 'Chennai',
    toCity: 'Madurai',
    departureTime: '20:00',
    arrivalTime: '04:30',
    duration: '8h 30m',
    distance: '461 km',
    price: 520,
    totalSeats: 40,
    amenities: ['Fan', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.8,
    busClass: 'ECONOMY'
  },
  {
    busNumber: 'RBE-KL-001',
    operator: 'KSRTC Kerala',
    busType: 'Volvo AC',
    fromCity: 'Thiruvananthapuram',
    toCity: 'Kochi',
    departureTime: '08:00',
    arrivalTime: '12:30',
    duration: '4h 30m',
    distance: '215 km',
    price: 480,
    totalSeats: 36,
    amenities: ['AC', 'USB Charging', 'Water Bottle', 'WiFi'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.5,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-KL-002',
    operator: 'Kallada Travels',
    busType: 'AC Sleeper',
    fromCity: 'Kochi',
    toCity: 'Bangalore',
    departureTime: '21:30',
    arrivalTime: '06:00',
    duration: '8h 30m',
    distance: '562 km',
    price: 900,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Pillow', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.4,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-KA-001',
    operator: 'KSRTC Airavat',
    busType: 'Scania AC',
    fromCity: 'Bangalore',
    toCity: 'Mysuru',
    departureTime: '07:00',
    arrivalTime: '10:30',
    duration: '3h 30m',
    distance: '144 km',
    price: 400,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.7,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-KA-002',
    operator: 'Chartered Speed',
    busType: 'Volvo AC',
    fromCity: 'Bangalore',
    toCity: 'Hyderabad',
    departureTime: '22:00',
    arrivalTime: '07:00',
    duration: '9h 00m',
    distance: '574 km',
    price: 950,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'USB Charging', 'Water Bottle', 'Snacks', 'Movie'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.5,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-AP-001',
    operator: 'APSRTC Andhra',
    busType: 'AC Sleeper',
    fromCity: 'Visakhapatnam',
    toCity: 'Hyderabad',
    departureTime: '20:00',
    arrivalTime: '07:00',
    duration: '11h 00m',
    distance: '621 km',
    price: 850,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.1,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-TS-001',
    operator: 'TSRTC Telangana',
    busType: 'Volvo AC',
    fromCity: 'Hyderabad',
    toCity: 'Chennai',
    departureTime: '21:00',
    arrivalTime: '06:30',
    duration: '9h 30m',
    distance: '627 km',
    price: 1000,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.3,
    busClass: 'LUXURY'
  },
  // ═══ EAST INDIA — West Bengal, Odisha, Bihar, Jharkhand ═══
  {
    busNumber: 'RBE-WB-001',
    operator: 'Shyamoli NR Travels',
    busType: 'AC Sleeper',
    fromCity: 'Kolkata',
    toCity: 'Bhubaneswar',
    departureTime: '21:30',
    arrivalTime: '06:00',
    duration: '8h 30m',
    distance: '440 km',
    price: 750,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.0,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-WB-002',
    operator: 'SBSTC Bengal',
    busType: 'AC Seater',
    fromCity: 'Kolkata',
    toCity: 'Patna',
    departureTime: '18:00',
    arrivalTime: '06:00',
    duration: '12h 00m',
    distance: '600 km',
    price: 650,
    totalSeats: 52,
    amenities: ['AC', 'Charging Point', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.7,
    busClass: 'STANDARD'
  },
  {
    busNumber: 'RBE-OR-001',
    operator: 'OSRTC Odisha',
    busType: 'Non-AC Sleeper',
    fromCity: 'Bhubaneswar',
    toCity: 'Visakhapatnam',
    departureTime: '22:00',
    arrivalTime: '06:30',
    duration: '8h 30m',
    distance: '440 km',
    price: 500,
    totalSeats: 40,
    amenities: ['Fan', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Wed','Fri','Sat','Sun'],
    rating: 3.6,
    busClass: 'ECONOMY'
  },
  {
    busNumber: 'RBE-BR-001',
    operator: 'Bihar BSRTC',
    busType: 'AC Seater',
    fromCity: 'Patna',
    toCity: 'Varanasi',
    departureTime: '06:00',
    arrivalTime: '10:30',
    duration: '4h 30m',
    distance: '247 km',
    price: 350,
    totalSeats: 52,
    amenities: ['AC', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.8,
    busClass: 'STANDARD'
  },
  // ═══ CENTRAL INDIA — Madhya Pradesh, Chhattisgarh ═══
  {
    busNumber: 'RBE-MP-001',
    operator: 'MP Tourism MPSRTC',
    busType: 'Volvo AC',
    fromCity: 'Bhopal',
    toCity: 'Indore',
    departureTime: '08:00',
    arrivalTime: '11:30',
    duration: '3h 30m',
    distance: '193 km',
    price: 420,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.2,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-MP-002',
    operator: 'Intercity Travels',
    busType: 'AC Sleeper',
    fromCity: 'Indore',
    toCity: 'Mumbai',
    departureTime: '20:30',
    arrivalTime: '06:30',
    duration: '10h 00m',
    distance: '587 km',
    price: 850,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Pillow', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.1,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-CG-001',
    operator: 'CSRTC Chhattisgarh',
    busType: 'Non-AC Seater',
    fromCity: 'Raipur',
    toCity: 'Nagpur',
    departureTime: '07:00',
    arrivalTime: '12:00',
    duration: '5h 00m',
    distance: '296 km',
    price: 300,
    totalSeats: 52,
    amenities: ['Fan', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 3.5,
    busClass: 'ECONOMY'
  },
  // ═══ NORTHEAST INDIA — Assam, Meghalaya, Tripura ═══
  {
    busNumber: 'RBE-AS-001',
    operator: 'ASTC Assam',
    busType: 'AC Seater',
    fromCity: 'Guwahati',
    toCity: 'Shillong',
    departureTime: '09:00',
    arrivalTime: '12:00',
    duration: '3h 00m',
    distance: '105 km',
    price: 320,
    totalSeats: 52,
    amenities: ['AC', 'Charging Point', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.0,
    busClass: 'STANDARD'
  },
  {
    busNumber: 'RBE-AS-002',
    operator: 'Network Travels NE',
    busType: 'Volvo AC',
    fromCity: 'Guwahati',
    toCity: 'Kolkata',
    departureTime: '15:00',
    arrivalTime: '12:00',
    duration: '21h 00m',
    distance: '1000 km',
    price: 1500,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'Pillow', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Wed','Fri','Sun'],
    rating: 4.1,
    busClass: 'LUXURY'
  },
  // ═══ NORTHWEST — Jammu & Kashmir, Uttarakhand ═══
  {
    busNumber: 'RBE-JK-001',
    operator: 'JKSRTC Kashmir',
    busType: 'Volvo AC',
    fromCity: 'Jammu',
    toCity: 'Srinagar',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    distance: '266 km',
    price: 750,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'USB Charging', 'Water Bottle'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.2,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-UK-001',
    operator: 'UPSRTC Uttarakhand',
    busType: 'AC Sleeper',
    fromCity: 'Delhi',
    toCity: 'Dehradun',
    departureTime: '23:00',
    arrivalTime: '05:00',
    duration: '6h 00m',
    distance: '302 km',
    price: 700,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.0,
    busClass: 'PREMIUM'
  },
  // ═══ LONG DISTANCE INTER-STATE ═══
  {
    busNumber: 'RBE-LD-001',
    operator: 'SRS Travels',
    busType: 'Scania AC',
    fromCity: 'Bangalore',
    toCity: 'Mumbai',
    departureTime: '19:00',
    arrivalTime: '09:00',
    duration: '14h 00m',
    distance: '984 km',
    price: 1400,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'Blanket', 'Pillow', 'USB Charging', 'Water Bottle', 'Snacks', 'Movie'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.6,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-LD-002',
    operator: 'Greenline Travels',
    busType: 'AC Sleeper',
    fromCity: 'Chennai',
    toCity: 'Hyderabad',
    departureTime: '21:30',
    arrivalTime: '06:30',
    duration: '9h 00m',
    distance: '627 km',
    price: 850,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.2,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-LD-003',
    operator: 'Zingbus Premium',
    busType: 'Volvo AC',
    fromCity: 'Delhi',
    toCity: 'Jaipur',
    departureTime: '06:00',
    arrivalTime: '10:30',
    duration: '4h 30m',
    distance: '281 km',
    price: 600,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.5,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-LD-004',
    operator: 'NueGo Electric',
    busType: 'Scania AC',
    fromCity: 'Hyderabad',
    toCity: 'Bangalore',
    departureTime: '08:00',
    arrivalTime: '17:00',
    duration: '9h 00m',
    distance: '574 km',
    price: 1100,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'USB Charging', 'Blanket', 'Water Bottle', 'Snacks', 'Movie'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.7,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-LD-005',
    operator: 'IntrCity SmartBus',
    busType: 'Volvo AC',
    fromCity: 'Mumbai',
    toCity: 'Ahmedabad',
    departureTime: '22:30',
    arrivalTime: '07:30',
    duration: '9h 00m',
    distance: '524 km',
    price: 950,
    totalSeats: 36,
    amenities: ['AC', 'WiFi', 'Blanket', 'USB Charging', 'Water Bottle', 'Snacks'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.5,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-LD-006',
    operator: 'Paulo Travels',
    busType: 'AC Sleeper',
    fromCity: 'Goa',
    toCity: 'Bangalore',
    departureTime: '20:00',
    arrivalTime: '05:30',
    duration: '9h 30m',
    distance: '562 km',
    price: 900,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Pillow', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.3,
    busClass: 'PREMIUM'
  },
  // ═══ BIHAR SPECIAL — Patna to Delhi ═══
  {
    busNumber: 'RBE-BR-002',
    operator: 'Bihar State Transport',
    busType: 'AC Sleeper',
    fromCity: 'Patna',
    toCity: 'Delhi',
    departureTime: '16:00',
    arrivalTime: '08:00',
    duration: '16h 00m',
    distance: '1050 km',
    price: 1250,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point', 'WiFi'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.4,
    busClass: 'PREMIUM'
  },
  {
    busNumber: 'RBE-BR-003',
    operator: 'Patliputra Travels',
    busType: 'Volvo AC',
    fromCity: 'Patna',
    toCity: 'Delhi',
    departureTime: '18:30',
    arrivalTime: '10:30',
    duration: '16h 00m',
    distance: '1050 km',
    price: 1500,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'Pillow', 'Water Bottle', 'Charging Point', 'Snacks'],
    operatesOn: ['Mon','Wed','Fri','Sun'],
    rating: 4.7,
    busClass: 'LUXURY'
  },
  {
    busNumber: 'RBE-BR-004',
    operator: 'Ganga Express',
    busType: 'Non-AC Sleeper',
    fromCity: 'Patna',
    toCity: 'Delhi',
    departureTime: '14:00',
    arrivalTime: '07:00',
    duration: '17h 00m',
    distance: '1050 km',
    price: 800,
    totalSeats: 40,
    amenities: ['Fan', 'Water Bottle', 'Charging Point'],
    operatesOn: ['Tue','Thu','Sat'],
    rating: 3.9,
    busClass: 'ECONOMY'
  },
  {
    busNumber: 'RBE-BR-005',
    operator: 'Bihar State Transport',
    busType: 'AC Sleeper',
    fromCity: 'Delhi',
    toCity: 'Patna',
    departureTime: '17:00',
    arrivalTime: '09:00',
    duration: '16h 00m',
    distance: '1050 km',
    price: 1250,
    totalSeats: 40,
    amenities: ['AC', 'Blanket', 'Water Bottle', 'Charging Point', 'WiFi'],
    operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    rating: 4.3,
    busClass: 'PREMIUM'
  }
];

const operators = [
  'Pawan Hans Travels', 'Raj National Express', 'Orange Travels', 'PEPSU Road Transport',
  'HRTC Himachal', 'Haryana Roadways', 'VRL Travels', 'SRS Travels', 'KPN Travels',
  'Parveen Travels', 'Zingbus', 'IntrCity SmartBus', 'Greenline Travels', 'Neeta Travels',
  'Paulo Travels', 'Ganga Express', 'Patliputra Travels', 'Bihar State Transport'
];

const busTypes = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo AC', 'Scania AC', 'Luxury'];
const busClasses = ['ECONOMY', 'STANDARD', 'PREMIUM', 'LUXURY'];
const allAmenities = ['AC', 'WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow', 'Reading Light', 'Snacks', 'Movie'];

function generateRandomBuses(count: number) {
  const extraBuses = [];
  const routes = [
    { from: 'Delhi', to: 'Lucknow', dist: 555 },
    { from: 'Delhi', to: 'Varanasi', dist: 821 },
    { from: 'Delhi', to: 'Agra', dist: 233 },
    { from: 'Delhi', to: 'Amritsar', dist: 449 },
    { from: 'Delhi', to: 'Manali', dist: 540 },
    { from: 'Patna', to: 'Delhi', dist: 1050 },
    { from: 'Delhi', to: 'Patna', dist: 1050 },
    { from: 'Mumbai', to: 'Pune', dist: 150 },
    { from: 'Bangalore', to: 'Chennai', dist: 346 },
    { from: 'Hyderabad', to: 'Bangalore', dist: 575 }
  ];

  for (let i = 0; i < count; i++) {
    const route = routes[Math.floor(Math.random() * routes.length)];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const type = busTypes[Math.floor(Math.random() * busTypes.length)];
    const busClass = busClasses[Math.floor(Math.random() * busClasses.length)];
    const busNum = `RBE-GEN-${1000 + i}`;
    
    // Random time between 06:00 and 23:30
    const hour = Math.floor(Math.random() * 18) + 6;
    const min = Math.random() > 0.5 ? '00' : '30';
    const depTime = `${hour.toString().padStart(2, '0')}:${min}`;
    
    // Duration based on distance (approx 50km/h)
    const durationHours = Math.floor(route.dist / 50) + Math.floor(Math.random() * 3);
    const durationMins = Math.random() > 0.5 ? '00' : '30';
    const durationStr = `${durationHours}h ${durationMins}m`;
    
    // Arrival time calculation
    const arrHour = (hour + durationHours) % 24;
    const arrTime = `${arrHour.toString().padStart(2, '0')}:${durationMins}`;

    extraBuses.push({
      busNumber: busNum,
      operator: operator,
      busType: type,
      fromCity: route.from,
      toCity: route.to,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration: durationStr,
      distance: `${route.dist} km`,
      price: Math.floor(route.dist * (0.8 + Math.random() * 0.7)),
      totalSeats: Math.random() > 0.5 ? 40 : 36,
      amenities: allAmenities.filter(() => Math.random() > 0.4),
      operatesOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      busClass: busClass
    });
  }
  return extraBuses;
}

const waypointsMap: Record<string, any[]> = {
  'RBE-UP-001': [
    { city: 'Delhi (Kashmere Gate ISBT)', time: '22:00', type: 'origin' },
    { city: 'Aligarh', time: '00:30', type: 'stop' },
    { city: 'Agra', time: '01:30', type: 'stop' },
    { city: 'Kanpur', time: '04:00', type: 'stop' },
    { city: 'Lucknow (Alambagh)', time: '06:00', type: 'destination' }
  ],
  'RBE-BR-002': [
    { city: 'Patna (Gandhi Maidan)', time: '16:00', type: 'origin' },
    { city: 'Muzaffarpur', time: '18:30', type: 'stop' },
    { city: 'Gorakhpur', time: '23:00', type: 'stop' },
    { city: 'Lucknow', time: '02:30', type: 'stop' },
    { city: 'Delhi (Anand Vihar)', time: '08:00', type: 'destination' }
  ],
  'RBE-BR-003': [
    { city: 'Patna (Mithapur)', time: '18:30', type: 'origin' },
    { city: 'Arrah', time: '20:00', type: 'stop' },
    { city: 'Buxar', time: '21:30', type: 'stop' },
    { city: 'Varanasi', time: '23:30', type: 'stop' },
    { city: 'Delhi (Kashmere Gate)', time: '10:30', type: 'destination' }
  ],
  'RBE-BR-004': [
    { city: 'Patna (Gandhi Maidan)', time: '14:00', type: 'origin' },
    { city: 'Chhapra', time: '16:00', type: 'stop' },
    { city: 'Siwan', time: '17:30', type: 'stop' },
    { city: 'Delhi (Anand Vihar)', time: '07:00', type: 'destination' }
  ],
  'RBE-BR-005': [
    { city: 'Delhi (Anand Vihar)', time: '17:00', type: 'origin' },
    { city: 'Lucknow', time: '22:30', type: 'stop' },
    { city: 'Gorakhpur', time: '02:00', type: 'stop' },
    { city: 'Patna (Gandhi Maidan)', time: '09:00', type: 'destination' }
  ],
  'RBE-UP-002': [
    { city: 'Delhi (Anand Vihar ISBT)', time: '20:30', type: 'origin' },
    { city: 'Agra', time: '23:00', type: 'stop' },
    { city: 'Kanpur', time: '02:30', type: 'stop' },
    { city: 'Allahabad (Prayagraj)', time: '05:00', type: 'stop' },
    { city: 'Varanasi (Babatpur)', time: '07:30', type: 'destination' }
  ],
  'RBE-UP-003': [
    { city: 'Delhi (Sarai Kale Khan)', time: '06:00', type: 'origin' },
    { city: 'Gurugram Toll', time: '06:45', type: 'stop' },
    { city: 'Mathura', time: '08:30', type: 'stop' },
    { city: 'Agra (Idgah Bus Stand)', time: '09:30', type: 'destination' }
  ],
  'RBE-PB-001': [
    { city: 'Delhi (ISBT Kashmere Gate)', time: '07:00', type: 'origin' },
    { city: 'Panipat', time: '08:15', type: 'stop' },
    { city: 'Karnal', time: '09:00', type: 'stop' },
    { city: 'Chandigarh', time: '10:30', type: 'stop' },
    { city: 'Jalandhar', time: '12:00', type: 'stop' },
    { city: 'Amritsar (ISBT)', time: '13:00', type: 'destination' }
  ],
  'RBE-HP-001': [
    { city: 'Delhi (Majnu Ka Tila)', time: '17:30', type: 'origin' },
    { city: 'Chandigarh', time: '20:30', type: 'stop' },
    { city: 'Shimla', time: '23:30', type: 'stop' },
    { city: 'Mandi', time: '02:30', type: 'stop' },
    { city: 'Manali Bus Stand', time: '08:30', type: 'destination' }
  ],
  'RBE-HR-001': [
    { city: 'Delhi (ISBT Kashmere Gate)', time: '08:00', type: 'origin' },
    { city: 'Panipat', time: '09:15', type: 'stop' },
    { city: 'Karnal', time: '10:00', type: 'stop' },
    { city: 'Chandigarh ISBT 43', time: '11:30', type: 'destination' }
  ],
  'RBE-MH-001': [
    { city: 'Mumbai (Dadar)', time: '07:00', type: 'origin' },
    { city: 'Thane', time: '07:45', type: 'stop' },
    { city: 'Khopoli', time: '08:30', type: 'stop' },
    { city: 'Pune (Swargate)', time: '10:30', type: 'destination' }
  ],
  'RBE-MH-002': [
    { city: 'Mumbai (Borivali)', time: '21:00', type: 'origin' },
    { city: 'Panvel', time: '22:15', type: 'stop' },
    { city: 'Chiplun', time: '01:30', type: 'stop' },
    { city: 'Ratnagiri', time: '03:00', type: 'stop' },
    { city: 'Panaji (Goa)', time: '07:00', type: 'destination' }
  ],
  'RBE-MH-003': [
    { city: 'Pune (Swargate)', time: '06:30', type: 'origin' },
    { city: 'Khopoli', time: '08:30', type: 'stop' },
    { city: 'Thane', time: '09:15', type: 'stop' },
    { city: 'Mumbai (Dadar)', time: '10:00', type: 'destination' }
  ],
  'RBE-GJ-001': [
    { city: 'Ahmedabad (Geeta Mandir)', time: '09:00', type: 'origin' },
    { city: 'Anand', time: '10:00', type: 'stop' },
    { city: 'Vadodara', time: '11:00', type: 'stop' },
    { city: 'Surat (Central Bus Stand)', time: '13:00', type: 'destination' }
  ],
  'RBE-RJ-001': [
    { city: 'Jaipur (Sindhi Camp)', time: '23:00', type: 'origin' },
    { city: 'Alwar', time: '01:00', type: 'stop' },
    { city: 'Rewari', time: '02:30', type: 'stop' },
    { city: 'Gurugram', time: '04:00', type: 'stop' },
    { city: 'Delhi (Sarai Kale Khan)', time: '05:30', type: 'destination' }
  ],
  'RBE-TN-001': [
    { city: 'Chennai (Koyambedu)', time: '22:30', type: 'origin' },
    { city: 'Vellore', time: '00:30', type: 'stop' },
    { city: 'Krishnagiri', time: '02:30', type: 'stop' },
    { city: 'Tumkur', time: '04:30', type: 'stop' },
    { city: 'Bangalore (Majestic)', time: '05:30', type: 'destination' }
  ],
  'RBE-KL-001': [
    { city: 'Thiruvananthapuram (KSRTC)', time: '08:00', type: 'origin' },
    { city: 'Kollam', time: '09:00', type: 'stop' },
    { city: 'Alappuzha (Alleppey)', time: '10:30', type: 'stop' },
    { city: 'Kochi (KSRTC)', time: '12:30', type: 'destination' }
  ],
  'RBE-KA-001': [
    { city: 'Bangalore (Majestic)', time: '07:00', type: 'origin' },
    { city: 'Bangalore (Satellite Bus Stand)', time: '07:30', type: 'stop' },
    { city: 'Mandya', time: '09:00', type: 'stop' },
    { city: 'Mysuru (Central Bus Stand)', time: '10:30', type: 'destination' }
  ],
  'RBE-KA-002': [
    { city: 'Bangalore (Majestic)', time: '22:00', type: 'origin' },
    { city: 'Hindupur', time: '00:00', type: 'stop' },
    { city: 'Kurnool', time: '03:00', type: 'stop' },
    { city: 'Hyderabad (MGBS)', time: '07:00', type: 'destination' }
  ],
  'RBE-WB-001': [
    { city: 'Kolkata (Esplanade)', time: '21:30', type: 'origin' },
    { city: 'Uluberia', time: '22:30', type: 'stop' },
    { city: 'Kharagpur', time: '23:45', type: 'stop' },
    { city: 'Balasore', time: '02:30', type: 'stop' },
    { city: 'Bhubaneswar (Baramunda)', time: '06:00', type: 'destination' }
  ],
  'RBE-TS-001': [
    { city: 'Hyderabad (MGBS)', time: '21:00', type: 'origin' },
    { city: 'Nalgonda', time: '22:30', type: 'stop' },
    { city: 'Guntur', time: '01:00', type: 'stop' },
    { city: 'Nellore', time: '03:30', type: 'stop' },
    { city: 'Chennai (Koyambedu)', time: '06:30', type: 'destination' }
  ],
  'RBE-MP-001': [
    { city: 'Bhopal (ISBT)', time: '08:00', type: 'origin' },
    { city: 'Sehore', time: '09:00', type: 'stop' },
    { city: 'Indore (Gangwal Bus Stand)', time: '11:30', type: 'destination' }
  ],
  'RBE-AS-001': [
    { city: 'Guwahati (Paltan Bazaar)', time: '09:00', type: 'origin' },
    { city: 'Jorabat', time: '09:45', type: 'stop' },
    { city: 'Shillong (Police Bazaar)', time: '12:00', type: 'destination' }
  ],
  'RBE-JK-001': [
    { city: 'Jammu (General Bus Stand)', time: '06:00', type: 'origin' },
    { city: 'Udhampur', time: '07:30', type: 'stop' },
    { city: 'Ramban', time: '09:30', type: 'stop' },
    { city: 'Banihal', time: '11:00', type: 'stop' },
    { city: 'Srinagar (TRC Chowk)', time: '14:00', type: 'destination' }
  ],
  'RBE-LD-001': [
    { city: 'Bangalore (Majestic)', time: '19:00', type: 'origin' },
    { city: 'Hubli', time: '23:00', type: 'stop' },
    { city: 'Belgaum (Belagavi)', time: '01:30', type: 'stop' },
    { city: 'Kolhapur', time: '04:00', type: 'stop' },
    { city: 'Mumbai (Dadar)', time: '09:00', type: 'destination' }
  ],
  'RBE-LD-003': [
    { city: 'Delhi (Dhaula Kuan)', time: '06:00', type: 'origin' },
    { city: 'Gurugram (Huda City Centre)', time: '06:45', type: 'stop' },
    { city: 'Dharuhera', time: '07:30', type: 'stop' },
    { city: 'Shahpura', time: '09:00', type: 'stop' },
    { city: 'Jaipur (Sindhi Camp)', time: '10:30', type: 'destination' }
  ],
  'RBE-LD-004': [
    { city: 'Hyderabad (Punjagutta)', time: '08:00', type: 'origin' },
    { city: 'Kurnool', time: '11:00', type: 'stop' },
    { city: 'Bellary (Ballari)', time: '13:30', type: 'stop' },
    { city: 'Bangalore (Silk Board)', time: '17:00', type: 'destination' }
  ],
  'RBE-UK-001': [
    { city: 'Delhi (ISBT Kashmere Gate)', time: '23:00', type: 'origin' },
    { city: 'Panipat', time: '00:15', type: 'stop' },
    { city: 'Karnal', time: '01:00', type: 'stop' },
    { city: 'Saharanpur', time: '02:30', type: 'stop' },
    { city: 'Dehradun (ISBT)', time: '05:00', type: 'destination' }
  ]
};

export async function seedBuses() {
  try {
    const busCount = await Bus.countDocuments();
    // Force re-seed to get 300+ buses
    if (busCount >= 300) {
      console.log(`✅ Database already seeded (${busCount} buses) — skipping`);
      return;
    }

    console.log('🌱 Seeding MongoDB with 300+ buses and routes...');

    // Clear existing data to avoid duplicates
    await Bus.deleteMany({});
    await Route.deleteMany({});

    const allBuses = [...busesData, ...generateRandomBuses(300)];

    for (const busData of allBuses) {
      const bus = new Bus({
        busNumber: busData.busNumber,
        operatorName: busData.operator,
        busType: busData.busType,
        busClass: busData.busClass,
        totalSeats: busData.totalSeats,
        amenities: busData.amenities,
        rating: busData.rating,
        eliteScore: busData.rating
      });

      const savedBus = await bus.save();

      const route = new Route({
        busId: savedBus._id,
        fromCity: busData.fromCity,
        toCity: busData.toCity,
        departureTime: busData.departureTime,
        arrivalTime: busData.arrivalTime,
        duration: busData.duration,
        distance: busData.distance,
        basePrice: busData.price,
        operatesOn: busData.operatesOn,
        daysOfWeek: busData.operatesOn.map(day => dayMap[day]),
        waypoints: waypointsMap[busData.busNumber] || [
          { city: busData.fromCity, time: busData.departureTime, type: 'origin' },
          { city: busData.toCity, time: busData.arrivalTime, type: 'destination' }
        ]
      });

      await route.save();
    }

    // Seed Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const coupons = [
        {
          code: 'WELCOME100',
          discountType: 'Fixed',
          discountValue: 100,
          minOrderValue: 500,
          expiryDate: new Date('2026-12-31'),
          isActive: true
        },
        {
          code: 'ELITE20',
          discountType: 'Percentage',
          discountValue: 20,
          minOrderValue: 1000,
          maxDiscount: 500,
          expiryDate: new Date('2026-12-31'),
          isActive: true
        }
      ];
      await Coupon.insertMany(coupons);
    }

    console.log('✅ MongoDB seeding complete!');
  } catch (error) {
    console.error('❌ MongoDB seeding failed:', error);
  }
}
