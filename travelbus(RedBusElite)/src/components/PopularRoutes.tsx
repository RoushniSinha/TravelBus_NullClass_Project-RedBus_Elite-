import { motion } from "framer-motion";
import { ArrowRight, Clock, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    from: "Mumbai",
    to: "Pune",
    duration: "3h 30m",
    price: 450,
    rating: 4.8,
    buses: 120,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=250&fit=crop"
  },
  {
    from: "Delhi",
    to: "Jaipur",
    duration: "5h 15m",
    price: 650,
    rating: 4.7,
    buses: 85,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=250&fit=crop"
  },
  {
    from: "Bangalore",
    to: "Chennai",
    duration: "6h 00m",
    price: 750,
    rating: 4.9,
    buses: 95,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop"
  },
  {
    from: "Hyderabad",
    to: "Bangalore",
    duration: "8h 30m",
    price: 900,
    rating: 4.6,
    buses: 75,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=250&fit=crop"
  },
  {
    from: "Chennai",
    to: "Pondicherry",
    duration: "3h 00m",
    price: 350,
    rating: 4.8,
    buses: 60,
    image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400&h=250&fit=crop"
  },
  {
    from: "Pune",
    to: "Goa",
    duration: "9h 00m",
    price: 1100,
    rating: 4.7,
    buses: 45,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop"
  },
];

const PopularRoutes = () => {
  return (
    <section id="routes" className="py-20 md:py-28 bg-background">
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
            🗺️ Popular Routes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Top Destinations
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our most booked routes with the best buses and competitive prices.
          </p>
        </motion.div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-primary-foreground">
                    <span className="text-xl font-display font-bold">{route.from}</span>
                    <ArrowRight className="h-5 w-5" />
                    <span className="text-xl font-display font-bold">{route.to}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 text-secondary fill-secondary" />
                  <span className="text-sm font-medium text-foreground">{route.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm">{route.buses} buses</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <div className="text-2xl font-display font-bold text-foreground">
                      ₹{route.price}
                    </div>
                  </div>
                  <Button size="sm">
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg">
            View All Routes
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularRoutes;
