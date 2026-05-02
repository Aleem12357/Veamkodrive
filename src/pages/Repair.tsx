import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Wrench, Search, Clock, CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { TIME_SLOTS, formatSlot } from "@/lib/scheduling";
import { PaymentSection, emptyPayment, validatePayment } from "@/components/PaymentSection";
import { SEO } from "@/components/SEO";
import { GuideBot } from "@/components/ui/GuideBot";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { cleanPhone, PHONE_REGEX, sanitizeString } from "@/lib/validation";
import repairHeroVideo from "@/assets/herosection/repair-hero.mp4";
import { getRepairImage } from "@/lib/repair-images";
import { getAssetImage } from "@/lib/assets-images";

interface RepairService {
  id: string;
  car_make: string;
  car_model: string;
  service_name: string;
  category: string;
  base_price: number;
  duration_hours: number | null;
  description: string | null;
}

const requestSchema = z.object({
  full_name: z.string().trim().min(2).max(120).transform(sanitizeString),
  phone: z.string().trim().regex(PHONE_REGEX, "Invalid phone number format"),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  car_make: z.string().trim().min(1).max(60).transform(sanitizeString),
  car_model: z.string().trim().min(1).max(60).transform(sanitizeString),
  car_year: z.coerce.number().int().min(1950).max(2100).optional(),
  issue_description: z.string().trim().min(5).max(2000).transform(sanitizeString),
});

