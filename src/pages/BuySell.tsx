import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TiltCard } from "@/components/ui/TiltCard";
import { ShieldCheck, MessageCircle, DollarSign, Handshake, Car } from "lucide-react";
import { toast } from "sonner";
import { GuideBot } from "@/components/ui/GuideBot";
import { VideoBackground } from "@/components/ui/VideoBackground";
import buysellHeroVideo from "@/assets/herosection/buysell-hero.mp4";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cleanPhone, validatePhone, sanitizeString } from "@/lib/validation";

const BuySell = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    intent: "buy", // buy, sell, trade
    name: "",
    phone: "",
    range: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) { toast.error("Please enter a valid phone number"); return; }
    if (form.name.trim().length < 2) { toast.error("Please enter your full name"); return; }
    
    setSubmitting(true);
    
    const { error } = await supabase.from("brokerage_requests").insert({
      user_id: user?.id,
      intent: form.intent,
      name: sanitizeString(form.name),
      phone: form.phone,
      price_range: form.range,
      details: sanitizeString(form.details)
    });

    setSubmitting(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Your ${form.intent} request has been submitted! Our team will contact you shortly.`);
    setForm({ intent: "buy", name: "", phone: "", range: "", details: "" });
  };

  return (
    <>
      <SEO
        title="Buy, Sell, or Trade Premium Cars | Veamkodrive"
        description="Experience a seamless car transaction. Whether you're buying your dream car or selling your current vehicle, we handle everything for you."
        path="/buy-sell"
      />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <VideoBackground
            src={buysellHeroVideo}
            fallbackSrc="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
            fallbackAlt="Premium car keys handover"
            opacity={0.65}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/90 z-10" />
        </div>

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-up">
              <Handshake className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-medium">Premium Brokerage</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              The smartest way to <br/><span className="text-gradient-gold italic">Buy or Sell a Car.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Don't deal with the hassle of endless negotiations and risky private sales. Let Veamkodrive handle the transaction with transparency, security, and a premium guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button 
                variant="gold" 
                size="xl" 
                onClick={() => document.getElementById('brokerage-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Transaction
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC ADVERTISEMENT SHOWCASE */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative h-[600px] w-full hidden lg:block">
              <TiltCard intensity={15} className="absolute top-10 left-0 w-[75%] h-[60%] rounded-2xl overflow-hidden shadow-2xl z-10 border-4 border-background">
                <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop" alt="Buying process" className="w-full h-full object-cover" />
              </TiltCard>
              <TiltCard intensity={25} className="absolute bottom-10 right-0 w-[75%] h-[60%] rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-background">
                <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" alt="Sports cars" className="w-full h-full object-cover" />
              </TiltCard>
            </div>

            <div className="space-y-8 animate-fade-up">
              <div>
                <h2 className="font-display text-4xl md:text-5xl mb-4">Why transact with us?</h2>
                <div className="gold-divider w-24 mb-6" />
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We bridge the gap between premium sellers and serious buyers. Our verified network ensures you get the best value, whether you're cashing out or upgrading.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TiltCard intensity={5} className="bg-card border border-border p-6 rounded-xl shadow-lg">
                  <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-display text-xl mb-2">Verified Inventory</h3>
                  <p className="text-sm text-muted-foreground">Every car passes a 150-point inspection before we broker it.</p>
                </TiltCard>
                <TiltCard intensity={5} className="bg-card border border-border p-6 rounded-xl shadow-lg">
                  <DollarSign className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-display text-xl mb-2">Maximum Value</h3>
                  <p className="text-sm text-muted-foreground">We take a minimal commission to ensure you pocket more.</p>
                </TiltCard>
                <TiltCard intensity={5} className="bg-card border border-border p-6 rounded-xl shadow-lg">
                  <Car className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-display text-xl mb-2">Instant Trade-ins</h3>
                  <p className="text-sm text-muted-foreground">Upgrade instantly by applying your car's value to a new purchase.</p>
                </TiltCard>
                <TiltCard intensity={5} className="bg-card border border-border p-6 rounded-xl shadow-lg">
                  <Handshake className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-display text-xl mb-2">Paperwork Handled</h3>
                  <p className="text-sm text-muted-foreground">We handle the DMV, registration, and title transfers for you.</p>
                </TiltCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD GEN FORM */}
      <section id="brokerage-form" className="py-24 relative overflow-hidden bg-secondary/20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="container max-w-4xl">
          <TiltCard intensity={2} className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(212,175,55,0.1)]">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4">Let's make a deal</h2>
              <p className="text-muted-foreground">Tell us what you're looking to do, and our brokers will handle the rest.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-3">
                <Label>I want to...</Label>
                <div className="grid grid-cols-3 gap-3">
                  {["buy", "sell", "trade"].map(intent => (
                    <div 
                      key={intent}
                      onClick={() => setForm({...form, intent})}
                      className={`cursor-pointer border rounded-lg py-4 text-center transition-all duration-300 font-display text-lg uppercase tracking-wider ${
                        form.intent === intent 
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {intent}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: cleanPhone(e.target.value)})} placeholder="+968 ..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Budget / Asking Price Range</Label>
                <Select value={form.range} onValueChange={v => setForm({...form, range: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                    <SelectItem value="10k-30k">$10,000 - $30,000</SelectItem>
                    <SelectItem value="30k-60k">$30,000 - $60,000</SelectItem>
                    <SelectItem value="60k-100k">$60,000 - $100,000</SelectItem>
                    <SelectItem value="100k-plus">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {form.intent === "buy" ? "What are you looking to buy? *" : 
                   form.intent === "sell" ? "Tell us about your car (Make, Model, Year, Mileage) *" :
                   "Tell us what you have and what you want to trade for *"}
                </Label>
                <Textarea 
                  required 
                  rows={4} 
                  placeholder={form.intent === "buy" ? "e.g. Looking for a 2020+ SUV, low mileage..." : "e.g. 2018 Toyota Camry, 60k miles, excellent condition..."}
                  value={form.details} 
                  onChange={e => setForm({...form, details: e.target.value})} 
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" variant="gold" size="xl" className="flex-1 h-14 text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all" disabled={submitting}>
                  {submitting ? "Submitting..." : `Submit ${form.intent.charAt(0).toUpperCase() + form.intent.slice(1)} Request`}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="xl"
                  className="flex-1 h-14 text-lg border-green-500/50 hover:bg-green-500/10 hover:text-green-400 text-green-500 transition-colors"
                  onClick={() => window.open(`https://wa.me/96899814157?text=${encodeURIComponent(`Hello! I am looking to ${form.intent} a car.`)}`, "_blank")}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </div>
            </form>
          </TiltCard>
        </div>
      </section>

      <GuideBot
        title="Brokerage Guide"
        messages={[
          { text: "💰 Looking to buy, sell, or trade a car? You've come to the right place!", emoji: "💰" },
          { text: "We handle the whole transaction for you — inspections, negotiations, and paperwork. Zero stress.", emoji: "🛡️" },
          { text: "Scroll down to our form and select what you want to do — Buy, Sell, or Trade.", scrollToId: "brokerage-form", emoji: "📋" },
          { text: "Or chat with us instantly on WhatsApp — our brokers are online right now! 🟢", emoji: "💬" },
        ]}
      />
    </>
  );
};

export default BuySell;
