import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReviewSystem } from "@/components/reviews/ReviewSystem";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 container mx-auto px-4 py-8">
        <ReviewSystem entityId="hotel001" entityName="Taj Mahal Palace" />
      </div>
      <Footer />
    </div>
  );
};

export default Reviews;
