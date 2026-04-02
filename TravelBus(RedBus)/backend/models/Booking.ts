import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  pnr: { type: String, required: true, unique: true },
  uid: { type: String, required: true }, // Firebase UID
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  travelDate: { type: String, required: true }, // ISO date string or YYYY-MM-DD
  seats: [{ type: String, required: true }],
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    seatNumber: { type: String, required: true }
  }],
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  boardingPoint: { type: String, required: true },
  droppingPoint: { type: String, required: true },
  fare: {
    base: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    orderId: { type: String },
    paymentId: { type: String },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    method: { type: String }
  },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);
