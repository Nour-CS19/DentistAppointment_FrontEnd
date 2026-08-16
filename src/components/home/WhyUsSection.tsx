import { CheckCircle, Award, Users, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Award,
    title: "Board-Certified Specialists",
    description: "Multi-specialty team of dentists committed to continuous medical excellence.",
  },
  {
    icon: CheckCircle,
    title: "Cutting-Edge Technology",
    description: "Low-radiation 3D X-rays, laser treatments, and digital impressions.",
  },
  {
    icon: Users,
    title: "Patient-Centered Comfort",
    description: "Sleek, peaceful clinical environments tailored to eliminate dental anxiety.",
  },
  {
    icon: Clock,
    title: "Flexible Emergency Hours",
    description: "Same-day urgent appointments, evening options, and weekend availability.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content Left */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Why Choose DentCare
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-6">
              A Dental Experience Designed Around Your Total Comfort
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              We combine world-class dental expertise with compassionate care. Experience seamless appointments, transparent pricing, and gentle treatments designed for lasting health.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 transition-colors flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-primary/20">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Banner Right */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-primary via-teal-700 to-accent text-white shadow-2xl overflow-hidden">
              {/* Soft background shape */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                First Visit Offer
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">
                Schedule Your Complimentary Consultation
              </h3>
              <p className="text-white/85 text-sm mb-8 leading-relaxed">
                New patients receive a complete digital oral screening and diagnostic examination during their first appointment.
              </p>

              <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {["👩‍⚕️", "👨‍⚕️", "👩", "👨"].map((emoji, idx) => (
                      <div
                        key={idx}
                        className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white flex items-center justify-center text-xs shadow-xs"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Join 10,000+</p>
                    <p className="text-[10px] text-white/70">Satisfied patients</p>
                  </div>
                </div>

                <Link to="/book">
                  <Button size="sm" className="bg-white text-primary font-bold hover:bg-white/90 rounded-xl">
                    Claim Offer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;