const Repair = () => {
  const { user } = useAuth();
  const [make, setMake] = useState<string>("all");
  const [model, setModel] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("catalog");

  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", car_make: "", car_model: "",
    car_year: "", issue_description: "",
  });
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string>("");
  const [payment, setPayment] = useState(emptyPayment);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["repair_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repair_services")
        .select("id,car_make,car_model,service_name,category,base_price,duration_hours,description")
        .order("car_make");
      if (error) throw error;
      return (data ?? []) as RepairService[];
    },
  });

  const makes = useMemo(() => Array.from(new Set(services.map(s => s.car_make))).sort(), [services]);
  const models = useMemo(() => {
    const filtered = make === "all" ? services : services.filter(s => s.car_make === make);
    return Array.from(new Set(filtered.map(s => s.car_model))).sort();
  }, [services, make]);

  const filtered = services.filter(s =>
    (make === "all" || s.car_make === make) &&
    (model === "all" || s.car_model === model) &&
    (search === "" || s.service_name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
  );

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = requestSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    const payErr = validatePayment(payment);
    if (payErr) { toast.error(payErr); return; }

    setSubmitting(true);
    const { error } = await supabase.from("repair_requests").insert({
      user_id: user?.id ?? null,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      car_make: parsed.data.car_make,
      car_model: parsed.data.car_model,
      car_year: parsed.data.car_year ?? null,
      issue_description: parsed.data.issue_description,
      preferred_date: date ? format(date, "yyyy-MM-dd") : null,
      preferred_time: slot || null,
      payment_status: "unpaid",
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Request received — we'll be in touch shortly");
    setForm({ full_name: "", phone: "", email: "", car_make: "", car_model: "", car_year: "", issue_description: "" });
    setDate(undefined); setSlot(""); setPayment(emptyPayment);
    setActiveTab("catalog");
  };

  const selectService = (serviceName: string) => {
    setForm(prev => ({ ...prev, issue_description: serviceName }));
    setActiveTab("quote");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Car Repair & Service Booking | Veamkodrive"
        description="Book expert car repair and service by make and model. Genuine OEM parts, transparent pricing, on-time delivery."
        path="/repair"
        preloads={[
          { href: repairHeroVideo, as: "video" },
          { href: getAssetImage('workshop', 'page') || "", as: "image" }
        ]}
      />

      {/* HERO SECTION */}
      <section className="relative h-[75vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 z-0">
          <VideoBackground
            src={repairHeroVideo}
            fallbackSrc={getAssetImage('workshop', 'page') || ""}
            poster={getAssetImage('workshop', 'page') || ""}
            fallbackAlt="Car repair in garage"
            opacity={0.65}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/90 z-10" />
        </div>

        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Wrench className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-medium">Expert Car Repair</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl mb-6">Restored to <span className="text-gradient-gold italic">perfection.</span></h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Certified technicians, genuine parts. <span className="text-primary font-medium">Open Sat–Thu: 9am–1pm, 4pm–11pm (Friday Off)</span>. Book your service online and visit our premium workshop in Muscat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.scrollTo({top: document.getElementById('booking-tabs')?.offsetTop || 600, behavior: 'smooth'})} variant="gold" size="xl">
                Book a Repair
              </Button>
              <Button onClick={() => window.open("https://goo.gl/maps/nvoCq4RVP6XfLZtA9", "_blank")} variant="outline" size="xl" className="border-border hover:bg-secondary/50">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Find Our Workshop
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div id="booking-tabs" className="container py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-10">
          <TabsTrigger value="catalog">Browse Services</TabsTrigger>
          <TabsTrigger value="quote">Book Repair</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <div className="bg-card border border-border rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs">Make</Label>
              <Select value={make} onValueChange={(v) => { setMake(v); setModel("all"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All makes</SelectItem>
                  {makes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All models</SelectItem>
                  {models.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Search service or part</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="e.g. brake, oil, clutch" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse space-y-3">
                  <div className="h-3 bg-secondary rounded w-1/4" />
                  <div className="h-5 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                  <div className="h-8 bg-secondary rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-16">
                  No services match your filters. Try the Book Repair tab.
                </div>
              )}
              {filtered.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => selectService(s.service_name)}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/60 transition-elegant group cursor-pointer flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-primary">{s.category}</p>
                      <h3 className="font-display text-xl mt-1">{s.service_name}</h3>
                      <p className="text-sm text-muted-foreground">{s.car_make} {s.car_model}</p>
                    </div>
                    <Wrench className="h-5 w-5 text-primary/60 group-hover:text-primary transition-elegant" />
                  </div>
                  
                  {/* Service Image */}
                  <div className="relative aspect-[16/10] mb-4 rounded-md overflow-hidden bg-secondary/50 ring-1 ring-border">
                    <img 
                      src={getRepairImage(s.service_name) || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800"} 
                      alt={s.service_name}
                      className="w-full h-full object-cover transition-elegant group-hover:scale-110"
                      loading={services.indexOf(s) < 4 ? "eager" : "lazy"}
                      width={400}
                      height={250}
                    />
                  </div>
                  {s.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{s.description}</p>}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-display text-2xl text-primary">${Number(s.base_price).toFixed(0)}</p>
                    </div>
                    {s.duration_hours && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {s.duration_hours}h
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 mt-auto">
                    <Button variant="gold-outline" className="w-full h-8 text-xs">Book this Service</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quote">
          <form onSubmit={submitRequest} className="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-2xl mb-2">Book a repair appointment</h2>
            <p className="text-sm text-muted-foreground mb-4">Pick a date & time, tell us about your car, and we'll confirm shortly.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Full name *</Label><Input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Phone *</Label><Input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: cleanPhone(e.target.value) })} placeholder="+968" /></div>
            </div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Car make *</Label><Input required value={form.car_make} onChange={e => setForm({ ...form, car_make: e.target.value })} /></div>
              <div><Label>Car model *</Label><Input required value={form.car_model} onChange={e => setForm({ ...form, car_model: e.target.value })} /></div>
              <div><Label>Year</Label><Input type="number" value={form.car_year} onChange={e => setForm({ ...form, car_year: e.target.value })} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label className="mb-2">Preferred date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d.getDay() === 5 || d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Preferred time</Label>
                <Select value={slot} onValueChange={setSlot}>
                  <SelectTrigger><SelectValue placeholder="Select a slot" /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{formatSlot(t)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Describe the issue *</Label>
              <Textarea required rows={5} value={form.issue_description} onChange={e => setForm({ ...form, issue_description: e.target.value })} />
            </div>

            <PaymentSection value={payment} onChange={setPayment} />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" variant="gold" size="lg" className="flex-1" disabled={submitting}>
                {submitting ? "Sending…" : "Confirm Booking"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                className="flex-1 border-green-500/50 hover:bg-green-500/10 hover:text-green-400 text-green-500 transition-colors"
                onClick={() => window.open(`https://wa.me/96899814157?text=${encodeURIComponent("Hello! I need help with my car repair.")}`, "_blank")}
              >
                Contact on WhatsApp
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>

        <GuideBot
          title="Repair Guide"
          messages={[
            { text: "🔧 Welcome to Car Repair! Browse our services or jump straight to booking.", emoji: "🔧" },
            { text: "👆 Click any service card to instantly pre-fill it in your booking form — it's that easy!", emoji: "⚡" },
            { text: "Need to talk to someone first? Scroll down and hit the WhatsApp button for instant chat.", emoji: "💬" },
            { text: "Want to find a specific service? Use the search bar and filter by your car make or service type.", emoji: "🔍" },
          ]}
        />
      </div>
    </>
  );
};

export default Repair;
