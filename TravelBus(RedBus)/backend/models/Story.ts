import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  authorId: { type: String, required: true }, // Firebase UID
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  travelDate: { type: Date },
  categories: [{ type: String }],
  tags: [{ type: String }],
  images: [{ type: String }], // Cloudinary URLs
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: [{ type: String }], // Array of UIDs
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

storySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Story = mongoose.model('Story', storySchema);
