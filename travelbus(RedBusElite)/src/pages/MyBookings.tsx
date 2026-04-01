import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingDashboard from "@/components/booking/BookingDashboard";

const MyBookings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <BookingDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
