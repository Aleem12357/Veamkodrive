import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { z } from "zod";
import { toast } from "sonner";
import { TiltCard } from "@/components/ui/TiltCard";
import { GuideBot } from "@/components/ui/GuideBot";
import { cleanPhone, PHONE_REGEX, sanitizeString } from "@/lib/validation";

const schema = z.object({
  name: z.string().trim().min(2).max(120).transform(sanitizeString),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(PHONE_REGEX, "Invalid phone number").optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000).transform(sanitizeString),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSending(true);
    // For v1: log + toast. Email sending can be added later via backend functions.
    await new Promise(r => setTimeout(r, 600));
    setSending(false);
    setForm({ name: "", email: "", phone: "", message: "" });
    toast.success("Thanks! We'll respond within 24 hours.");
  };

  return (
    <div className="container py-16">
      <SEO
        title="Contact Veamkodrive — We Reply Within 24 Hours"
        description="Get in touch with Veamkodrive for car sales, rentals, repair bookings or parts inquiries. We respond within 24 hours."
        path="/contact"
      />
      <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Contact</p>
        <h1 className="font-display text-5xl md:text-6xl mb-4">Let's talk.</h1>
        <div className="gold-divider w-32 mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <TiltCard intensity={8} className="bg-card border border-border rounded-lg p-6 shadow-md hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary">Call / WhatsApp</p>
                <p className="font-display text-lg">+968 9981 4157</p>
                <p className="text-xs text-muted-foreground mt-1">Sat–Thu: 9am–1pm, 4pm–11pm</p>
              </div>
            </div>
          </TiltCard>
          <TiltCard intensity={8} className="bg-card border border-border rounded-lg p-6 shadow-md hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary">Email</p>
                <p className="font-display text-lg">hello@veamkodrive.com</p>
              </div>
            </div>
          </TiltCard>
          <TiltCard intensity={8} className="bg-card border border-border rounded-lg p-6 shadow-md hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary">Visit</p>
                <a href="https://goo.gl/maps/nvoCq4RVP6XfLZtA9" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition-colors">
                  <p className="font-display text-base leading-tight mt-1">AA5 Autos خدمات للسیارات</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    Land No. 9058, Way No. 7744, Next to Candle Cafe, Mabelah Industrial road No. 9, Muscat
                  </p>
                </a>
              </div>
            </div>
          </TiltCard>
          <TiltCard intensity={8} className="bg-card border border-border rounded-lg p-6 shadow-md hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary">Hours</p>
                <p className="text-sm">Sat–Thu: 9am – 1pm, 4pm – 11pm</p>
                <p className="text-sm text-muted-foreground">Fri: closed</p>
              </div>
            </div>
          </TiltCard>
        </div>

        <TiltCard intensity={2} className="lg:col-span-3">
          <form onSubmit={submit} className="bg-card border border-border rounded-lg p-8 space-y-4 shadow-xl h-full">
            <h2 className="font-display text-2xl mb-2">Send us a message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email *</Label><Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: cleanPhone(e.target.value) })} placeholder="+968" /></div>
            <div><Label>Message *</Label><Textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={sending}>
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </TiltCard>
      </div>

      <GuideBot
        title="Contact Guide"
        messages={[
          { text: "👋 Hi there! You can reach us by phone, email, or just fill out the form on the right.", emoji: "👋" },
          { text: "Our team replies within 24 hours on email and near-instantly on WhatsApp: +968 9981 4157 📞", emoji: "📞" },
          { text: "We're based in Muscat, Oman. Feel free to drop by or send us a message!", emoji: "📍" },
        ]}
      />
    </div>
  );
};

export default Contact;
