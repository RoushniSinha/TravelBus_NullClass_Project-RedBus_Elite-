import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularRoutes from "@/components/PopularRoutes";
import Features from "@/components/Features";
import Offers from "@/components/Offers";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PopularRoutes />
      <Features />
      <Offers />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
