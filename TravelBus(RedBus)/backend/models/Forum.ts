import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  authorId: { type: String, required: true }, // Firebase UID
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true }, // General Discussion, Travel Tips, Route Queries, Bus Reviews, Lost & Found
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  repliesCount: { type: Number, default: 0 },
  upvotes: [{ type: String }], // Array of UIDs
  isPinned: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  isRemoved: { type: Boolean, default: false },
  bestAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumReply' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

forumPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ForumPost = mongoose.model('ForumPost', forumPostSchema);

const forumReplySchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  authorId: { type: String, required: true }, // Firebase UID
  authorName: { type: String, required: true },
  body: { type: String, required: true },
  parentReplyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumReply' }, // For one level deep nesting
  upvotes: [{ type: String }], // Array of UIDs
  isBestAnswer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

forumReplySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ForumReply = mongoose.model('ForumReply', forumReplySchema);
