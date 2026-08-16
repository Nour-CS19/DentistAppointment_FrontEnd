import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Heart, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";

const services = [
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    description: "Professional whitening treatments for a brighter, more confident smile.",
    price: 199,
  },
  {
    icon: Shield,
    title: "Dental Checkup",
    description: "Comprehensive oral examination and professional cleaning.",
    price: 79,
  },
  {
    icon: Heart,
    title: "Root Canal",
    description: "Pain-free root canal therapy with advanced techniques.",
    price: 399,
  },
  {
    icon: Smile,
    title: "Cosmetic Dentistry",
    description: "Transform your smile with veneers, bonding, and more.",
    price: 299,
  },
];

const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Comprehensive Dental Care
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From routine checkups to advanced procedures, we offer a full range of dental services 
            to keep your smile healthy and beautiful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <p className="text-primary font-semibold text-sm">
                  {t("labels.from")} {formatCurrency(service.price, i18n.language)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;