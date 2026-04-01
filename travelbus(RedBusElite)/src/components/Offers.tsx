import { motion } from "framer-motion";
import { Copy, Tag, Sparkles, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const offers = [
  {
    code: "FIRST50",
    discount: "50% OFF",
    description: "On your first booking",
    maxDiscount: "₹150",
    validTill: "31 Jan 2026",
    gradient: "from-primary to-secondary",
  },
  {
    code: "WEEKEND25",
    discount: "25% OFF",
    description: "On weekend travels",
    maxDiscount: "₹200",
    validTill: "28 Feb 2026",
    gradient: "from-secondary to-primary",
  },
  {
    code: "SLEEPER100",
    discount: "₹100 OFF",
    description: "On sleeper bus bookings",
    maxDiscount: "₹100",
    validTill: "15 Feb 2026",
    gradient: "from-primary via-secondary to-primary",
  },
];

const Offers = () => {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied to clipboard!`);
  };

  return (
    <section id="offers" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            🎉 Special Offers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Exclusive Deals
          </h2>
          <p className="text-muted-foreground text-lg">
            Save more on your travels with our limited-time offers and discount codes.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl"
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-90`} />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-card/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-card/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              {/* Content */}
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm font-medium text-primary-foreground/80">Limited Time</span>
                </div>

                <div className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-2">
                  {offer.discount}
                </div>
                <p className="text-lg text-primary-foreground/90 mb-4">
                  {offer.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6">
                  <Tag className="h-4 w-4" />
                  <span>Max discount: {offer.maxDiscount}</span>
                </div>

                {/* Code Box */}
                <div className="bg-card/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-primary-foreground/70">Use code</span>
                    <div className="text-lg font-mono font-bold text-primary-foreground">
                      {offer.code}
                    </div>
                  </div>
                  <Button
                    variant="heroOutline"
                    size="sm"
                    onClick={() => copyCode(offer.code)}
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>

                <div className="mt-4 text-xs text-primary-foreground/60">
                  Valid till {offer.validTill}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 gradient-hero rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
          
          <div className="relative z-10">
            <Percent className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
              Subscribe for Exclusive Deals
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
              Get personalized offers and be the first to know about flash sales and new routes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-card/20 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
              />
              <Button variant="hero" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Offers;
