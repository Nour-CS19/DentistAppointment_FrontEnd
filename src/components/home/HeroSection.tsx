import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Star, ShieldCheck, Sparkles, Clock, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-background via-teal-50/20 to-background dark:via-teal-950/10">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/15 via-teal-400/10 to-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-12 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/10 to-accent/10 border border-teal-500/20 px-4 py-2 rounded-full mb-6 shadow-xs">
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Top Rated Dental Clinic • 2,000+ Happy Smiles
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] tracking-tight mb-6">
              Precision Care for Your <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary via-teal-600 to-accent bg-clip-text text-transparent">
                Perfect, Healthy Smile
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Experience gentle, state-of-the-art dentistry. From routine checkups to 
              advanced cosmetic procedures, our expert team ensures complete comfort and brilliant results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/book">
                <Button size="xl" className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-lg shadow-primary/25 font-bold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment Now
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="w-full sm:w-auto rounded-xl border-border/80 bg-background/60 hover:bg-secondary font-semibold">
                  Explore Services
                  <ArrowRight className="w-5 h-5 ml-2 text-primary" />
                </Button>
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="flex flex-wrap gap-y-2 gap-x-6 mb-10 text-xs sm:text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Zero Wait Times</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Certified Specialists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Painless Technology</span>
              </div>
            </div>

            {/* Stats Metrics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-border/60">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "10K+", label: "Happy Patients" },
                { value: "99.8%", label: "Satisfaction Rate" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card/40 backdrop-blur-xs p-3 rounded-2xl border border-border/40 hover:border-primary/30 transition-colors">
                  <p className="text-2xl sm:text-3xl font-extrabold text-primary">{stat.value}</p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual Right */}
          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-60" />
              
              {/* Main Visual Card */}
              <div className="relative glass-card p-6 rounded-3xl shadow-xl border border-white/60 dark:border-white/10 overflow-hidden">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-teal-500/10 to-accent/10 flex items-center justify-center p-8 text-center">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 mb-4 animate-float">
                      <span className="text-4xl">🦷</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      Advanced Dental Center
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Laser dentistry, painless extractions & digital smile designing
                    </p>
                  </div>
                </div>

                {/* Floating Status Badge 1 */}
                <div className="mt-4 bg-background/80 backdrop-blur-md p-3.5 rounded-2xl border border-border/60 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Next Available Slot</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Today • 02:30 PM</p>
                    </div>
                  </div>
                  <Link to="/book">
                    <Button size="sm" variant="secondary" className="text-xs font-bold rounded-lg hover:bg-primary hover:text-white">
                      Reserve
                    </Button>
                  </Link>
                </div>

                {/* Floating Badge 2 */}
                <div className="mt-3 bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-xl border border-primary/20 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-xs font-medium text-foreground">
                    Strict ISO-Sterilization & Safety Protocols
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;