import { Award, Heart, Users, Sparkles, Car, Wrench, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import heroImg from "@/assets/herosection/hero-showroom.jpg";
import founderImg from "@/assets/aboutUs/founder.jpg";
import usImg from "@/assets/aboutUs/Us.jpeg";
import insideViewImg from "@/assets/aboutUs/insideView.jpeg";
import ourShop from "@/assets/aboutUs/ourShop.jpeg";
import whoweareImg from "@/assets/aboutUs/whoweare.jpeg";
import workshopImg from "@/assets/aboutUs/workshop.jpeg";
import carAudiQ7 from "@/assets/cars/Audi Q7.avif";
import world1 from "@/assets/aboutUs/vemkoaboutusworld1.jpg";
import world2 from "@/assets/aboutUs/vemkoaboutusworld2.avif";
import world3 from "@/assets/aboutUs/vemkoaboutusworld3.jpg";
import world4 from "@/assets/aboutUs/vemkoaboutusworld4.jpg";
import world5 from "@/assets/aboutUs/vemkoaboutusworld5.jpg";
import { TiltCard } from "@/components/ui/TiltCard";
import { GuideBot } from "@/components/ui/GuideBot";

const stats = [
  { value: "1000+", label: "Cars Sold & Brokered" },
  { value: "10,000+", label: "Repairs Completed" },
  { value: "4.9★", label: "Customer Rating" },
  { value: "26+", label: "Years in Business" },
];

const storyImages = [
  { src: ourShop, alt: "Shop" },
  { src: insideViewImg, alt: "Showroom" },
  { src: workshopImg, alt: "Workshop" },
  { src: usImg, alt: "The Founders" },
];

const carGallery = [
  { src: whoweareImg, alt: "Our Heritage" },
  { src: world1, alt: "Veamkodrive World 1" },
  { src: carAudiQ7, alt: "Premium Fleet" },
  { src: world2, alt: "Veamkodrive World 2" },
  { src: world3, alt: "Veamkodrive World 3" },
  { src: world4, alt: "Veamkodrive World 4" },
  { src: world5, alt: "Veamkodrive World 5" },
];

const About = () => (
  <div>
    <SEO
      title="About Veamkodrive — Driven by Craft & Trust"
      description="Veamkodrive is the trusted destination for buying, selling, renting and servicing premium cars — built on craft, care and uncompromising quality."
      path="/about"
    />

    {/* HERO */}
    <section className="relative h-[65vh] min-h-[520px] flex items-end overflow-hidden bg-background pb-16">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImg} 
          alt="Veamkodrive showroom" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
          loading="eager" 
          fetchpriority="high"
          width={1920} 
          height={1088} 
        />
      </div>
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="container relative z-10 max-w-4xl animate-fade-up">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">About Veamkodrive</p>
        <h1 className="font-display text-5xl md:text-7xl mb-4">Driven by craft.</h1>
        <p className="text-lg text-muted-foreground max-w-xl">We built Veamkodrive on a simple belief — every car deserves the same care and craftsmanship, whether it's a daily driver or a weekend treasure.</p>
      </div>
    </section>

    {/* STATS */}
    <section id="mission" className="bg-secondary/20 border-b border-border py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl text-gradient-gold mb-2">{s.value}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* OUR STORY */}
    <section className="container py-24 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Where it all began.</h2>
          <div className="gold-divider w-20 mb-8" />
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            Veamkodrive was born from a simple belief: every car deserves the same craft and care, whether it's a daily driver or a Sunday treasure. We bring that conviction to every service we offer.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            From our first repair booking to brokering premium vehicles across Oman, we've always stayed true to one standard — if we wouldn't be happy with it ourselves, we won't deliver it to you.
          </p>
          <Button asChild variant="gold-outline" size="lg">
            <Link to="/services">Explore Our Services <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {storyImages.map((img, i) => (
            <TiltCard key={i} intensity={8} className={`overflow-hidden rounded-xl shadow-lg ${i === 1 ? "mt-8" : i === 3 ? "-mt-8" : ""}`}>
              <img src={img.src} alt={img.alt} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700" />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>

    {/* MISSION + PROMISE */}
    <section className="bg-gradient-navy border-y border-border py-24">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <TiltCard intensity={5} className="bg-card border border-border rounded-2xl p-10 shadow-xl">
            <ShieldCheck className="h-10 w-10 text-primary mb-6" />
            <h2 className="font-display text-3xl mb-4 text-primary">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To be the single most trusted destination for everything automotive — buying, selling, renting, repairing — held together by uncompromising quality and a deep respect for the people we serve.
            </p>
          </TiltCard>
          <TiltCard intensity={5} className="bg-card border border-border rounded-2xl p-10 shadow-xl">
            <Star className="h-10 w-10 text-primary mb-6" />
            <h2 className="font-display text-3xl mb-4 text-primary">Our Promise</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Honest pricing. Genuine parts. Certified technicians. Clear timelines. No surprises. Just the kind of service we'd want for our own cars — delivered to yours.
            </p>
          </TiltCard>
        </div>
      </div>
    </section>

    {/* PHOTO GALLERY */}
    <section className="py-24 container">
      <div className="text-center mb-16">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Gallery</p>
        <h2 className="font-display text-4xl md:text-5xl mb-4">The Veamkodrive world.</h2>
        <div className="gold-divider w-24 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {carGallery.map((img, i) => (
          <TiltCard key={i} intensity={6} className="overflow-hidden rounded-xl shadow-lg h-72">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
          </TiltCard>
        ))}
      </div>
    </section>

    {/* FOUNDER */}
    <section id="founder" className="bg-gradient-navy border-y border-border py-24">
      <div className="container max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Founder</p>
          <h2 className="font-display text-4xl md:text-5xl mb-3">The man behind the wheel.</h2>
          <div className="gold-divider w-24 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2">
            <TiltCard intensity={10} className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] aspect-[4/5] bg-secondary">
              <img
                src={founderImg}
                alt="Founder of Veamkodrive"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                <p className="font-display text-xl text-primary">Founder, Veamkodrive</p>
              </div>
            </TiltCard>
          </div>
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-display text-3xl md:text-4xl text-gradient-gold">Driven by passion. Powered by trust.</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Veamkodrive was founded with one mission — to redefine how people buy, rent, and care for their cars. From the first handshake to the final road test, every interaction is built on craftsmanship, honesty, and a love for the road.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              "Where your dream drive begins" isn't just a tagline — it's the standard we hold ourselves to, every single day.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Car, label: "500+ Cars", sub: "Sold & Brokered" },
                { icon: Wrench, label: "1,200+", sub: "Expert Repairs" },
                { icon: Users, label: "Happy Clients", sub: "Across Oman" },
              ].map(b => (
                <div key={b.label} className="text-center">
                  <b.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="font-display text-lg">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.sub}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm tracking-[0.2em] uppercase text-primary">— Founder, Veamkodrive</p>
          </div>
        </div>
      </div>
    </section>

    {/* VALUES */}
    <section id="values" className="py-24 container">
      <div className="text-center mb-16">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">Core Values</p>
        <h2 className="font-display text-4xl mb-3">What we stand for</h2>
        <div className="gold-divider w-24 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Award, title: "Quality", desc: "Premium parts and certified work, always. No shortcuts, ever.", emoji: "🏆" },
          { icon: Heart, title: "Care", desc: "We treat your car like it's our own — with real attention.", emoji: "❤️" },
          { icon: Users, title: "People", desc: "Real humans, transparent advice. We're here for you.", emoji: "🤝" },
          { icon: Sparkles, title: "Craft", desc: "Attention to every last detail in everything we do.", emoji: "✨" },
        ].map(v => (
          <TiltCard key={v.title} intensity={8} className="text-center p-8 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-[0_10px_30px_-15px_rgba(212,175,55,0.2)] transition-all duration-300">
            <div className="text-4xl mb-4">{v.emoji}</div>
            <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center mb-4 mx-auto">
              <v.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
          </TiltCard>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container py-24 text-center">
      <TiltCard intensity={3} className="bg-gradient-navy border border-border rounded-2xl p-16 max-w-3xl mx-auto shadow-2xl">
        <h2 className="font-display text-4xl mb-4">Come and meet us.</h2>
        <p className="text-muted-foreground mb-8 text-lg">We'd love to talk about your next car or your next service.</p>
        <Button asChild variant="gold" size="xl"><Link to="/contact">Get in Touch <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
      </TiltCard>
    </section>

    <GuideBot
      title="Veamko Guide"
      messages={[
        { text: "👋 Welcome! I'm your Veamkodrive guide. Click Next and I'll walk you through our story!", scrollToId: "mission", emoji: "👋" },
        { text: "We've sold 500+ cars and completed 1,200+ repairs across Oman. All built on one promise — honest, quality service.", emoji: "🚀" },
        { text: "Let me introduce you to the man who started it all. He built this company on passion, honesty, and a love for the road. 👇", scrollToId: "founder", emoji: "🏎️" },
        { text: "Quality, Care, People, Craft — these four values are the backbone of everything we do at Veamkodrive.", scrollToId: "values", emoji: "⭐" },
        { text: "Ready to experience it yourself? I'll take you to our Contact page — our team is ready to help! 🙌", navigateTo: "/contact", emoji: "💬" },
      ]}
    />
  </div>
);

export default About;
