import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AIRecommendations } from "@/components/recommendations/AIRecommendations";
import { DynamicPricingDisplay } from "@/components/pricing/DynamicPricingDisplay";
import { toast } from "@/hooks/use-toast";
import type { Recommendation } from "@/types/api";

const Recommendations = () => {
  const handleSelect = (rec: Recommendation) => {
    toast({
      title: "Recommendation Selected!",
      description: `You selected ${rec.item.name}. Redirecting to booking...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIRecommendations userId="user123" onSelect={handleSelect} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Price Insights</h2>
              <DynamicPricingDisplay 
                itemId="FL001" 
                itemType="FLIGHT"
                onFreeze={() => {
                  toast({
                    title: "Price Frozen!",
                    description: "This price is locked for 48 hours.",
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;
