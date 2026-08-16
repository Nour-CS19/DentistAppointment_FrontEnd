import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, Shield, Heart, Smile, Stethoscope, 
  Syringe, Eye, Baby, Calendar, ArrowRight, Clock
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";

const services = [
  {
    icon: Shield,
    title: "General Dentistry",
    description: "Comprehensive oral exams, cleanings, fillings, and preventive care to maintain your oral health.",
    price: 79,
    duration: "30-60 min",
  },
  {
    icon: Sparkles,
    title: "Laser Teeth Whitening",
    description: "Professional-grade whitening treatments that deliver dramatic results in just one visit.",
    price: 199,
    duration: "60-90 min",
  },
  {
    icon: Smile,
    title: "Cosmetic Dentistry",
    description: "Porcelain veneers, cosmetic bonding, and full smile makeovers to transform your smile.",
    price: 299,
    duration: "Varies",
  },
  {
    icon: Heart,
    title: "Root Canal Therapy",
    description: "Pain-free root canal treatment using microscopic techniques and high precision equipment.",
    price: 399,
    duration: "60-90 min",
  },
  {
    icon: Stethoscope,
    title: "Dental Implants",
    description: "Permanent titanium tooth replacement solutions that look, feel, and function like natural teeth.",
    price: 1499,
    duration: "Multiple visits",
  },
  {
    icon: Syringe,
    title: "Gentle Oral Surgery",
    description: "Painless wisdom teeth extraction, bone grafting, and specialized surgical procedures.",
    price: 299,
    duration: "30-120 min",
  },
  {
    icon: Eye,
    title: "Modern Orthodontics",
    description: "Traditional ceramic braces and clear invisible aligners to perfectly align your teeth.",
    price: 2999,
    duration: "12-24 months",
  },
  {
    icon: Baby,
    title: "Pediatric Dentistry",
    description: "Gentle, compassionate dental care tailored for children in a warm, anxiety-free setting.",
    price: 49,
    duration: "30-45 min",
  },
];

const Services = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-teal-50/20 to-background dark:via-teal-950/10">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              World-Class Dental Care
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Complete Dental Services
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              We offer a comprehensive range of clinical and cosmetic dental treatments tailored for lasting oral wellness.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group hover-lift glass-card border border-white/60 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/15 via-teal-500/10 to-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">{t("labels.from")}</span>
                      <span className="text-lg font-extrabold text-foreground">{formatCurrency(service.price, i18n.language)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold bg-secondary/60 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3 text-primary" />
                      {service.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Consultation CTA Banner */}
          <div className="mt-16">
            <div className="rounded-3xl bg-gradient-to-r from-primary via-teal-700 to-accent text-white p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
                  Unsure Which Dental Treatment Suits You?
                </h2>
                <p className="text-white/85 text-sm sm:text-base mb-8 leading-relaxed">
                  Book a initial oral examination. Our specialists will conduct a thorough 3D scan and recommend a personalized plan.
                </p>
                <Link to="/book">
                  <Button size="xl" className="rounded-xl bg-white text-primary hover:bg-white/95 font-bold shadow-lg shadow-black/10">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Consultation Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;