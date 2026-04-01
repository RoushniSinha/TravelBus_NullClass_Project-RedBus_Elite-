import { Bus, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Feedback", href: "#" },
    ],
    legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
    partners: [
      { label: "Bus Operators", href: "#" },
      { label: "Advertise", href: "#" },
      { label: "Affiliate Program", href: "#" },
      { label: "Corporate Travel", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="gradient-hero p-2 rounded-xl">
                <Bus className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-display font-bold text-background">
                TravelBus
              </span>
            </a>
            <p className="text-background/70 mb-6 max-w-xs">
              India's most trusted bus booking platform. Book tickets to 10,000+ destinations with ease.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-background mb-4 capitalize">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-background/70">
            <a href="mailto:support@travelbus.com" className="flex items-center gap-2 hover:text-background transition-colors">
              <Mail className="h-4 w-4" />
              support@travelbus.com
            </a>
            <a href="tel:1800123456" className="flex items-center gap-2 hover:text-background transition-colors">
              <Phone className="h-4 w-4" />
              1800-123-456
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mumbai, India
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/120px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8 opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/120px-UPI-Logo-vector.svg.png" alt="UPI" className="h-8 opacity-70" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© 2026 TravelBus. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
