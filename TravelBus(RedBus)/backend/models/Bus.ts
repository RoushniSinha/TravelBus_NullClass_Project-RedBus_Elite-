import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  operatorName: { type: String, required: true },
  busType: { type: String, required: true }, // AC Sleeper, Non-AC Seater, etc.
  totalSeats: { type: Number, required: true },
  amenities: [{ type: String }],
  isActive: { type: Boolean, default: true },
  eliteScore: { type: Number, default: 4.0 },
  createdAt: { type: Date, default: Date.now }
});

export const Bus = mongoose.model('Bus', busSchema);
