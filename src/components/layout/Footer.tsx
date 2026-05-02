import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo/logo.png";

export const Footer = () => (
  <footer className="mt-24 border-t border-border bg-gradient-navy">
    <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Veamko Drive On logo" loading="lazy" className="h-16 w-auto object-contain" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Premium automobiles, expert care. Your trusted destination for buying, selling, renting and servicing fine vehicles.
        </p>
      </div>

      <div>
        <h4 className="font-display text-lg mb-4 text-primary">Services</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/repair" className="hover:text-primary transition-elegant">Car Repair</Link></li>
          <li><Link to="/buy-sell" className="hover:text-primary transition-elegant">Buy & Sell</Link></li>
          <li><Link to="/rent" className="hover:text-primary transition-elegant">Rent a Car</Link></li>
          <li><Link to="/parts" className="hover:text-primary transition-elegant">Car Parts</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg mb-4 text-primary">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-primary transition-elegant">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-primary transition-elegant">Contact</Link></li>
          <li><Link to="/services" className="hover:text-primary transition-elegant">All Services</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg mb-4 text-primary">Reach Us</h4>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /> +968 9981 4157</li>
          <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /> hello@veamkodrive.com</li>
          <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" /> Sat–Thu: 9am–1pm, 4pm–11pm (Fri Off)</li>
          <li className="flex items-start gap-2 leading-tight">
            <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <a href="https://goo.gl/maps/nvoCq4RVP6XfLZtA9" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-xs">
              AA5 Autos خدمات للسیارات Land No. 9058, Way No. 7744, Next to Candle Cafe, Mabelah Industrial road No. 9, Muscat
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-6 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Veamkodrive. All rights reserved.</p>
        <p>Crafted with care.</p>
      </div>
    </div>
  </footer>
);
