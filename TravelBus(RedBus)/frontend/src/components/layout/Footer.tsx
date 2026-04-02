import { Link } from 'react-router-dom';
import { Bus, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] pt-20 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-[#F97316]/20">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
              Travel<span className="text-[#F97316]">Flow</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            Experience the next generation of bus travel. Secure, fast, and comfortable journeys across the country.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-all border border-[#222]">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-all border border-[#222]">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-all border border-[#222]">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/search" className="hover:text-[#F97316] transition-colors">Search Buses</Link></li>
            <li><Link to="/popular-routes" className="hover:text-[#F97316] transition-colors">Popular Routes</Link></li>
            <li><Link to="/my-bookings" className="hover:text-[#F97316] transition-colors">My Bookings</Link></li>
            <li><Link to="/stories" className="hover:text-[#F97316] transition-colors">Travel Stories</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-[#F97316] transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-[#F97316] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#F97316] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#F97316] transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contact Info</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#F97316]" />
              <span>support@travelflow.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#F97316]" />
              <span>+1 (555) 000-0000</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              <span>123 Travel St, Adventure City</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 TravelFlow. All rights reserved.</p>
        <p>Made with ❤️ for travelers</p>
      </div>
    </footer>
  );
}
