import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, User as UserIcon, Menu, X, LogOut, Shield, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/repair", label: "Repair" },
  { to: "/parts", label: "Parts" },
  { to: "/rent", label: "Rent" },
  { to: "/consulting", label: "Consulting" },
  { to: "/buy-sell", label: "Buy & Sell" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Veamko Drive On logo"
            className="h-10 md:h-14 w-auto object-contain transition-elegant group-hover:scale-105"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-elegant hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => window.open("https://goo.gl/maps/nvoCq4RVP6XfLZtA9", "_blank")} className="hidden sm:inline-flex" title="Find Our Workshop">
            <MapPin className="h-5 w-5 text-primary" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => navigate("/cart")} className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-gold text-primary-foreground text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><UserIcon className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/cart")}>My Cart</DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-2" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="gold" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex">
              Sign in
            </Button>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 px-3 rounded transition-elegant ${
                    isActive ? "text-primary bg-secondary" : "text-foreground/80 hover:bg-secondary"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Button variant="gold" className="mt-2" onClick={() => { setOpen(false); navigate("/auth"); }}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
