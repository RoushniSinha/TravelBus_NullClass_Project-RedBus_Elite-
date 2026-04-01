import { motion } from "framer-motion";
import { Shield, Clock, Headphones, CreditCard, MapPin, RefreshCcw } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Every bus is verified with safety measures and insurance coverage for your peace of mind.",
  },
  {
    icon: Clock,
    title: "Live Tracking",
    description: "Track your bus in real-time and share location with family for a worry-free journey.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated team is available round the clock to assist you with any queries.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Multiple payment options with bank-grade security and instant confirmations.",
  },
  {
    icon: MapPin,
    title: "10,000+ Routes",
    description: "Extensive network covering all major cities and towns across India.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Cancellation",
    description: "Hassle-free cancellation with quick refunds directly to your payment source.",
  },
];

const Features = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
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
            ✨ Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Travel Made Simple
          </h2>
          <p className="text-muted-foreground text-lg">
            We've thought of everything so you can focus on enjoying your journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-card p-6 md:p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="w-14 h-14 gradient-hero rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
