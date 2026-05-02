import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Compass, ShieldCheck, CheckCircle2, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { TiltCard } from "@/components/ui/TiltCard";
import { supabase } from "@/integrations/supabase/client";
import { GuideBot } from "@/components/ui/GuideBot";
import { VideoBackground } from "@/components/ui/VideoBackground";
import consultingHeroVideo from "@/assets/herosection/consulting-hero.mp4";
import { useAuth } from "@/contexts/AuthContext";
import { cleanPhone, validatePhone, sanitizeString } from "@/lib/validation";

const Consulting = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    preferences: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) { toast.error("Please enter a valid phone number"); return; }
    if (form.name.trim().length < 2) { toast.error("Please enter your full name"); return; }
    
    setSubmitting(true);
    
    const { error } = await supabase.from("consulting_requests").insert({
      user_id: user?.id,
      name: sanitizeString(form.name),
      phone: form.phone,
      budget: form.budget,
      preferences: sanitizeString(`Email: ${form.email || "N/A"}\n\n${form.preferences}`)
    });

    setSubmitting(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Consulting request sent! Our experts will contact you soon.");
    setForm({ name: "", phone: "", email: "", budget: "", preferences: "" });
  };

  return (
    <>
      <SEO
        title="Car Buying Consulting | Expert Advice | Veamkodrive"
        description="Not sure which car to buy? Our specialized car consulting experts will guide you to the perfect vehicle based on your lifestyle, budget, and needs."
        path="/consulting"
      />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <VideoBackground
            src={consultingHeroVideo}
            fallbackSrc="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop"
            fallbackAlt="Consulting Expert"
            opacity={0.65}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/90 z-10" />
        </div>

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-up">
              <Compass className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-medium">Expert Guidance</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Want to buy a car but <span className="text-gradient-gold italic">don't know which to pick?</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Skip the endless research and dealership pressure. Our automotive experts analyze your lifestyle, budget, and driving habits to find your perfect match.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button 
                variant="gold" 
                size="xl" 
                onClick={() => document.getElementById('consulting-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get a Consultation
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-green-500/50 hover:bg-green-500/10 hover:text-green-400 text-green-500 transition-colors"
                onClick={() => window.open(`https://wa.me/96899814157?text=${encodeURIComponent("Hello! I need expert advice on buying a car.")}`, "_blank")}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-secondary/30 border-y border-border">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl mb-4">How our consulting works</h2>
            <div className="gold-divider w-24 mx-auto mb-6" />
            <p className="text-muted-foreground">A seamless, personalized experience designed entirely around you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "1. The Analysis", desc: "We discuss your daily commute, family size, performance desires, and exact budget." },
              { icon: ShieldCheck, title: "2. The Selection", desc: "We scan the market and provide 3-5 perfectly vetted options that meet your exact criteria." },
              { icon: CheckCircle2, title: "3. The Acquisition", desc: "Once you choose, we handle the inspections, negotiations, and paperwork on your behalf." },
            ].map((step, i) => (
              <TiltCard key={i} intensity={10} className="bg-card border border-border p-8 rounded-xl h-full shadow-lg">
                <div className="h-12 w-12 rounded-lg bg-gradient-gold flex items-center justify-center mb-6">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC SHOWCASE */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <h2 className="font-display text-4xl md:text-5xl">We know cars. <br/>You know what you want.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Finding the perfect vehicle isn't just about reading specs—it's about understanding the feeling behind the wheel, the long-term reliability, and the true market value. Our consultants have sourced hundreds of premium vehicles.
              </p>
              <ul className="space-y-3 pt-4">
                {[
                  "Unbiased, brand-agnostic advice",
                  "Deep dive into performance & reliability metrics",
                  "Exclusive access to off-market inventory",
                  "Negotiation power that saves you thousands"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative h-[600px] w-full hidden md:block">
              <TiltCard intensity={15} className="absolute top-0 right-0 w-[80%] h-[70%] rounded-2xl overflow-hidden shadow-2xl z-10 border-4 border-background">
                <img src="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop" alt="Premium luxury car interior" className="w-full h-full object-cover" />
              </TiltCard>
              <TiltCard intensity={20} className="absolute bottom-0 left-0 w-[70%] h-[60%] rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-background">
                <img src="https://images.unsplash.com/photo-1503376712341-b040a4242cb6?q=80&w=2070&auto=format&fit=crop" alt="Sportscar tracking" className="w-full h-full object-cover" />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section id="consulting-form" className="py-24 relative overflow-hidden bg-secondary/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="container max-w-4xl">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl mb-4">Tell us what you're looking for</h2>
              <p className="text-muted-foreground">Fill out the form below and one of our specialists will reach out to you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label>Email Address</Label>
                <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
              </div>

              <div className="space-y-2">
                <Label>Estimated Budget</Label>
                <Select value={form.budget} onValueChange={v => setForm({...form, budget: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                    <SelectItem value="15k-30k">$15,000 - $30,000</SelectItem>
                    <SelectItem value="30k-60k">$30,000 - $60,000</SelectItem>
                    <SelectItem value="60k-plus">$60,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Your Preferences & Needs *</Label>
                <Textarea 
                  required 
                  rows={4} 
                  placeholder="e.g. I need a fuel-efficient SUV for a family of 4, mostly city driving, prefer Japanese brands..."
                  value={form.preferences} 
                  onChange={e => setForm({...form, preferences: e.target.value})} 
                />
              </div>

              <Button type="submit" variant="gold" size="xl" className="w-full h-14 text-lg" disabled={submitting}>
                {submitting ? "Sending Request..." : "Request Consultation"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <GuideBot
        title="Consulting Guide"
        messages={[
          { text: "🚗 Not sure which car to buy? You've come to the right place! Our experts are here to help.", emoji: "🚗" },
          { text: "Here's how it works: we analyze your needs, shortlist the best options, and handle the whole acquisition for you.", scrollToId: "consulting-form", emoji: "📋" },
          { text: "Fill out the form below with your budget and preferences — our experts will get back to you within 24 hours!", scrollToId: "consulting-form", emoji: "📝" },
          { text: "Or prefer to talk directly? Hit the WhatsApp button to chat with us instantly! 💬", emoji: "💬" },
        ]}
      />
    </>
  );
};

export default Consulting;
