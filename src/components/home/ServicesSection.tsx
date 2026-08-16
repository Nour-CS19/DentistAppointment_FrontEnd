import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Heart, Smile, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";

const services = [
  {
    icon: Sparkles,
    title: "Laser Teeth Whitening",
    description: "Professional whitening treatments for a brighter, radiant smile in 45 minutes.",
    price: 199,
    popular: true,
  },
  {
    icon: Shield,
    title: "Comprehensive Checkup",
    description: "Digital X-rays, 3D oral scanning, thorough hygiene & professional cleaning.",
    price: 79,
    popular: false,
  },
  {
    icon: Heart,
    title: "Painless Root Canal",
    description: "Microscopic root canal therapy ensuring total pain relief and tooth preservation.",
    price: 399,
    popular: false,
  },
  {
    icon: Smile,
    title: "Cosmetic Veneers",
    description: "Custom porcelain veneers and smile makeover designing by top specialists.",
    price: 299,
    popular: false,
  },
];

const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/40 to-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Specialized Care
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Comprehensive Dental Solutions
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            From preventive hygiene care to complete aesthetic transformations, our clinic delivers state-of-the-art procedures tailored for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              className={`relative group hover-lift bg-card/80 backdrop-blur-sm border transition-all duration-300 rounded-3xl overflow-hidden ${
                service.popular ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/60 hover:border-primary/30"
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Popular
                </div>
              )}

              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/15 via-teal-500/10 to-accent/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">{t("labels.from")}</span>
                    <span className="text-xl font-extrabold text-foreground">
                      {formatCurrency(service.price, i18n.language)}
                    </span>
                  </div>
                  <Link to="/book">
                    <Button size="sm" variant="ghost" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" size="lg" className="rounded-xl font-semibold border-border/80 hover:bg-secondary">
              Explore All Dental Services
              <ArrowRight className="w-4 h-4 ml-2 text-primary" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;