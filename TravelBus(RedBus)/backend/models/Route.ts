import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  departureTime: { type: String, required: true }, // e.g., '22:00'
  arrivalTime: { type: String, required: true },   // e.g., '06:00'
  duration: { type: String, required: true },      // e.g., '8h 00m'
  distance: { type: String },                      // e.g., '450 km'
  basePrice: { type: Number, required: true },
  daysOfWeek: [{ type: Number }],                  // 0-6 (Sun-Sat)
  operatesOn: [{ type: String }],                  // ['Mon', 'Tue', etc.]
  waypoints: [{
    city: { type: String, required: true },
    time: { type: String, required: true }, // e.g., '22:00'
    type: { type: String, enum: ['origin', 'stop', 'destination'], required: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Route = mongoose.model('Route', routeSchema);
