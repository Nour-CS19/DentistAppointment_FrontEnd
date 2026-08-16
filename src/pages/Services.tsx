import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, Shield, Heart, Smile, Stethoscope, 
  Syringe, Eye, Baby, Calendar 
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
    title: "Teeth Whitening",
    description: "Professional-grade whitening treatments that deliver dramatic results in just one visit.",
    price: 199,
    duration: "60-90 min",
  },
  {
    icon: Smile,
    title: "Cosmetic Dentistry",
    description: "Veneers, bonding, and smile makeovers to transform your appearance.",
    price: 299,
    duration: "Varies",
  },
  {
    icon: Heart,
    title: "Root Canal Therapy",
    description: "Pain-free root canal treatment using the latest techniques and technology.",
    price: 399,
    duration: "60-90 min",
  },
  {
    icon: Stethoscope,
    title: "Dental Implants",
    description: "Permanent tooth replacement solutions that look and feel like natural teeth.",
    price: 1499,
    duration: "Multiple visits",
  },
  {
    icon: Syringe,
    title: "Oral Surgery",
    description: "Wisdom teeth extraction, bone grafting, and other surgical procedures.",
    price: 299,
    duration: "30-120 min",
  },
  {
    icon: Eye,
    title: "Orthodontics",
    description: "Traditional braces and clear aligners to straighten your teeth.",
    price: 2999,
    duration: "12-24 months",
  },
  {
    icon: Baby,
    title: "Pediatric Dentistry",
    description: "Gentle, kid-friendly dental care in a fun and welcoming environment.",
    price: 49,
    duration: "30-45 min",
  },
];

const Services = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Complete Dental Care
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of dental services to meet all your oral health needs, 
              from routine checkups to complex procedures.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-semibold">{t("labels.from")} {formatCurrency(service.price, i18n.language)}</span>
                    <span className="text-muted-foreground">{service.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Card className="bg-gradient-hero border-0 text-primary-foreground p-8 md:p-12">
              <CardContent className="p-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Not Sure What You Need?
                </h2>
                <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                  Schedule a consultation with our team. We'll assess your needs and create a 
                  personalized treatment plan just for you.
                </p>
                <Link to="/book">
                  <Button variant="hero" size="xl">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;