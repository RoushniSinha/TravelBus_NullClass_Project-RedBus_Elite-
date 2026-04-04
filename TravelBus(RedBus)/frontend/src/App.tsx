import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/user/HomePage'));
const LoginPage = lazy(() => import('./pages/user/LoginPage'));
const RegisterPage = lazy(() => import('./pages/user/RegisterPage'));
const SearchResultsPage = lazy(() => import('./pages/user/SearchResultsPage'));
const BusDetailPage = lazy(() => import('./pages/user/BusDetailPage'));
const SeatSelectionPage = lazy(() => import('./pages/user/SeatSelectionPage'));
const PassengerDetailsPage = lazy(() => import('./pages/user/PassengerDetailsPage'));
const PaymentPage = lazy(() => import('./pages/user/PaymentPage'));
const BookingConfirmPage = lazy(() => import('./pages/user/BookingConfirmPage'));
const MyBookingsPage = lazy(() => import('./pages/user/MyBookingsPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const StoriesPage = lazy(() => import('./pages/user/StoriesPage'));
const ForumPage = lazy(() => import('./pages/user/ForumPage'));
const LiveTrackingPage = lazy(() => import('./pages/user/LiveTrackingPage'));
const PopularRoutesPage = lazy(() => import('./pages/user/PopularRoutesPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBusesPage = lazy(() => import('./pages/admin/AdminBusesPage'));
const AdminRoutesPage = lazy(() => import('./pages/admin/AdminRoutesPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminStoriesPage = lazy(() => import('./pages/admin/AdminStoriesPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));

function App() {
  const [authState, setAuthState] = useState<{
    user: any;
    role: string | null;
    loading: boolean;
  }>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userRole = 'user';
        if (firebaseUser.email === "rsdivinelight11@gmail.com") {
          userRole = 'admin';
          // Ensure admin doc exists and has correct role
          try {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Admin',
              email: firebaseUser.email,
              role: 'admin',
              isActive: true,
              createdAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.error("Error ensuring admin doc:", e);
          }
        } else if (userDoc.exists()) {
          userRole = userDoc.data().role;
        }

        setAuthState({
          user: firebaseUser,
          role: userRole,
          loading: false
        });
      } else {
        setAuthState({
          user: null,
          role: null,
          loading: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState.loading) return <LoadingSpinner />;

  const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authState.user) return <Navigate to="/login" />;
    return <>{children}</>;
  };

  const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authState.user || authState.role !== 'admin') return <Navigate to="/admin/login" />;
    return <>{children}</>;
  };

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* User Routes */}
          <Route element={<UserLayout user={authState.user} role={authState.role} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={authState.user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/register" element={authState.user ? <Navigate to="/" /> : <RegisterPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/bus/:id" element={<BusDetailPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/forum" element={<ForumPage />} />
            
            {/* Protected User Routes */}
            <Route path="/seat-selection" element={<UserProtectedRoute><SeatSelectionPage /></UserProtectedRoute>} />
            <Route path="/booking/passengers" element={<UserProtectedRoute><PassengerDetailsPage /></UserProtectedRoute>} />
            <Route path="/booking/payment" element={<UserProtectedRoute><PaymentPage /></UserProtectedRoute>} />
            <Route path="/booking/confirm" element={<UserProtectedRoute><BookingConfirmPage /></UserProtectedRoute>} />
            <Route path="/my-bookings" element={<UserProtectedRoute><MyBookingsPage /></UserProtectedRoute>} />
            <Route path="/profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />
            <Route path="/live-tracking" element={<LiveTrackingPage />} />
            <Route path="/popular-routes" element={<PopularRoutesPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={authState.user && authState.role === 'admin' ? <Navigate to="/admin" /> : <AdminLoginPage />} />
          <Route element={<AdminProtectedRoute><AdminLayout admin={authState.user} /></AdminProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/buses" element={<AdminBusesPage />} />
            <Route path="/admin/routes" element={<AdminRoutesPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/stories" element={<AdminStoriesPage />} />
            <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
