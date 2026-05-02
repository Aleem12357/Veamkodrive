import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Cog, Fuel, MessageCircle, CalendarDays, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TIME_SLOTS, formatSlot } from "@/lib/scheduling";
import { PaymentSection, emptyPayment, validatePayment } from "@/components/PaymentSection";
import { SEO } from "@/components/SEO";
import { TiltCard } from "@/components/ui/TiltCard";
import { GuideBot } from "@/components/ui/GuideBot";
import { Textarea } from "@/components/ui/textarea";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { cleanPhone, validatePhone, sanitizeString } from "@/lib/validation";
import rentHeroVideo from "@/assets/herosection/rent-hero.mp4";

interface RentalCar {
  id: string; make: string; model: string; year: number; daily_rate: number; deposit: number;
  seats: number | null; transmission: string | null; fuel: string | null;
  description: string | null; image_url: string | null; available: boolean;
}

const Rent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Catalog State
  const [selected, setSelected] = useState<RentalCar | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [payment, setPayment] = useState(emptyPayment);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    duration: "",
    vehicleType: "",
    details: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["rental_cars", "available"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rental_cars")
        .select("id,make,model,year,daily_rate,deposit,seats,transmission,fuel,description,image_url,available")
        .eq("available", true);
      if (error) throw error;
      return (data ?? []) as RentalCar[];
    },
  });

  const days = (() => {
    if (!start || !end) return 0;
    const d = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
    return d > 0 ? Math.ceil(d) : 0;
  })();

  const total = selected ? days * Number(selected.daily_rate) + Number(selected.deposit) : 0;

  const closeDialog = () => {
    setSelected(null); setStart(""); setEnd(""); setPickupTime(""); setPayment(emptyPayment);
  };

  const book = async () => {
    if (!user) { toast.error("Please sign in to book"); navigate("/auth"); return; }
    if (!selected || days <= 0) { toast.error("Please pick valid dates"); return; }
    if (!pickupTime) { toast.error("Please pick a pickup time"); return; }
    const payErr = validatePayment(payment);
    if (payErr) { toast.error(payErr); return; }

    setSubmitting(true);
    const { data: booking, error } = await supabase.from("rental_bookings").insert({
      user_id: user.id, rental_car_id: selected.id,
      start_date: start, end_date: end, total_amount: total,
      pickup_time: pickupTime,
      payment_method: payment.method,
      payment_status: "unpaid",
    }).select("id").single();
    
    setSubmitting(false);
    if (error || !booking) { toast.error(error?.message || "Failed to create booking"); return; }
    
    closeDialog();
    toast.success("Booking confirmed — see you soon");
    navigate("/profile");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) { toast.error("Please enter a valid phone number"); return; }
    if (form.name.trim().length < 2) { toast.error("Please enter your full name"); return; }
    
    setFormSubmitting(true);

    const { error } = await supabase.from("brokerage_requests").insert({
      user_id: user?.id,
      intent: "rent",
      name: sanitizeString(form.name),
      phone: form.phone,
      price_range: form.duration,
      details: sanitizeString(`Vehicle Type: ${form.vehicleType || "Any"}. ${form.details}`.trim()),
    });

    setFormSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Your rental request has been submitted! We'll contact you shortly.");
    setForm({ name: "", phone: "", duration: "", vehicleType: "", details: "" });
  };

  return (
    <>
      <SEO
        title="Rent Premium Cars | Daily & Weekly Rentals | Veamkodrive"
        description="Experience luxury on your own terms. Rent premium cars by the day or week. Insurance included, 24/7 roadside support."
        path="/rent"
      />

      {/* HERO & FORM SECTION */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 z-0">
          <VideoBackground
            src={rentHeroVideo}
            fallbackSrc="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
            fallbackAlt="Premium car fleet"
            opacity={0.65}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/90 z-10" />
        </div>

        <div className="container relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="max-w-2xl text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Premium Rentals</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
                Drive on <br/><span className="text-gradient-gold italic">your terms.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Whether you need a luxury SUV for a family trip or a sports car for the weekend, tell us what you need or browse our available fleet below.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="gold" 
                  size="xl" 
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Search className="h-5 w-5 mr-2" /> Browse Fleet
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-green-500/50 hover:bg-green-500/10 hover:text-green-400 text-green-500 transition-colors"
                  onClick={() => window.open(`https://wa.me/96899814157?text=${encodeURIComponent("Hello! I want to rent a car.")}`, "_blank")}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>

            {/* Custom Rental Request Form */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <h3 className="font-display text-2xl mb-2">Request a specific vehicle</h3>
                <p className="text-muted-foreground text-sm mb-6">Don't see it in the catalog? Let us source it for you.</p>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: cleanPhone(e.target.value)})} placeholder="+968" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select value={form.duration} onValueChange={v => setForm({...form, duration: v})}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">1-3 Days</SelectItem>
                          <SelectItem value="weekly">1-2 Weeks</SelectItem>
                          <SelectItem value="monthly">Monthly+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicle Type</Label>
                      <Select value={form.vehicleType} onValueChange={v => setForm({...form, vehicleType: v})}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Luxury Sedan</SelectItem>
                          <SelectItem value="suv">Premium SUV</SelectItem>
                          <SelectItem value="sports">Sports Car</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Specific requests or dates *</Label>
                    <Textarea 
                      required rows={3} 
                      value={form.details} 
                      onChange={e => setForm({...form, details: e.target.value})} 
                      placeholder="e.g. I need a Mercedes S-Class for next weekend..."
                    />
                  </div>

                  <Button type="submit" variant="gold" className="w-full h-12 text-md" disabled={formSubmitting}>
                    {formSubmitting ? "Submitting..." : "Submit Rental Request"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section id="catalog" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl mb-4">Available Fleet</h2>
            <div className="gold-divider w-24 mx-auto mb-6" />
            <p className="text-muted-foreground">Book instantly from our currently available vehicles.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-secondary" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-secondary rounded w-2/3" />
                    <div className="h-3 bg-secondary rounded w-1/4" />
                    <div className="h-8 bg-secondary rounded w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map(c => (
                <TiltCard key={c.id} intensity={5} className="h-full">
                  <article className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/60 transition-elegant hover:shadow-[0_10px_30px_-15px_rgba(212,175,55,0.2)] h-full flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-secondary relative">
                      {c.image_url ? (
                        <img src={c.image_url} alt={`${c.make} ${c.model}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-elegant duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                      )}
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20">
                        Available Now
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display text-2xl">{c.make} {c.model}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{c.year}</p>
                      
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-6">
                        {c.seats && <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded"><Users className="h-3 w-3 text-primary" /> {c.seats}</span>}
                        {c.transmission && <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded"><Cog className="h-3 w-3 text-primary" /> {c.transmission}</span>}
                        {c.fuel && <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded"><Fuel className="h-3 w-3 text-primary" /> {c.fuel}</span>}
                      </div>

                      <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
                        <div>
                          <p className="font-display text-3xl text-primary">${Number(c.daily_rate).toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">per day</p>
                        </div>
                        <Dialog open={selected?.id === c.id} onOpenChange={(o) => o ? setSelected(c) : closeDialog()}>
                          <DialogTrigger asChild>
                            <Button variant="gold">Book Instantly</Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="font-display text-2xl">Book {c.make} {c.model}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div><Label>Pickup date</Label><Input type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
                                <div><Label>Return date</Label><Input type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
                              </div>
                              <div>
                                <Label>Pickup time</Label>
                                <Select value={pickupTime} onValueChange={setPickupTime}>
                                  <SelectTrigger><SelectValue placeholder="Select a slot" /></SelectTrigger>
                                  <SelectContent>
                                    {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{formatSlot(t)}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="bg-secondary/50 rounded-lg p-4 text-sm space-y-2 border border-border">
                                <div className="flex justify-between"><span>{days} day{days !== 1 ? "s" : ""} × ${c.daily_rate}</span><span>${(days * Number(c.daily_rate)).toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Refundable deposit</span><span>${Number(c.deposit).toFixed(2)}</span></div>
                                <div className="flex justify-between font-semibold text-lg text-primary pt-2 border-t border-border/50 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                              </div>
                              <PaymentSection value={payment} onChange={setPayment} />
                              <Button variant="gold" className="w-full h-12 text-md mt-2" onClick={book} disabled={submitting || days <= 0}>
                                {submitting ? "Processing…" : "Confirm Booking"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <GuideBot
        title="Rental Guide"
        messages={[
          { text: "🚗 Welcome to Car Rentals! You can either request a specific vehicle or book directly from our available fleet.", emoji: "🚗" },
          { text: "Fill out the form on the right to request any car — even if it's not in our catalog, we'll source it for you!", emoji: "📋" },
          { text: "Or scroll down to see all available cars ready for instant booking.", scrollToId: "catalog", emoji: "👇" },
          { text: "Want to discuss rental options directly? Hit the WhatsApp button to chat with us now! 💬", emoji: "💬" },
        ]}
      />
    </>
  );
};

export default Rent;
