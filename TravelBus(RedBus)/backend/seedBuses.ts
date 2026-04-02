import { Bus } from './models/Bus';
import { Route } from './models/Route';
import { Coupon } from './models/Coupon';

export async function seedBuses() {
  try {
    const busCount = await Bus.countDocuments();
    if (busCount > 0) return;

    console.log('🌱 Seeding MongoDB with buses and routes...');

    const buses = [
      {
        busNumber: 'ELITE-001',
        operatorName: 'TravelBus Elite',
        busType: 'AC Sleeper (2+1)',
        totalSeats: 30,
        amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket'],
        eliteScore: 4.8
      },
      {
        busNumber: 'ELITE-002',
        operatorName: 'TravelBus Elite',
        busType: 'AC Seater (2+2)',
        totalSeats: 40,
        amenities: ['WiFi', 'Charging Point', 'Water Bottle'],
        eliteScore: 4.5
      },
      {
        busNumber: 'ELITE-003',
        operatorName: 'TravelBus Elite',
        busType: 'Non-AC Sleeper (2+1)',
        totalSeats: 30,
        amenities: ['Charging Point', 'Water Bottle'],
        eliteScore: 4.2
      }
    ];

    const createdBuses = await Bus.insertMany(buses);

    const routes = [
      {
        busId: createdBuses[0]._id,
        fromCity: 'Mumbai',
        toCity: 'Pune',
        departureTime: '22:00',
        arrivalTime: '01:30',
        duration: '3h 30m',
        distance: '150 km',
        basePrice: 499,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      },
      {
        busId: createdBuses[1]._id,
        fromCity: 'Delhi',
        toCity: 'Agra',
        departureTime: '06:00',
        arrivalTime: '10:00',
        duration: '4h 00m',
        distance: '230 km',
        basePrice: 899,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      },
      {
        busId: createdBuses[2]._id,
        fromCity: 'Bangalore',
        toCity: 'Chennai',
        departureTime: '23:00',
        arrivalTime: '05:30',
        duration: '6h 30m',
        distance: '350 km',
        basePrice: 799,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      },
      {
        busId: createdBuses[0]._id,
        fromCity: 'Hyderabad',
        toCity: 'Bangalore',
        departureTime: '21:00',
        arrivalTime: '06:00',
        duration: '9h 00m',
        distance: '570 km',
        basePrice: 1299,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }
    ];

    await Route.insertMany(routes);

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

    console.log('✅ MongoDB seeding complete!');
  } catch (error) {
    console.error('❌ MongoDB seeding failed:', error);
  }
}
