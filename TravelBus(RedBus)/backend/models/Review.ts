import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  uid: { type: String, required: true }, // Firebase UID
  authorName: { type: String, required: true },
  punctuality: { type: Number, required: true, min: 1, max: 5 }, // 50%
  cleanliness: { type: Number, required: true, min: 1, max: 5 }, // 30%
  amenities: { type: Number, required: true, min: 1, max: 5 },   // 20%
  eliteScore: { type: Number, required: true }, // Computed: (p*0.5) + (c*0.3) + (a*0.2)
  reviewText: { type: String },
  photos: [{ type: String }], // Cloudinary URLs
  isApproved: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Review = mongoose.model('Review', reviewSchema);
