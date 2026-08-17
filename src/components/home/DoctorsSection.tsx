import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Calendar, Star, Sparkles, CheckCircle2 } from "lucide-react";

const doctors = [
  {
    name: "Dr. Aya Hassan",
    title: "Lead Cosmetic Dentist · Cairo",
    experience: "12+ Years Experience",
    rating: "4.9 (320+ reviews)",
    specialties: ["Veneers", "Smile Makeover", "Laser Whitening"],
    image: "/images.jpg",
  },
  {
    name: "Dr. Ahmed Farouk",
    title: "Senior Implant Surgeon · Alexandria",
    experience: "10+ Years Experience",
    rating: "5.0 (450+ reviews)",
    specialties: ["Dental Implants", "Bone Grafting", "Full Mouth Reconstruction"],
    image: "/images2.jpg",
  },
  {
    name: "Dr. Mariam Fahmy",
    title: "Orthodontist Specialist · Giza",
    experience: "8+ Years Experience",
    rating: "4.9 (280+ reviews)",
    specialties: ["Invisalign Pro", "Braces", "Bite Correction"],
    image: "/images6.png",
  },
];

const DoctorsSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Egyptian Dental Team
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Meet Our Specialist Dentists
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Our Egyptian dentists provide compassionate care and modern dental expertise from clinics in Cairo, Giza, and Alexandria.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doctors.map((doc) => (
            <Card
              key={doc.name}
              className="group hover-lift bg-card/70 backdrop-blur-md border border-border/60 hover:border-primary/40 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/placeholder.svg";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                    {doc.rating}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/90 px-2.5 py-0.5 rounded-md">
                      {doc.experience}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground mb-4">{doc.title}</p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialties:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-6 pt-0">
                <Link to="/book">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 font-bold shadow-md shadow-primary/20">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
