import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready for Your Best Smile Yet?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Book your appointment today and take the first step towards a healthier, 
            more confident smile. New patients welcome!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <Calendar className="w-5 h-5 mr-2" />
                Book Online
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              <Phone className="w-5 h-5 mr-2" />
              (555) 123-4567
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;