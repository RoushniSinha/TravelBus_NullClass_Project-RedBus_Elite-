import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FlightStatusTracker } from "@/components/flights/FlightStatusTracker";

const FlightStatus = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <FlightStatusTracker />
      </div>
      <Footer />
    </div>
  );
};

export default FlightStatus;
