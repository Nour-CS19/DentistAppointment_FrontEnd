import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              <span className="text-sm font-medium text-secondary-foreground">
                Rated 5.0 by 2,000+ patients
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your Smile,
              <br />
              <span className="text-primary">Our Priority</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience exceptional dental care with our team of expert professionals. 
              Modern technology meets compassionate service for your perfect smile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="xl" className="w-full sm:w-auto">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  View Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "10K+", label: "Happy Patients" },
                { value: "25+", label: "Expert Dentists" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20" />
              <div className="absolute inset-4 bg-card rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-card" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-hero flex items-center justify-center">
                      <span className="text-5xl">🦷</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Modern Dental Care
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      State-of-the-art equipment & techniques
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Next Available</p>
                    <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
                  </div>
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