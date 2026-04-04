# 🚌 TravelBus (RedBus-Elite)

<div align="center">

**A premium full-stack bus booking and travel management platform for the Indian market.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://travelbus.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://travelbus-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

> **MCA Final Year Project** | Patna Women's College | Roushni Sinha | 2024–2026
> 
> Guide: Jay Kumar | NullClass Edtech Private Limited

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start with Docker](#quick-start-with-docker-recommended)
  - [Manual Setup](#manual-setup-without-docker)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

TravelBus (RedBus-Elite) is a production-grade, full-stack bus booking platform that goes beyond conventional ticketing. It integrates real-time GIS route mapping, a community travel platform, multi-language support, and a weighted Elite Score review system — all in a single unified interface.

[##Live Link of the WEBSITE -> ](https://travel-bus-red-bus-elite.vercel.app/)

Built to solve the **Digital Disconnect** in Indian bus travel:

| Problem | TravelBus Solution |
|---|---|
| Fragmented booking across multiple platforms | Single unified platform: search → book → review |
| No real-time delay notifications | Tri-channel alerts: Email + SMS + Push |
| English-only interfaces | 5 Indian languages: EN, HI, TE, TA, MR |
| No community engagement | UGC stories, forum, Elite Score reviews |
| Poor seat transparency | Live interactive seat maps with real-time status |

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><strong>Home Page</strong></td>
    <td align="center"><strong>Bus Booking</strong></td>
    <td align="center"><strong>Admi Dashboard</strong></td>
  </tr>
  <tr>
    <td><img src="TravelBus(RedBus)/Our Project ScreenSHorts/Our home page.png" alt="Home Page" width="100%"/></td>
    <td><img src="TravelBus(RedBus)/Our Project ScreenSHorts/Our Buses.png" alt="Buses Creation" width="100%"/></td>
    <td><img src="TravelBus(RedBus)/Our Project ScreenSHorts/Our Admin Dashboard.png" alt="Admin page" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Seat Selection</strong></td>
    <td align="center"><strong>Live Navigation</strong></td>
    <td align="center"><strong>Razorpay Payment</strong></td>
  </tr>
  <tr>
    <td><img src="TravelBus(RedBus)/Our Project ScreenSHorts/Our-Seat selection Page.png" alt="Seat" width="100%"/></td>
    <td><img src="TravelBus(RedBus)/Our Project ScreenSHorts/Our Bus Page Part 2 gis  Navigation route.png" alt="Live navigation" width="100%"/></td>
    <td><img src="TravelBus(RedBus)/Our Project ScreenSHorts/Our RAZORPAY WORK THROUGH UPI.png" alt="Razor Payment" width="100%"/></td>
  </tr>
</table>

> **Admin panel:** is accessed by admin only. this page is not open by any outsider of this project contribution only user dashboard visible through login and register.

---

## ✨ Features

### 🎫 Core Booking System
- **Smart Bus Search** — Search across 40+ buses with filters (bus type, price range, departure time, rating, amenities) and sorting
- **Interactive Seat Maps** — Visual seat layout with real-time status (Available / Selected / Booked / Locked), window seats priced separately
- **10-Minute Seat Lock** — Atomic MongoDB lock prevents race conditions; countdown timer with expiry handling
- **Razorpay Payment** — UPI (GPay, PhonePe, Paytm), Cards, Net Banking, Wallets — full payment modal with brand theme
- **PNR Generation** — Format: `RBE` + 8 random alphanumeric characters
- **E-Ticket Download** — PDF ticket with all booking details

### 🗺️ GIS Route Mapping
- **Leaflet.js Maps** — Interactive route visualization with OpenStreetMap (no paid API key)
- **Custom Markers** — Green origin pin, red destination pin, brown rest-stop markers with tooltips
- **Live Bus Tracking** — Animated pulsing blue dot, polls every 30 seconds
- **Dark Map Tiles** — Switches to CartoDB Dark Matter tiles in dark mode
- **Auto-fit Bounds** — Map automatically frames the entire route

### 🔔 Tri-Channel Notifications
- **Email** — HTML templates via Resend API (booking confirmation, journey reminders)
- **SMS** — Under 160 chars via Twilio (PNR + route details)
- **Push** — Firebase Cloud Messaging with deep links
- **Pattern** — `Promise.allSettled()` — one channel failure never affects others
- **Scheduler** — `node-cron` sends journey reminders 24h before departure

### 🌍 Multi-Language Support (i18n)
| Language | Script | Code |
|---|---|---|
| English | Latin | `en` |
| Hindi | देवनागरी | `hi` |
| Telugu | తెలుగు | `te` |
| Tamil | தமிழ் | `ta` |
| Marathi | मराठी | `mr` |

Real Unicode scripts — not romanised transliterations. Language preference synced to user profile in MongoDB.

### ⭐ Elite Score Review System
```
EliteScore = (Punctuality × 0.5) + (Cleanliness × 0.3) + (Amenities × 0.2)
```
- Always uses `parseFloat()` — prevents `'4'+'3'='43'` string concatenation bug
- Live preview updates as user selects stars
- Color coded: ≥4.0 🟢 Green | 3.0–3.9 🟡 Amber | <3.0 🔴 Red
- Booking eligibility gate — only verified travellers can review
- Bus `avgRating` updated via Mongoose `post('save')` hook aggregation

### 📖 UGC Community Platform
- **Travel Stories** — 3-step creation wizard, Cloudinary image hosting, masonry grid
- **Community Forum** — 5 categories, nested replies, upvotes, Best Answer marking, Top Contributors leaderboard
- **Admin Moderation** — Approve / Reject / Feature stories; Pin / Flag forum posts
- **Points System** — Story = 10 pts | Post = 5 pts | Reply = 2 pts

### 🔐 Authentication
- **Separate User & Admin Login** — Different JWT secrets, different UI pages
- **Google Sign-In** — Via Firebase Auth (no `google-auth-library` needed)
- **JWT Tokens** — Access token (15min) + Refresh token (7 days)
- **Admin seeded** automatically on first server start

### 🌑 OLED Dark Mode
- True `#000000` background (not Tailwind's default `#111827`)
- Three modes: Light / Dark / System (auto-detects `prefers-color-scheme`)
- Flash prevention script in `<head>` before React hydration
- Persisted to `localStorage` key `rb_theme`

### 🛡️ Admin Dashboard
- **Full CRUD** — Buses, Routes, Bookings, Users, Reviews, Stories, Coupons
- **Analytics** — Line/Bar/Pie/Area charts via Recharts
- **Notification Composer** — Send to All Users / By Role / Specific Users via Email + SMS + Push
- **User Management** — Ban/Unban with reason, role changes, full activity view
- **Review Moderation** — Approve/Reject/Flag with notification to author
- **Seed Sample Data** — One-click seed reviews/stories for testing

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI library |
| Vite | 5.4.x | Build tool & dev server |
| TypeScript | 5.8.x | Type safety |
| Tailwind CSS | 3.4.x | Utility-first styling |
| shadcn/ui | Latest | Accessible component library |
| React Router DOM | 6.30.x | Client-side routing |
| Framer Motion | 12.x | Animations & transitions |
| Leaflet.js + React-Leaflet | 1.9.4 + 5.0 | Interactive GIS maps |
| i18next + react-i18next | Latest | Internationalisation |
| Recharts | 2.15.x | Admin analytics charts |
| Axios | Latest | HTTP client with interceptors |
| date-fns | 3.6.x | Date manipulation |
| Firebase JS SDK | 10.12.0 | Google login + push notifications |
| Zod | 3.22.x | Form validation |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18.x LTS | Runtime |
| Express.js | 4.19.x | REST API framework |
| Mongoose | 8.4.x | MongoDB ODM |
| MongoDB Atlas | Cloud | Primary database |
| Firebase Admin SDK | 12.0.0 | FCM push + Google token verify |
| bcryptjs | 2.4.x | Password hashing (saltRounds: 12) |
| jsonwebtoken | 9.0.x | JWT access + refresh tokens |
| Multer | 1.4.x | File upload (memoryStorage) |
| Cloudinary SDK | 2.0 | Image hosting & transformation |
| Resend | 3.0 | Transactional email |
| Twilio | 4.19.x | SMS notifications |
| Razorpay | Latest | Payment gateway |
| node-cron | Latest | Scheduled jobs |
| Helmet.js | 7.0 | HTTP security headers |
| express-rate-limit | 7.0 | API rate limiting |
| Zod | 3.22.x | Backend request validation |

### Infrastructure
| Service | Purpose | Free Tier |
|---|---|---|
| MongoDB Atlas | Database | 512 MB forever |
| Cloudinary | Image storage | 25 GB storage |
| Firebase | FCM push + Google auth | Completely free |
| Resend | Email delivery | 3,000 emails/month |
| Twilio | SMS | $15 trial credit |
| Razorpay | Payments | Test mode free |
| Vercel | Frontend hosting | Free hobby tier |
| Render | Backend hosting | 750 hours/month |
| Docker | Local development | Free |

---

## 📁 Project Structure

```
travelbus/
├── 📄 docker-compose.yml          # One command local setup
├── 📄 .gitignore
├── 📄 README.md
│
├── 🗂️ backend/
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.example            # ← copy to .env and fill values
│   └── src/
│       ├── 📄 server.ts           # Entry point
│       ├── 📄 app.ts              # Express app + middleware
│       ├── config/
│       │   ├── database.ts        # MongoDB connection + indexes
│       │   ├── firebase.ts        # Firebase Admin (FCM + Google auth)
│       │   ├── cloudinary.ts      # Cloudinary config
│       │   └── razorpay.ts        # Razorpay instance
│       ├── models/                # Mongoose schemas
│       │   ├── User.model.ts
│       │   ├── Bus.model.ts
│       │   ├── Seat.model.ts
│       │   ├── Booking.model.ts
│       │   ├── Review.model.ts
│       │   ├── Story.model.ts
│       │   ├── Comment.model.ts
│       │   ├── Forum.model.ts
│       │   ├── Notification.model.ts
│       │   ├── NotificationLog.model.ts
│       │   ├── NotifPrefs.model.ts
│       │   ├── City.model.ts
│       │   └── Coupon.model.ts
│       ├── routes/                # Express route handlers
│       │   ├── auth.routes.ts     # /api/auth/user/* + /api/auth/admin/*
│       │   ├── buses.routes.ts    # /api/buses/*
│       │   ├── bookings.routes.ts # /api/bookings/*
│       │   ├── reviews.routes.ts  # /api/reviews/*
│       │   ├── stories.routes.ts  # /api/stories/*
│       │   ├── forum.routes.ts    # /api/forum/*
│       │   ├── notifications.routes.ts
│       │   ├── users.routes.ts    # /api/users/*
│       │   ├── coupons.routes.ts
│       │   └── admin.routes.ts    # /api/admin/*
│       ├── middleware/
│       │   ├── auth.middleware.ts # verifyUserToken, verifyAdminToken
│       │   ├── upload.middleware.ts # Multer memoryStorage
│       │   └── rateLimit.middleware.ts
│       ├── services/
│       │   ├── notification.service.ts  # Email + SMS + Push
│       │   ├── cloudinary.service.ts
│       │   └── cron.service.ts          # Scheduled jobs
│       └── utils/
│           ├── seedDatabase.ts    # 40 buses + cities + seats
│           ├── seedAdmin.ts       # Admin account from .env
│           ├── generatePNR.ts
│           ├── eliteScore.ts
│           └── checkEnv.ts        # Validates env vars on startup
│
└── 🗂️ frontend/
    ├── 📄 Dockerfile
    ├── 📄 package.json
    ├── 📄 vite.config.ts
    ├── 📄 .env.example            # ← copy to .env and fill values
    └── src/
        ├── 📄 main.tsx
        ├── 📄 App.tsx             # All routes defined here
        ├── 📄 i18n.ts             # i18next configuration
        ├── pages/
        │   ├── user/              # User-facing pages
        │   │   ├── HomePage.tsx
        │   │   ├── LoginPage.tsx
        │   │   ├── RegisterPage.tsx
        │   │   ├── SearchResultsPage.tsx
        │   │   ├── SeatSelectionPage.tsx
        │   │   ├── PassengerDetailsPage.tsx
        │   │   ├── PaymentPage.tsx
        │   │   ├── BookingConfirmPage.tsx
        │   │   ├── MyBookingsPage.tsx
        │   │   ├── ProfilePage.tsx
        │   │   ├── StoriesPage.tsx
        │   │   ├── CreateStoryPage.tsx
        │   │   ├── StoryDetailPage.tsx
        │   │   ├── CommunityForumPage.tsx
        │   │   └── NotificationsPage.tsx
        │   └── admin/             # Admin panel pages
        │       ├── AdminLoginPage.tsx
        │       ├── AdminDashboard.tsx
        │       ├── AdminBusesPage.tsx
        │       ├── AdminBookingsPage.tsx
        │       ├── AdminUsersPage.tsx
        │       ├── AdminReviewsPage.tsx
        │       ├── AdminStoriesPage.tsx
        │       ├── AdminCouponsPage.tsx
        │       └── AdminNotificationsPage.tsx
        ├── components/
        │   ├── layout/            # Navbar, Footer, AdminSidebar
        │   ├── user/              # BusCard, SeatMap, ReviewForm, etc.
        │   ├── admin/             # DataTable, ChartPanel, etc.
        │   └── common/            # LoadingSpinner, ErrorBoundary, etc.
        ├── contexts/
        │   ├── UserAuthContext.tsx
        │   ├── AdminAuthContext.tsx
        │   └── ThemeContext.tsx
        ├── config/
        │   └── firebase.ts        # Firebase client SDK
        ├── services/
        │   └── api.ts             # Axios instance + interceptors
        ├── types/
        │   └── index.ts           # All TypeScript interfaces
        └── assets/
            └── i18n/              # en.json, hi.json, te.json, ta.json, mr.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (recommended) — [Download here](https://docker.com/products/docker-desktop)
- **OR** Node.js 18+ and npm 9+ (for manual setup)
- Git

### Quick Start with Docker (Recommended)

Docker solves all local package issues including Firebase native modules on Windows/Mac.

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/travelbus.git
cd travelbus
```

**2. Set up environment variables**
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your credentials
# Edit frontend/.env with your credentials
# See Environment Variables section below for details
```

**3. Start everything with one command**
```bash
docker-compose up --build
```

**4. Access the app**

| Service | URL |
|---|---|
| 🌐 Frontend (User) | http://localhost:5173 |
| 🔐 Admin Panel | http://localhost:5173/admin/login |
| 🔧 Backend API | http://localhost:5000/api |
| ❤️ Health Check | http://localhost:5000/api/health |
| 🗄️ MongoDB (local) | mongodb://localhost:27017/travelbus |

**5. Default admin credentials** (created automatically on first start)
```
Email:    → set in your backend/.env as ADMIN_SEED_EMAIL
Password: → set in your backend/.env as ADMIN_SEED_PASSWORD
```

**Useful Docker commands**
```bash
docker-compose up --build        # Start all services (rebuild)
docker-compose up -d             # Start in background
docker-compose down              # Stop all services
docker-compose logs -f backend   # View backend logs
docker-compose logs -f frontend  # View frontend logs
docker-compose exec backend sh   # Shell into backend container
docker-compose exec mongo mongosh travelbus  # MongoDB shell
```

---

### Manual Setup (Without Docker)

**1. Install backend dependencies**
```bash
cd backend
npm install
# Firebase Admin requires --ignore-scripts on some systems
npm install firebase-admin@12.0.0 --ignore-scripts --save
```

**2. Install frontend dependencies**
```bash
cd frontend
npm install
```

**3. Set up environment variables**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill in your values — see Environment Variables section
```

**4. Validate environment variables**
```bash
cd backend
npm run check-env
```

**5. Start both servers**

Terminal 1 (backend):
```bash
cd backend
npm run dev
# Backend starts at http://localhost:5000
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
# Frontend starts at http://localhost:5173
```

---

## 🔑 Environment Variables

### Generate JWT Secrets

Run this command **4 times** — use a different output for each JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### `backend/.env`

```env
# ─── SERVER ──────────────────────────────────────────────────
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ─── DATABASE ────────────────────────────────────────────────
# Docker local MongoDB:
MONGO_URI=mongodb://mongo:27017/travelbus
# OR MongoDB Atlas (for production):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/travelbus

# ─── JWT SECRETS (generate with crypto command above) ────────
JWT_ACCESS_SECRET=paste_your_generated_secret_here
JWT_REFRESH_SECRET=paste_a_different_generated_secret_here
ADMIN_JWT_ACCESS_SECRET=paste_another_different_secret_here
ADMIN_JWT_REFRESH_SECRET=paste_a_fourth_different_secret_here

# ─── ADMIN ACCOUNT (you choose these — no default!) ──────────
ADMIN_SEED_EMAIL=your_email@example.com
ADMIN_SEED_PASSWORD=YourStrongPassword@2024
ADMIN_SEED_NAME=Your Name

# ─── FIREBASE (handles Google Login + Push Notifications) ────
# Get from: Firebase Console → Project Settings → Service Accounts
# → Generate new private key → minify the JSON → paste entire JSON here
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# ─── CLOUDINARY (image uploads) ──────────────────────────────
# Get from: cloudinary.com → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── RESEND (email notifications) ────────────────────────────
# Get from: resend.com → API Keys
RESEND_API_KEY=re_your_key_here

# ─── TWILIO (SMS notifications) ──────────────────────────────
# Get from: twilio.com → Console Dashboard
TWILIO_ACCOUNT_SID=ACyour_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+12015551234

# ─── RAZORPAY (payments) ─────────────────────────────────────
# Get from: razorpay.com → Settings → API Keys (use Test keys for dev)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### `frontend/.env`

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Razorpay (same key as backend, test mode)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Firebase Web App Config
# Get from: Firebase Console → Project Settings → Your Apps → Web App
VITE_FIREBASE_API_KEY=AIzaSy_your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:your_app_id

# Firebase VAPID Key (for push notifications)
# Get from: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

> ⚠️ **Never commit `.env` files to GitHub.** Both are listed in `.gitignore`.
> 
> ✅ **Only commit `.env.example` files** — these have no real values, just instructions.

---

## 🌱 Database Seeding

The database seeds **automatically** on first server start. Seeds include:

| Data | Count | Details |
|---|---|---|
| Buses | 40 | All major Indian states, real operators |
| Cities | 40+ | With aliases (Bombay→Mumbai, Vizag→Visakhapatnam) |
| Seat Documents | ~200 | 7-day rolling schedule per bus |
| Admin Account | 1 | From your `.env` credentials |

**Seed is idempotent** — running the server a second time skips seeding automatically.

**Covered routes include:**

```
North:   Delhi → Lucknow, Agra, Varanasi, Amritsar, Manali, Chandigarh, Dehradun
West:    Mumbai → Pune, Goa | Ahmedabad → Surat, Mumbai | Jaipur → Delhi, Jodhpur
South:   Chennai → Bangalore, Coimbatore, Madurai | Bangalore → Mysuru, Hyderabad
         Kochi → Bangalore | Hyderabad → Chennai
East:    Kolkata → Bhubaneswar, Patna | Bhubaneswar → Visakhapatnam
Central: Bhopal → Indore | Indore → Mumbai | Raipur → Nagpur
NE:      Guwahati → Shillong, Kolkata
J&K:     Jammu → Srinagar
Long:    Bangalore → Mumbai | Hyderabad → Bangalore | Mumbai → Ahmedabad
```

**Manual seed commands** (if needed):
```bash
# Re-seed database (Docker)
docker-compose exec backend npx ts-node src/utils/seedDatabase.ts

# Seed sample reviews (for testing admin review moderation)
# Use the "+ Seed Sample Reviews" button in Admin → Reviews panel
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production:  https://your-backend.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/user/register` | None | Register new user |
| `POST` | `/auth/user/login` | None | User email/password login |
| `POST` | `/auth/user/google` | None | Google Sign-In via Firebase |
| `GET` | `/auth/user/me` | User JWT | Get current user |
| `POST` | `/auth/admin/login` | None | Admin login (separate endpoint) |
| `GET` | `/auth/admin/me` | Admin JWT | Get current admin |
| `POST` | `/auth/refresh` | None | Refresh user access token |

### Bus & Search Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/buses/search?from=&to=&date=` | None | Search buses with filters |
| `GET` | `/buses/:id` | None | Get bus details |
| `GET` | `/buses/:id/seats?date=` | None | Get seat layout for date |
| `POST` | `/buses/:id/seats/lock` | User | Lock seats (10 min) |
| `DELETE` | `/buses/:id/seats/unlock` | User | Release seat lock |
| `GET` | `/cities/search?q=` | None | City autocomplete |

### Booking Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/bookings/initiate` | User | Create booking + Razorpay order |
| `POST` | `/bookings/confirm` | User | Verify payment + confirm booking |
| `GET` | `/bookings` | User | Get user's bookings |
| `GET` | `/bookings/:id` | User | Get booking details |
| `POST` | `/bookings/:id/cancel` | User | Cancel booking |

### Reviews Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/reviews/bus/:busId` | None | Get approved reviews for bus |
| `GET` | `/reviews/can-review/:bookingId` | User | Check review eligibility |
| `POST` | `/reviews` | User | Submit review |
| `PUT` | `/reviews/:id` | User | Edit own review (within 24h) |

### Stories Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/stories` | None | Get approved stories (paginated) |
| `GET` | `/stories/:id` | None | Get story detail |
| `POST` | `/stories` | User | Create story (multipart) |
| `PUT` | `/stories/:id` | User | Edit own story |
| `DELETE` | `/stories/:id` | User/Admin | Delete story |
| `POST` | `/stories/:id/like` | User | Toggle like |

### Admin Endpoints

All admin endpoints require `Authorization: Bearer {admin_token}` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/stats` | Dashboard statistics |
| `GET` | `/admin/users` | All users (paginated, searchable) |
| `PATCH` | `/admin/users/:id/ban` | Ban user with reason |
| `POST` | `/admin/notifications/send` | Send bulk notifications |
| `PATCH` | `/admin/reviews/:id/approve` | Approve review |
| `PATCH` | `/admin/stories/:id/approve` | Approve story |
| `POST` | `/admin/reviews/seed` | Seed sample reviews |

---

## 🚢 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Framework: **Vite** (auto-detected)
4. Add all `VITE_` environment variables in Vercel dashboard
5. Set `VITE_API_URL` to your Render backend URL
6. Add `vercel.json` for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend → Render

1. New Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install && npm run build`
4. Start command: `node dist/server.js`
5. Add all environment variables
6. Set `MONGO_URI` to MongoDB Atlas URL (not `mongodb://mongo:...`)
7. Set `NODE_ENV=production`
8. Set `FRONTEND_URL` to your Vercel URL

### After Deploying — Update Firebase

Firebase Console → Authentication → Settings → **Authorized domains**:
```
Add: your-app.vercel.app
Add: your-project.web.app  (if using Firebase Hosting)
```

### Razorpay — Switch to Live Mode

When going live, replace test keys with live keys:
```env
RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_SECRET=your_live_secret
```

---

## 🧪 Test Credentials (Development Only)

```
Admin Login:   http://localhost:5173/admin/login
               Email: set in your ADMIN_SEED_EMAIL
               Password: set in your ADMIN_SEED_PASSWORD

Razorpay Test:
  UPI:         success@razorpay (succeeds) | failure@razorpay (fails)
  Card:        4111 1111 1111 1111 | any future expiry | any 3-digit CVV
  Net Banking: Select any bank → use test credentials shown
```

---

## 🤝 Contributing

This is an academic project but contributions and suggestions are welcome.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Code style:**
- TypeScript strict mode — no `any` types
- All components need loading + error + empty states
- Follow existing file and folder naming conventions

---

## 📄 License

```
MIT License

Copyright (c) 2024-2026 Roushni Sinha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgements

| Resource | Purpose |
|---|---|
| [MongoDB Atlas](https://mongodb.com/atlas) | Cloud database hosting |
| [Cloudinary](https://cloudinary.com) | Image storage & CDN |
| [Firebase](https://firebase.google.com) | Push notifications & Google auth |
| [Resend](https://resend.com) | Transactional email |
| [Twilio](https://twilio.com) | SMS notifications |
| [Razorpay](https://razorpay.com) | Payment gateway |
| [OpenStreetMap](https://openstreetmap.org) | Free map tiles |
| [Leaflet.js](https://leafletjs.com) | Interactive maps |
| [shadcn/ui](https://ui.shadcn.com) | Accessible UI components |
| [Vercel](https://vercel.com) | Frontend deployment |
| [Render](https://render.com) | Backend deployment |

---

<div align="center">

**Made with ❤️ for MCA Final Year Project**

Patna Women's College | Department of MCA | 2024–2026

**Roushni Sinha** | Roll No: 24MCA02534

Guide: Jay Kumar | NullClass Edtech Private Limited

---

⭐ If this project helped you, please give it a star on GitHub!

</div>
