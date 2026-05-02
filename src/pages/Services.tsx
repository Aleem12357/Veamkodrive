import { Link } from "react-router-dom";
import { Wrench, Car, KeyRound, Cog, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { TiltCard } from "@/components/ui/TiltCard";
import { GuideBot } from "@/components/ui/GuideBot";
import { getAssetImage } from "@/lib/assets-images";

const items = [
  { icon: Wrench, title: "Car Repair", to: "/repair", image: "workshop",
    desc: "Search by your car make and model, pick the service or part you need, and book in minutes. Or request a custom quote for complex jobs.",
    points: ["Brakes, engine, suspension & more", "Genuine OEM parts", "Transparent pricing"] },
  { icon: Car, title: "Buy & Sell Cars", to: "/buy-sell", image: "transact1",
    desc: "Browse our curated inventory of inspected pre-owned vehicles, or list your car for a hassle-free sale.",
    points: ["Multi-point inspection", "Verified history", "Fair market pricing"] },
  { icon: Compass, title: "Car Buying Consulting", to: "/consulting", image: "consulting-hero",
    desc: "Expert guidance to find your perfect vehicle match, without the dealership pressure.",
    points: ["Unbiased, brand-agnostic advice", "Performance & reliability metrics", "Negotiation power"] },
  { icon: KeyRound, title: "Rent a Car", to: "/rent", image: "rentCar",
    desc: "From compact city cars to executive sedans and 7-seater SUVs — rent by the day or the week.",
    points: ["Insurance included", "24/7 roadside support", "Free cancellation 48h"] },
  { icon: Cog, title: "Car Parts", to: "/parts", image: "carParts",
    desc: "Genuine OEM and trusted aftermarket parts for every major brand. Filter by your car make and model.",
    points: ["Brakes, filters, ignition", "Suspension & transmission", "Free fitting on select parts"] },
];

const Services = () => (
  <div className="container py-20">
    <SEO
      title="Our Services — Car Repair, Sales, Rental & Parts | Veamkodrive"
      description="Explore Veamkodrive's services: expert car repair, curated buy & sell, premium rentals and genuine OEM car parts — all in one place."
      path="/services"
      preloads={[
        { href: getAssetImage('workshop', 'page') || "", as: "image" },
        { href: getAssetImage('transact1', 'car') || "", as: "image" }
      ]}
    />
    <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
      <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Services</p>
      <h1 className="font-display text-5xl md:text-6xl mb-4">What we do, beautifully.</h1>
      <div className="gold-divider w-32 mx-auto mb-6" />
      <p className="text-muted-foreground leading-relaxed">
        Every Veamkodrive service is built on the same principle — premium quality, premium care.
      </p>
    </div>

    <div className="space-y-8">
      {items.map((s, idx) => (
        <TiltCard key={s.title} intensity={3}>
          <div className={`bg-card border border-border rounded-xl shadow-xl overflow-hidden grid md:grid-cols-3 gap-0 ${idx % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="bg-gradient-navy p-8 md:p-12 flex flex-col justify-center">
              <s.icon className="h-10 w-10 text-primary mb-4" />
              <h2 className="font-display text-2xl md:text-3xl mb-3">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
            <div className="relative overflow-hidden bg-secondary/40 min-h-[240px] aspect-[16/10] md:aspect-auto">
              <img 
                src={getAssetImage(s.image, s.title === "Car Parts" ? "part" : s.title === "Car Repair" || s.title === "Car Buying Consulting" ? "page" : "car") || ""} 
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover transition-elegant group-hover:scale-110"
                loading={idx < 2 ? "eager" : "lazy"}
                fetchpriority={idx < 2 ? "high" : "auto"}
                width={800}
                height={500}
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center bg-secondary/10">
              <ul className="space-y-3 mb-6">
                {s.points.map(p => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="gold" size="md" className="self-start">
                <Link to={s.to}>Explore {s.title} <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </TiltCard>
      ))}
    </div>

    <GuideBot
      title="Services Guide"
      messages={[
        { text: "👇 Here are all of Veamkodrive's services. Pick one that interests you!", emoji: "✨",
          type: "choice",
          choices: [
            { label: "Car Repair", emoji: "🔧", navigateTo: "/repair" },
            { label: "Buy & Sell", emoji: "💰", navigateTo: "/buy-sell" },
            { label: "Consulting", emoji: "🧠", navigateTo: "/consulting" },
            { label: "Rent a Car", emoji: "🚗", navigateTo: "/rent" },
            { label: "Car Parts", emoji: "⚙️", navigateTo: "/parts" },
          ],
        },
        { text: "Still not sure? Contact our team and we'll point you in the right direction!", emoji: "💬", type: "confirm", navigateTo: "/contact", confirmLabel: "Talk to Us" },
      ]}
    />
  </div>
);

export default Services;
