import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import HomePage from "@/pages/redbus/HomePage";
import SearchResultsPage from "@/pages/redbus/SearchResultsPage";
import SeatSelectionPage from "@/pages/redbus/SeatSelectionPage";
import PassengerDetailsPage from "@/pages/redbus/PassengerDetailsPage";
import PaymentPage from "@/pages/redbus/PaymentPage";
import BookingConfirmPage from "@/pages/redbus/BookingConfirmPage";
import MyBookingsPage from "@/pages/redbus/MyBookingsPage";
import BusTicketsPage from "@/pages/redbus/BusTicketsPage";
import TrainTicketsPage from "@/pages/redbus/TrainTicketsPage";
import StoriesPage from "@/pages/redbus/StoriesPage";
import StoryDetailPage from "@/pages/redbus/StoryDetailPage";
import StoryCreatePage from "@/pages/redbus/StoryCreatePage";
import CommunityForumPage from "@/pages/redbus/CommunityForumPage";
import OperatorPage from "@/pages/redbus/OperatorPage";
import ProfilePage from "@/pages/redbus/ProfilePage";
import AdminDashboard from "@/pages/redbus/AdminDashboard";
import AdminBusesPage from "@/pages/redbus/admin/AdminBusesPage";
import AdminRoutesPage from "@/pages/redbus/admin/AdminRoutesPage";
import AdminBookingsPage from "@/pages/redbus/admin/AdminBookingsPage";
import AdminUsersPage from "@/pages/redbus/admin/AdminUsersPage";
import AdminReviewsPage from "@/pages/redbus/admin/AdminReviewsPage";
import AdminStoriesPage from "@/pages/redbus/admin/AdminStoriesPage";
import AdminCouponsPage from "@/pages/redbus/admin/AdminCouponsPage";
import AdminNotificationsPage from "@/pages/redbus/admin/AdminNotificationsPage";
import AuthPage from "@/pages/redbus/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/bus-tickets" element={<BusTicketsPage />} />
                <Route path="/railways" element={<TrainTicketsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/stories/:id" element={<StoryDetailPage />} />
                <Route path="/community" element={<CommunityForumPage />} />
                <Route path="/operators/:id" element={<OperatorPage />} />

                {/* Protected — User */}
                <Route path="/seat-selection" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
                <Route path="/booking/passengers" element={<ProtectedRoute><PassengerDetailsPage /></ProtectedRoute>} />
                <Route path="/booking/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/booking/confirm" element={<ProtectedRoute><BookingConfirmPage /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route path="/stories/create" element={<ProtectedRoute><StoryCreatePage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Protected — Admin */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/buses" element={<ProtectedRoute><AdminBusesPage /></ProtectedRoute>} />
                <Route path="/admin/routes" element={<ProtectedRoute><AdminRoutesPage /></ProtectedRoute>} />
                <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookingsPage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
                <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviewsPage /></ProtectedRoute>} />
                <Route path="/admin/stories" element={<ProtectedRoute><AdminStoriesPage /></ProtectedRoute>} />
                <Route path="/admin/coupons" element={<ProtectedRoute><AdminCouponsPage /></ProtectedRoute>} />
                <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotificationsPage /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
