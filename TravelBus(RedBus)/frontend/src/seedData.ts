import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const sampleBuses = [
  {
    busNumber: 'ELITE-001',
    operatorName: 'TravelBus Elite',
    busType: 'AC Sleeper (2+1)',
    totalSeats: 30,
    availableSeats: 30,
    amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket'],
    isActive: true,
    eliteScore: 4.8,
    createdAt: new Date().toISOString()
  },
  {
    busNumber: 'ELITE-002',
    operatorName: 'TravelBus Elite',
    busType: 'AC Seater (2+2)',
    totalSeats: 40,
    availableSeats: 40,
    amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
    isActive: true,
    eliteScore: 4.5,
    createdAt: new Date().toISOString()
  },
  {
    busNumber: 'ELITE-003',
    operatorName: 'TravelBus Elite',
    busType: 'Non-AC Sleeper (2+1)',
    totalSeats: 30,
    availableSeats: 30,
    amenities: ['Charging Point', 'Water Bottle'],
    isActive: true,
    eliteScore: 4.2,
    createdAt: new Date().toISOString()
  }
];

const sampleRoutes = [
  {
    fromCity: 'Mumbai',
    toCity: 'Pune',
    distance: '150 km',
    duration: '3h 30m',
    basePrice: 499,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    fromCity: 'Delhi',
    toCity: 'Agra',
    distance: '230 km',
    duration: '4h 00m',
    basePrice: 899,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    fromCity: 'Bangalore',
    toCity: 'Chennai',
    distance: '350 km',
    duration: '6h 30m',
    basePrice: 799,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    fromCity: 'Hyderabad',
    toCity: 'Bangalore',
    distance: '570 km',
    duration: '9h 00m',
    basePrice: 1299,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const seedData = async () => {
  try {
    for (const bus of sampleBuses) {
      await addDoc(collection(db, 'buses'), bus);
    }
    for (const route of sampleRoutes) {
      await addDoc(collection(db, 'routes'), route);
    }
    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
};
