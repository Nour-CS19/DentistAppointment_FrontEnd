import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto relative rounded-3xl bg-gradient-to-r from-primary via-teal-700 to-accent p-8 sm:p-14 text-white shadow-2xl overflow-hidden">
        {/* Background Glowing Circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Your Healthy Journey Starts Here
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Ready for Your Most Confident Smile?
          </h2>

          <p className="text-white/85 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Book your appointment online in under 60 seconds or reach out directly to our friendly care team. Same-day appointments available for emergencies!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="xl" className="w-full sm:w-auto rounded-xl bg-white text-primary hover:bg-slate-100 font-extrabold shadow-lg shadow-black/20 hover:scale-[1.02] transition-all duration-200">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Book Online Now
              </Button>
            </Link>
            <a href="tel:5551234567">
              <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-xl border-white/50 text-white bg-white/10 hover:bg-white hover:text-primary font-bold backdrop-blur-md hover:scale-[1.02] transition-all duration-200">
                <Phone className="w-5 h-5 mr-2" />
                (555) 123-4567
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;