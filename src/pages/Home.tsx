import { Link } from "react-router-dom";
import { Wrench, Car, KeyRound, Cog, ArrowRight, Shield, Award, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import heroImg from "@/assets/herosection/hero-showroom.jpg";
import homeHeroVideo from "@/assets/herosection/home-hero.mp4";
import { TiltCard } from "@/components/ui/TiltCard";
import { GuideBot } from "@/components/ui/GuideBot";
import { VideoBackground } from "@/components/ui/VideoBackground";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Veamkodrive",
    url: "https://veamko-drive-hub.lovable.app",
    image: "https://veamko-drive-hub.lovable.app/placeholder.svg",
    description: "Premium cars, rentals, expert repair and genuine car parts.",
    areaServed: "Worldwide",
    priceRange: "$$",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Veamkodrive",
    url: "https://veamko-drive-hub.lovable.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://veamko-drive-hub.lovable.app/buy-sell?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
];

const services = [
  { icon: Wrench, title: "Car Repair", desc: "Search by car model, pick a part, get expert service.", to: "/repair" },
  { icon: Car, title: "Buy & Sell Cars", desc: "Curated inventory of premium pre-owned vehicles.", to: "/buy-sell" },
  { icon: KeyRound, title: "Car Buying Consulting", desc: "Expert guidance to find your perfect vehicle match.", to: "/consulting" },
  { icon: Cog, title: "Genuine Car Parts", desc: "OEM and premium aftermarket parts in stock.", to: "/parts" },
];

const Home = () => (
  <>
    <SEO
      title="Veamkodrive — Premium Cars, Rentals, Repair & Parts"
      description="Buy & sell premium cars, rent vehicles, book expert repair and order genuine car parts — all in one trusted destination."
      path="/"
      jsonLd={homeJsonLd}
      preloads={[
        { href: homeHeroVideo, as: "video" },
        { href: heroImg, as: "image" }
      ]}
    />
    {/* HERO */}
    <section className="relative h-[88vh] min-h-[640px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-background">
        <VideoBackground
          src={homeHeroVideo}
          fallbackSrc={heroImg}
          fallbackAlt="Veamkodrive premium showroom"
          opacity={0.75}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent z-10" />
      </div>
      <div className="container relative z-20 max-w-3xl">
        <div className="flex items-center gap-2 mb-6 animate-fade-up">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm tracking-[0.2em] uppercase text-primary">Premium Automobiles</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Drive the
          <span className="block text-gradient-gold italic">extraordinary.</span>
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Buy, sell, rent, and service the cars you love — all with the meticulous craft and trust that defines Veamkodrive.
        </p>
        <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button asChild variant="gold" size="xl"><Link to="/consulting">Expert Consulting <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
          <Button asChild variant="gold-outline" size="xl"><Link to="/repair">Book a Repair</Link></Button>
        </div>
      </div>
    </section>

    {/* SERVICES */}
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Our Offerings</p>
        <h2 className="font-display text-4xl md:text-5xl mb-4">Comprehensive Solutions.</h2>
        <div className="gold-divider w-32 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <TiltCard key={s.title} intensity={10} className="h-full">
            <Link to={s.to}
              className="block h-full group relative bg-card border border-border rounded-lg p-8 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_10px_30px_-15px_rgba(212,175,55,0.2)]">
              <div className="w-14 h-14 rounded-md bg-gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-elegant">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm text-primary mt-auto">
                Explore <ArrowRight className="h-4 w-4 transition-elegant group-hover:translate-x-1" />
              </span>
            </Link>
          </TiltCard>
        ))}
      </div>
    </section>

    {/* WHY US */}
    <section className="bg-gradient-navy py-24 border-y border-border">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Why Veamkodrive</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Crafted trust, delivered daily.</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every car, every part, every service passes through the same uncompromising standard. We treat your vehicle the way we'd treat our own — and your time the way we'd treat ours.
          </p>
          <Button asChild variant="gold-outline" size="lg"><Link to="/about">Our Story</Link></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, k: "Verified", v: "Every car inspected by certified technicians." },
            { icon: Award, k: "Premium", v: "Only quality OEM and trusted aftermarket parts." },
            { icon: Clock, k: "On time", v: "Transparent timelines you can plan around." },
          ].map(b => (
            <div key={b.k} className="bg-card border border-border rounded-lg p-6">
              <b.icon className="h-6 w-6 text-primary mb-3" />
              <h4 className="font-display text-xl mb-1">{b.k}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="container py-24 text-center">
      <div className="max-w-2xl animate-fade-up mx-auto mb-12">
        <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to begin?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Whether you're searching for your next car or your next part, the Veamkodrive team is ready.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild variant="gold" size="xl"><Link to="/services">Explore Services</Link></Button>
        <Button asChild variant="gold-outline" size="xl"><Link to="/contact">Talk to Us</Link></Button>
      </div>
    </section>

    <GuideBot
      title="Welcome Guide"
      autoOpenOnceId="home-bot"
      backdrop={true}
      messages={[
        { text: "👋 Welcome to Veamkodrive — Oman's premium automotive hub! I'll help you find what you need.", emoji: "🏎️" },
        {
          text: "Which service are you looking for today?",
          emoji: "🧭",
          type: "choice",
          choices: [
            { label: "Car Repair", emoji: "🔧", navigateTo: "/repair" },
            { label: "Buy or Sell", emoji: "💰", navigateTo: "/buy-sell" },
            { label: "Rent a Car", emoji: "🚗", navigateTo: "/rent" },
            { label: "Consulting", emoji: "🧠", navigateTo: "/consulting" },
            { label: "Car Parts", emoji: "⚙️", navigateTo: "/parts" },
            { label: "About Us", emoji: "📖", navigateTo: "/about" },
          ],
        },
        { text: "Need help or can't find what you're looking for? Our team is just a click away!", emoji: "💬", type: "confirm", navigateTo: "/contact", confirmLabel: "Contact Us →" },
      ]}
    />
  </>
);

export default Home;
