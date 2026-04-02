import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// User Pages
import HomePage from './pages/user/HomePage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import SearchResultsPage from './pages/user/SearchResultsPage';
import BusDetailPage from './pages/user/BusDetailPage';
import SeatSelectionPage from './pages/user/SeatSelectionPage';
import PassengerDetailsPage from './pages/user/PassengerDetailsPage';
import PaymentPage from './pages/user/PaymentPage';
import BookingConfirmPage from './pages/user/BookingConfirmPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import ProfilePage from './pages/user/ProfilePage';
import StoriesPage from './pages/user/StoriesPage';
import CreateStoryPage from './pages/user/CreateStoryPage';
import StoryDetailPage from './pages/user/StoryDetailPage';
import CommunityForumPage from './pages/user/CommunityForumPage';
import NotificationsPage from './pages/user/NotificationsPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminBusesPage from './pages/admin/AdminBusesPage';
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminStoriesPage from './pages/admin/AdminStoriesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';

export default function App() {
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
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout user={authState.user} role={authState.role} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={authState.user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={authState.user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/bus/:id" element={<BusDetailPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
          <Route path="/community" element={<CommunityForumPage />} />
          
          {/* Protected User Routes */}
          <Route path="/seat-selection" element={<UserProtectedRoute><SeatSelectionPage /></UserProtectedRoute>} />
          <Route path="/booking/passengers" element={<UserProtectedRoute><PassengerDetailsPage /></UserProtectedRoute>} />
          <Route path="/booking/payment" element={<UserProtectedRoute><PaymentPage /></UserProtectedRoute>} />
          <Route path="/booking/confirm" element={<UserProtectedRoute><BookingConfirmPage /></UserProtectedRoute>} />
          <Route path="/my-bookings" element={<UserProtectedRoute><MyBookingsPage /></UserProtectedRoute>} />
          <Route path="/profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />
          <Route path="/stories/create" element={<UserProtectedRoute><CreateStoryPage /></UserProtectedRoute>} />
          <Route path="/notifications" element={<UserProtectedRoute><NotificationsPage /></UserProtectedRoute>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={authState.user && authState.role === 'admin' ? <Navigate to="/admin" /> : <AdminLoginPage />} />
        <Route element={<AdminProtectedRoute><AdminLayout admin={authState.user} /></AdminProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
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
    </Router>
  );
}
