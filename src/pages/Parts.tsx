import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingBag, Cog, ShieldCheck, Wrench } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { SEO } from "@/components/SEO";
import { TiltCard } from "@/components/ui/TiltCard";
import { GuideBot } from "@/components/ui/GuideBot";
import { VideoBackground } from "@/components/ui/VideoBackground";
import partsHeroVideo from "@/assets/herosection/parts-hero.mp4";
import { getRepairImage } from "@/lib/repair-images";
import { getAssetImage } from "@/lib/assets-images";

interface Part {
  id: string; name: string; brand: string | null; category: string;
  compatible_cars: string[] | null; price: number; stock: number;
  description: string | null; image_url: string | null;
}

const Parts = () => {
  const { addItem } = useCart();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ["car_parts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_parts")
        .select("id,name,brand,category,compatible_cars,price,stock,description,image_url")
        .order("name");
      if (error) throw error;
      return (data ?? []) as Part[];
    },
  });

  const categories = useMemo(() => Array.from(new Set(parts.map(p => p.category))).sort(), [parts]);

  const visible = parts.filter(p =>
    (category === "all" || p.category === category) &&
    (search === "" || `${p.name} ${p.brand ?? ""} ${(p.compatible_cars ?? []).join(" ")}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <SEO
        title="Genuine Car Parts — OEM & Aftermarket | Veamkodrive"
        description="Shop genuine OEM and trusted aftermarket car parts. Filter by make, model and category. Free fitting on select parts."
        path="/parts"
        preloads={[
          { href: partsHeroVideo, as: "video" },
          { href: getAssetImage('carParts', 'part') || "", as: "image" }
        ]}
      />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 z-0">
          <VideoBackground
            src={partsHeroVideo}
            fallbackSrc={getAssetImage('carParts', 'part') || ""}
            poster={getAssetImage('carParts', 'part') || ""}
            fallbackAlt="Car engine bay"
            opacity={0.65}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background/90 z-10" />
        </div>

        <div className="container relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                <Cog className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">OEM & Aftermarket</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
                Precision parts. <br/><span className="text-gradient-gold italic">Premium performance.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Keep your vehicle running at its absolute best. We source only genuine OEM and top-tier aftermarket components, trusted by our own certified technicians.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="gold" 
                  size="xl" 
                  onClick={() => document.getElementById('parts-catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Search className="h-5 w-5 mr-2" /> Search Inventory
                </Button>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <TiltCard intensity={5} className="bg-card border border-border p-6 rounded-xl shadow-lg">
                <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display text-lg mb-2">Verified Authenticity</h3>
                <p className="text-sm text-muted-foreground">No counterfeits. Every part is sourced directly from manufacturers.</p>
              </TiltCard>
              <TiltCard intensity={5} className="bg-card border border-border p-6 rounded-xl shadow-lg mt-8">
                <Wrench className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display text-lg mb-2">Expert Fitting</h3>
                <p className="text-sm text-muted-foreground">Book an installation appointment directly with our service center.</p>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      <section id="parts-catalog" className="py-24 bg-background">
        <div className="container">
          <div className="bg-card border border-border rounded-xl p-8 mb-12 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Label className="text-sm mb-2 block">Search by name, brand or compatible car</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10 h-12 text-md" placeholder="e.g. brake pads, Bosch, BMW..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="text-sm mb-2 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 text-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-secondary" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-secondary rounded w-1/4" />
                    <div className="h-5 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {visible.map(p => (
                <TiltCard key={p.id} intensity={10} className="h-full">
                  <article className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/60 transition-elegant hover:shadow-[0_10px_30px_-15px_rgba(212,175,55,0.2)] h-full flex flex-col">
                    <div className="aspect-square overflow-hidden bg-secondary/50 relative ring-1 ring-border">
                      <img 
                        src={getRepairImage(p.name) || p.image_url || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800"} 
                        alt={p.name} 
                        loading="lazy" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-elegant duration-700" 
                        width={300}
                        height={300}
                      />
                      {p.brand && (
                        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-foreground">
                          {p.brand}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs uppercase tracking-wider text-primary">{p.category}</p>
                      <h3 className="font-display text-xl mt-2 leading-tight">{p.name}</h3>
                      
                      <div className="flex items-end justify-between pt-6 mt-auto border-t border-border">
                        <div>
                          <p className="font-display text-2xl text-primary">${Number(p.price).toFixed(2)}</p>
                          <p className={`text-xs mt-1 ${p.stock > 0 ? "text-muted-foreground" : "text-destructive"}`}>
                            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                          </p>
                        </div>
                        <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={p.stock === 0} onClick={() => addItem({
                          item_type: "part", item_id: p.id, name: p.name,
                          image_url: getRepairImage(p.name) || p.image_url, unit_price: Number(p.price),
                        })}>
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              ))}
              {visible.length === 0 && (
                <div className="col-span-full text-center py-24">
                  <Cog className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-display text-2xl mb-2">No parts found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <GuideBot
        title="Parts Guide"
        messages={[
          { text: "⚙️ Welcome to our Parts store! We carry only genuine OEM and verified aftermarket parts.", emoji: "⚙️" },
          { text: "Use the search bar to find parts by name, brand, or compatible car model.", scrollToId: "parts-catalog", emoji: "🔍" },
          { text: "Click the 🛍️ button on any part to add it to your cart and checkout later.", emoji: "🛒" },
          { text: "Need a part fitted by a technician? Go to our Repair page and book an appointment!", navigateTo: "/repair", emoji: "🔧" },
        ]}
      />
    </>
  );
};

export default Parts;
