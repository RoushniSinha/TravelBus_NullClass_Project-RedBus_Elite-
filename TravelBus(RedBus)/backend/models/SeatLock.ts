import mongoose from 'mongoose';

const seatLockSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  travelDate: { type: String, required: true },
  seatNumber: { type: String, required: true },
  uid: { type: String, required: true }, // Firebase UID
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 minutes (600 seconds)
});

// Compound index to ensure a seat is only locked once for a specific bus/route/date
seatLockSchema.index({ busId: 1, routeId: 1, travelDate: 1, seatNumber: 1 }, { unique: true });

export const SeatLock = mongoose.model('SeatLock', seatLockSchema);
