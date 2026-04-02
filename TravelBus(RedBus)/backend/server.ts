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
import { seedAdmin } from './seedAdmin';
import { seedBuses } from './seedBuses';
import { t } from './i18n';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is missing in environment variables. MongoDB features (User Sync) will not work.');
  } else {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      });
      console.log('✅ Connected to MongoDB Atlas');
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

  // Seed admin account
  await seedAdmin();
  await seedBuses();

  // Basic security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development to allow Vite HMR and external assets
  }));
  app.use(cors());
  app.use(express.json());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
  });

  // --- BUSES & ROUTES ---

  // Search Buses
  app.get('/api/buses/search', async (req, res) => {
    const { from, to, date, type, minPrice, maxPrice, sortBy } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ error: t(req, 'from_to_date_required') });
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
      res.status(500).json({ error: t(req, 'failed_search_buses') });
    }
  });

  // Get Bus Details
  app.get('/api/buses/:id', async (req, res) => {
    try {
      const bus = await Bus.findById(req.params.id);
      if (!bus) return res.status(404).json({ error: t(req, 'bus_not_found') });
      res.json({ success: true, bus });
    } catch (error: any) {
      res.status(500).json({ error: t(req, 'failed_fetch_bus_details') });
    }
  });

  // Get Seats for a Bus/Route on a specific date
  app.get('/api/buses/:busId/routes/:routeId/seats', async (req, res) => {
    const { date } = req.query;
    const { busId, routeId } = req.params;

    if (!date) return res.status(400).json({ error: t(req, 'date_required') });

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
      res.status(500).json({ error: t(req, 'failed_fetch_seats') });
    }
  });

  // Lock a seat (10 minutes)
  app.post('/api/buses/:busId/routes/:routeId/seats/lock', async (req, res) => {
    const { busId, routeId } = req.params;
    const { seatNumber, travelDate, uid } = req.body;

    if (!seatNumber || !travelDate || !uid) {
      return res.status(400).json({ error: t(req, 'seat_lock_fields_required') });
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

      if (isBooked) return res.status(400).json({ error: t(req, 'seat_already_booked') });

      // Try to create a lock (atomic due to unique index)
      const lock = new SeatLock({
        busId,
        routeId,
        travelDate,
        seatNumber,
        uid
      });

      await lock.save();
      res.json({ success: true, message: t(req, 'seat_locked') });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: t(req, 'seat_held_by_other') });
      }
      res.status(500).json({ error: t(req, 'failed_lock_seat') });
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
      res.json({ success: true, message: t(req, 'seat_unlocked') });
    } catch (error: any) {
      res.status(500).json({ error: t(req, 'failed_unlock_seat') });
    }
  });

  // --- COUPONS ---

  app.post('/api/coupons/validate', async (req, res) => {
    const { code, amount } = req.body;

    try {
      const coupon = await Coupon.findOne({ code, isActive: true, expiryDate: { $gt: new Date() } });
      if (!coupon) return res.status(404).json({ error: t(req, 'invalid_or_expired_coupon') });

      if (amount < coupon.minOrderValue) {
        return res.status(400).json({ error: t(req, 'min_order_value', { amount: coupon.minOrderValue }) });
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
      res.status(500).json({ error: t(req, 'failed_validate_coupon') });
    }
  });

  // --- BOOKINGS ---

  // Initiate Booking (Create Razorpay Order)
  app.post('/api/bookings/initiate', async (req, res) => {
    const { amount, currency = 'INR', uid } = req.body;

    if (!amount || !uid) {
      return res.status(400).json({ error: t(req, 'amount_uid_required') });
    }

    try {
      const options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: `booking_${Date.now()}`,
        notes: { uid }
      };

      const order = await razorpay.orders.create(options);
      res.json({ success: true, order });
    } catch (error: any) {
      res.status(500).json({ error: t(req, 'failed_initiate_booking') });
    }
  });

  // Confirm Booking
  app.post('/api/bookings/confirm', async (req, res) => {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingData 
    } = req.body;

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: t(req, 'payment_verification_failed') });
    }

    try {
      // Generate PNR
      const pnr = 'TB' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const booking = new Booking({
        ...bookingData,
        pnr,
        payment: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          status: 'Paid',
          method: 'Razorpay'
        }
      });

      await booking.save();

      // Remove locks for these seats
      await SeatLock.deleteMany({
        busId: bookingData.busId,
        routeId: bookingData.routeId,
        travelDate: bookingData.travelDate,
        seatNumber: { $in: bookingData.seats },
        uid: bookingData.uid
      });

      res.json({ success: true, pnr, bookingId: booking._id });
    } catch (error: any) {
      console.error('❌ Booking Confirmation Error:', error.message);
      res.status(500).json({ error: t(req, 'failed_confirm_booking') });
    }
  });

  // Get User Bookings
  app.get('/api/bookings', async (req, res) => {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: t(req, 'uid_required') });

    try {
      const bookings = await Booking.find({ uid })
        .populate('busId')
        .populate('routeId')
        .sort({ createdAt: -1 });
      res.json({ success: true, bookings });
    } catch (error: any) {
      res.status(500).json({ error: t(req, 'failed_fetch_bookings') });
    }
  });

  // Get Single Booking
  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('busId')
        .populate('routeId');
      if (!booking) return res.status(404).json({ error: t(req, 'booking_not_found') });
      res.json({ success: true, booking });
    } catch (error: any) {
      res.status(500).json({ error: t(req, 'failed_fetch_booking') });
    }
  });

  // Cancel Booking
  app.post('/api/bookings/:id/cancel', async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ error: t(req, 'booking_not_found') });

      if (booking.status === 'Cancelled') {
        return res.status(400).json({ error: t(req, 'booking_already_cancelled') });
      }

      // Check if travel date is in the future (optional but recommended)
      const travelDate = new Date(booking.travelDate);
      if (travelDate < new Date()) {
        return res.status(400).json({ error: t(req, 'cannot_cancel_past') });
      }

      booking.status = 'Cancelled';
      booking.payment.status = 'Refunded'; // In a real app, you'd initiate a Razorpay refund here
      await booking.save();

      res.json({ success: true, message: t(req, 'booking_cancelled_success') });
    } catch (error: any) {
      res.status(500).json({ error: t(req, 'failed_cancel_booking') });
    }
  });

  // User Sync Endpoint (Sync Firebase User to MongoDB)
  app.post('/api/auth/sync', async (req, res) => {
    const { uid, email, name, phone, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: t(req, 'uid_email_required') });
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
      res.status(500).json({ error: t(req, 'failed_sync_user'), details: error.message });
    }
  });

  // Update User Profile Endpoint
  app.patch('/api/users/profile', async (req, res) => {
    const { uid, name, phone, avatar, preferredLang, notificationPreferences } = req.body;

    if (!uid) {
      return res.status(400).json({ error: t(req, 'uid_required') });
    }

    try {
      const user = await User.findOneAndUpdate(
        { uid },
        { name, phone, avatar, preferredLang, notificationPreferences },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: t(req, 'user_not_found') });
      }
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('❌ Profile Update Error:', error.message);
      res.status(500).json({ error: t(req, 'failed_update_profile'), details: error.message });
    }
  });

  // Razorpay Create Order Endpoint
  app.post('/api/create-razorpay-order', async (req, res) => {
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({ error: t(req, 'amount_required') });
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
      res.status(500).json({ error: t(req, 'failed_create_razorpay_order'), details: error.message });
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
      res.json({ success: true, message: t(req, 'payment_verified_successfully') });
    } else {
      res.status(400).json({ success: false, message: t(req, 'invalid_signature') });
    }
  });

  // Razorpay Refund Endpoint (Admin Only)
  app.post('/api/admin/refund', async (req, res) => {
    const { paymentId, amount, notes, adminUid } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: t(req, 'payment_id_required') });
    }

    try {
      // Verify admin role in MongoDB
      const admin = await User.findOne({ uid: adminUid, role: 'admin' });
      if (!admin) {
        return res.status(403).json({ error: t(req, 'unauthorized_admin') });
      }

      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount provided
        notes: notes || { reason: t(req, 'admin_refund_reason') }
      });
      
      console.log(`✅ Refund initiated: ${refund.id}`);
      res.json({ success: true, refund });
    } catch (error: any) {
      console.error('❌ Razorpay Refund Error:', error.message);
      res.status(500).json({ error: t(req, 'failed_initiate_refund'), details: error.message });
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
      res.status(400).send(t(req, 'invalid_webhook_signature'));
    }
  });

  // Twilio SMS Endpoint
  app.post('/api/send-sms', async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: t(req, 'phone_and_message_required') });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('⚠️ Twilio credentials missing in environment variables');
      return res.status(500).json({ error: t(req, 'sms_service_not_configured') });
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
      res.status(500).json({ error: t(req, 'failed_send_sms'), details: error.message });
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
