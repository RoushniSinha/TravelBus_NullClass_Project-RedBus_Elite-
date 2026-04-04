import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User } from './models/User';
import { Bus } from './models/Bus';
import { Route } from './models/Route';
import { Booking } from './models/Booking';
import { Coupon } from './models/Coupon';
import { SeatLock } from './models/SeatLock';
import { Story } from './models/Story';
import { ForumPost, ForumReply } from './models/Forum';
import { Review } from './models/Review';
import { seedAdmin } from './seedAdmin';
import { seedBuses } from './seedBuses';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy - required for express-rate-limit to work correctly behind proxies (like Cloud Run/Nginx)
  app.set('trust proxy', 1);

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  
  // Disable buffering so we fail fast if the connection is down
  mongoose.set('bufferCommands', false);

  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is missing in environment variables. MongoDB features will not work.');
  } else {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      });
      console.log('✅ Connected to MongoDB Atlas');
      
      // Seed data only if connection is successful
      await seedAdmin();
      await seedBuses();
    } catch (err: any) {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️ Please ensure your MongoDB Atlas IP whitelist allows access from anywhere (0.0.0.0/0) for this environment.');
    }
  }

  // Razorpay Instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
  });

  // Basic security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development to allow Vite HMR and external assets
  }));
  app.use(cors());
  app.use(express.json());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Use the IP address from the trusted proxy
    keyGenerator: (req) => req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown'
  });
  app.use('/api/', limiter);

  // Middleware to check MongoDB connection for API routes
  app.use('/api/', (req, res, next) => {
    if (req.path === '/health') return next();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection is not established. Please check MONGODB_URI.' });
    }
    next();
  });

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(), 
      version: '1.0.0',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  });

  // --- BUSES & ROUTES ---

  // Search Buses
  app.get('/api/buses/search', async (req, res) => {
    const { from, to, date, type, minPrice, maxPrice, sortBy } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ error: 'From, To, and Date are required' });
    }

    try {
      const dayOfWeek = new Date(date as string).getDay();
      
      // Find routes matching cities and day of week
      let query: any = {
        fromCity: { $regex: new RegExp(`^${from}$`, 'i') },
        toCity: { $regex: new RegExp(`^${to}$`, 'i') },
        daysOfWeek: dayOfWeek,
        isActive: true
      };

      if (minPrice || maxPrice) {
        query.basePrice = {};
        if (minPrice) query.basePrice.$gte = Number(minPrice);
        if (maxPrice) query.basePrice.$lte = Number(maxPrice);
      }

      let routes = await Route.find(query).populate('busId');

      // Filter by bus type if provided
      if (type) {
        routes = routes.filter((r: any) => r.busId.busType.toLowerCase().includes((type as string).toLowerCase()));
      }

      // Sort
      if (sortBy === 'price_low') {
        routes.sort((a: any, b: any) => a.basePrice - b.basePrice);
      } else if (sortBy === 'price_high') {
        routes.sort((a: any, b: any) => b.basePrice - a.basePrice);
      } else if (sortBy === 'rating') {
        routes.sort((a: any, b: any) => b.busId.eliteScore - a.busId.eliteScore);
      }

      res.json({ success: true, routes });
    } catch (error: any) {
      console.error('❌ Bus Search Error:', error.message);
      res.status(500).json({ error: 'Failed to search buses' });
    }
  });

  // Get Bus Details
  app.get('/api/buses/:id', async (req, res) => {
    try {
      const bus = await Bus.findById(req.params.id);
      if (!bus) return res.status(404).json({ error: 'Bus not found' });
      res.json({ success: true, bus });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch bus details' });
    }
  });

  // Get Route Details
  app.get('/api/routes/:id', async (req, res) => {
    try {
      const route = await Route.findById(req.params.id).populate('busId');
      if (!route) return res.status(404).json({ error: 'Route not found' });
      res.json({ success: true, route });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch route details' });
    }
  });

  // Get Seats for a Bus/Route on a specific date
  app.get('/api/buses/:busId/routes/:routeId/seats', async (req, res) => {
    const { date } = req.query;
    const { busId, routeId } = req.params;

    if (!date) return res.status(400).json({ error: 'Date is required' });

    try {
      // Find all confirmed bookings for this bus/route/date
      const bookings = await Booking.find({
        busId,
        routeId,
        travelDate: date as string,
        'payment.status': 'Paid',
        status: { $ne: 'Cancelled' }
      });

      const bookedSeats = bookings.flatMap(b => b.seats);

      // Find all active locks
      const locks = await SeatLock.find({
        busId,
        routeId,
        travelDate: date as string
      });

      const lockedSeats = locks.map(l => ({
        seatNumber: l.seatNumber,
        uid: l.uid
      }));

      res.json({ success: true, bookedSeats, lockedSeats });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch seats' });
    }
  });

  // Lock a seat (10 minutes)
  app.post('/api/buses/:busId/routes/:routeId/seats/lock', async (req, res) => {
    const { busId, routeId } = req.params;
    const { seatNumber, travelDate, uid } = req.body;

    if (!seatNumber || !travelDate || !uid) {
      return res.status(400).json({ error: 'Seat number, travel date, and UID are required' });
    }

    try {
      // Check if already booked
      const isBooked = await Booking.findOne({
        busId,
        routeId,
        travelDate,
        seats: seatNumber,
        'payment.status': 'Paid',
        status: { $ne: 'Cancelled' }
      });

      if (isBooked) return res.status(400).json({ error: 'Seat already booked' });

      // Try to create a lock (atomic due to unique index)
      const lock = new SeatLock({
        busId,
        routeId,
        travelDate,
        seatNumber,
        uid
      });

      await lock.save();
      res.json({ success: true, message: 'Seat locked for 10 minutes' });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Seat is already held by someone else' });
      }
      res.status(500).json({ error: 'Failed to lock seat' });
    }
  });

  // Unlock a seat
  app.delete('/api/buses/:busId/routes/:routeId/seats/unlock', async (req, res) => {
    const { busId, routeId } = req.params;
    const { seatNumber, travelDate, uid } = req.body;

    try {
      await SeatLock.deleteOne({
        busId,
        routeId,
        travelDate,
        seatNumber,
        uid
      });
      res.json({ success: true, message: 'Seat unlocked' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to unlock seat' });
    }
  });

  // --- COUPONS ---

  app.post('/api/coupons/validate', async (req, res) => {
    const { code, amount } = req.body;

    try {
      const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: new Date() } });
      if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon' });

      if (amount < coupon.minOrderValue) {
        return res.status(400).json({ error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` });
      }

      let discount = 0;
      if (coupon.discountType === 'Percentage') {
        discount = (amount * coupon.discountValue) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else {
        discount = coupon.discountValue;
      }

      res.json({ success: true, discount, couponId: coupon._id });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to validate coupon' });
    }
  });

  // --- REVIEWS ---

  // Get reviews for a bus
  app.get('/api/reviews/bus/:busId', async (req, res) => {
    try {
      const reviews = await Review.find({ busId: req.params.busId, isApproved: true }).sort({ createdAt: -1 });
      res.json({ success: true, reviews });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  // Submit a review
  app.post('/api/reviews', async (req, res) => {
    const { busId, bookingId, punctuality, cleanliness, amenities, reviewText, photos, uid, authorName } = req.body;
    try {
      const p = parseFloat(String(punctuality));
      const c = parseFloat(String(cleanliness));
      const a = parseFloat(String(amenities));
      const eliteScore = parseFloat(((p * 0.5) + (c * 0.3) + (a * 0.2)).toFixed(1));

      const review = new Review({
        busId,
        bookingId,
        uid,
        authorName,
        punctuality: p,
        cleanliness: c,
        amenities: a,
        eliteScore,
        reviewText,
        photos,
        isApproved: false
      });

      await review.save();
      res.json({ success: true, review });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to submit review', details: error.message });
    }
  });

  // Admin: Get all reviews
  app.get('/api/admin/reviews', async (req, res) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json({ success: true, reviews });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch admin reviews' });
    }
  });

  // Admin: Approve review
  app.patch('/api/admin/reviews/:id/approve', async (req, res) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
      res.json({ success: true, review });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to approve review' });
    }
  });

  // Admin: Seed sample reviews
  app.post('/api/admin/reviews/seed', async (req, res) => {
    try {
      const buses = await Bus.find().limit(5);
      const bookings = await Booking.find().limit(5);
      if (buses.length === 0 || bookings.length === 0) {
        return res.status(400).json({ error: 'Need buses and bookings to seed reviews' });
      }

      const sampleReviews = [
        { 
          busId: buses[0]._id, 
          bookingId: bookings[0]._id, 
          uid: 'seed_user_1', 
          authorName: 'John Doe',
          punctuality: 5, cleanliness: 4, amenities: 5,
          eliteScore: 4.7,
          reviewText: 'Excellent service! The bus was on time and very clean.',
          isApproved: true
        },
        { 
          busId: buses[1]._id, 
          bookingId: bookings[1]._id, 
          uid: 'seed_user_2', 
          authorName: 'Jane Smith',
          punctuality: 4, cleanliness: 5, amenities: 4,
          eliteScore: 4.3,
          reviewText: 'Very comfortable journey. Highly recommended.',
          isApproved: true
        }
      ];

      await Review.insertMany(sampleReviews);
      res.json({ success: true, message: 'Sample reviews seeded' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to seed reviews', details: error.message });
    }
  });

  // --- STORIES ---

  app.get('/api/stories', async (req, res) => {
    try {
      const stories = await Story.find({ isApproved: true }).sort({ createdAt: -1 });
      res.json({ success: true, stories });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  });

  app.post('/api/stories', async (req, res) => {
    try {
      const story = new Story({ ...req.body, isApproved: false });
      await story.save();
      res.json({ success: true, story });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create story' });
    }
  });

  // --- FORUM ---

  app.get('/api/forum/posts', async (req, res) => {
    try {
      const posts = await ForumPost.find({ isRemoved: false }).sort({ createdAt: -1 });
      res.json({ success: true, posts });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch forum posts' });
    }
  });

  app.post('/api/forum/posts', async (req, res) => {
    try {
      const post = new ForumPost(req.body);
      await post.save();
      res.json({ success: true, post });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create forum post' });
    }
  });

  app.get('/api/forum/top-contributors', async (req, res) => {
    try {
      // Mock top contributors for now
      const contributors = [
        { name: 'Ankit Sharma', points: 542, initials: 'AS' },
        { name: 'Meera Kapoor', points: 542, initials: 'MK' }
      ];
      res.json({ success: true, contributors });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch contributors' });
    }
  });

  // Initiate Booking (Create Razorpay Order and Pending Booking)
  app.post('/api/bookings/initiate', async (req, res) => {
    const { 
      busId, 
      routeId, 
      travelDate, 
      seats, 
      passengers, 
      contactInfo, 
      boardingPoint, 
      droppingPoint, 
      fare, 
      uid 
    } = req.body;

    if (!fare || !uid || !busId || !routeId || !seats || !passengers) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

    try {
      // 1. Generate a temporary PNR for the pending booking
      const tempPnr = 'PENDING-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // 2. Create a Pending Booking in MongoDB
      const booking = new Booking({
        pnr: tempPnr,
        uid,
        busId,
        routeId,
        travelDate,
        seats,
        passengers,
        contactInfo,
        boardingPoint,
        droppingPoint,
        fare,
        payment: {
          status: 'Pending'
        },
        status: 'Upcoming'
      });

      await booking.save();

      // 3. Create Razorpay Order
      const options = {
        amount: Math.round(fare.total * 100), // Razorpay expects amount in paise
        currency: 'INR',
        receipt: booking._id.toString(),
        notes: { uid, bookingId: booking._id.toString() }
      };

      const order = await razorpay.orders.create(options);

      // 4. Update booking with Razorpay Order ID
      booking.payment.orderId = order.id;
      await booking.save();

      res.json({ 
        success: true, 
        bookingId: booking._id, 
        razorpayOrderId: order.id, 
        amount: fare.total 
      });
    } catch (error: any) {
      console.error('❌ Booking Initiation Error:', error.message);
      res.status(500).json({ error: 'Failed to initiate booking', details: error.message });
    }
  });

  // Confirm Booking
  app.post('/api/bookings/confirm', async (req, res) => {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ error: 'Missing payment verification details' });
    }

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    try {
      // Find the pending booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Generate Real PNR
      const pnr = 'TB' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Update Booking
      booking.pnr = pnr;
      booking.payment.paymentId = razorpay_payment_id;
      booking.payment.status = 'Paid';
      booking.payment.method = 'Razorpay';
      
      await booking.save();

      // Remove locks for these seats
      await SeatLock.deleteMany({
        busId: booking.busId,
        routeId: booking.routeId,
        travelDate: booking.travelDate,
        seatNumber: { $in: booking.seats },
        uid: booking.uid
      });

      res.json({ success: true, pnr, bookingId: booking._id });
    } catch (error: any) {
      console.error('❌ Booking Confirmation Error:', error.message);
      res.status(500).json({ error: 'Failed to confirm booking' });
    }
  });

  // Get User Bookings
  app.get('/api/bookings', async (req, res) => {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: 'UID is required' });

    try {
      const bookings = await Booking.find({ uid })
        .populate('busId')
        .populate('routeId')
        .sort({ createdAt: -1 });
      res.json({ success: true, bookings });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // Get Single Booking
  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('busId')
        .populate('routeId');
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      res.json({ success: true, booking });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  });

  // Cancel Booking
  app.post('/api/bookings/:id/cancel', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });

      if (booking.status === 'Cancelled') {
        return res.status(400).json({ error: 'Booking is already cancelled' });
      }

      // Check if travel date is in the future (optional but recommended)
      const travelDate = new Date(booking.travelDate);
      if (travelDate < new Date()) {
        return res.status(400).json({ error: 'Cannot cancel past bookings' });
      }

      booking.status = 'Cancelled';
      booking.payment.status = 'Refunded'; // In a real app, you'd initiate a Razorpay refund here
      await booking.save();

      res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  });

  // User Sync Endpoint (Sync Firebase User to MongoDB)
  app.post('/api/auth/sync', async (req, res) => {
    const { uid, email, name, phone, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and Email are required' });
    }

    try {
      const user = await User.findOneAndUpdate(
        { uid },
        { uid, email, name, phone, role },
        { upsert: true, new: true }
      );
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('❌ User Sync Error:', error.message);
      res.status(500).json({ error: 'Failed to sync user', details: error.message });
    }
  });

  // Update User Profile Endpoint
  app.patch('/api/users/profile', async (req, res) => {
    const { uid, name, phone, avatar, preferredLang, notificationPreferences } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    try {
      const user = await User.findOneAndUpdate(
        { uid },
        { name, phone, avatar, preferredLang, notificationPreferences },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('❌ Profile Update Error:', error.message);
      res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
  });

  // Razorpay Create Order Endpoint
  app.post('/api/create-razorpay-order', async (req, res) => {
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    try {
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({ success: true, order });
    } catch (error: any) {
      console.error('❌ Razorpay Error:', error.message);
      res.status(500).json({ error: 'Failed to create Razorpay order', details: error.message });
    }
  });

  // Razorpay Verify Signature Endpoint
  app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  });

  // Razorpay Refund Endpoint (Admin Only)
  app.post('/api/admin/refund', async (req, res) => {
    const { paymentId, amount, notes, adminUid } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    try {
      // Verify admin role in MongoDB
      const admin = await User.findOne({ uid: adminUid, role: 'admin' });
      if (!admin) {
        return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
      }

      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount provided
        notes: notes || { reason: 'Admin initiated refund' }
      });
      
      console.log(`✅ Refund initiated: ${refund.id}`);
      res.json({ success: true, refund });
    } catch (error: any) {
      console.error('❌ Razorpay Refund Error:', error.message);
      res.status(500).json({ error: 'Failed to initiate refund', details: error.message });
    }
  });

  // Razorpay Webhook
  app.post('/api/razorpay-webhook', async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'travelbus_secret';
    const signature = req.headers['x-razorpay-signature'] as string;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature === signature) {
      const event = req.body.event;
      console.log(`✅ Razorpay Webhook Event: ${event}`);
      
      if (event === 'payment.captured') {
        // Handle payment success logic here if needed (redundant if using verify-payment)
      }
      
      res.json({ status: 'ok' });
    } else {
      res.status(400).send('Invalid signature');
    }
  });

  // Twilio SMS Endpoint
  app.post('/api/send-sms', async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('⚠️ Twilio credentials missing in environment variables');
      return res.status(500).json({ error: 'SMS service not configured on server' });
    }

    try {
      const { default: twilio } = await import('twilio');
      const client = twilio(accountSid, authToken);

      const result = await client.messages.create({
        body: message,
        from: fromNumber,
        to: to
      });

      console.log(`✅ SMS sent successfully: ${result.sid}`);
      res.json({ success: true, sid: result.sid });
    } catch (error: any) {
      console.error('❌ Twilio Error:', error.message);
      res.status(500).json({ error: 'Failed to send SMS', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.join(process.cwd(), 'frontend'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ TravelBus Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
});
