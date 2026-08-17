import { useState } from "react";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Mona Abdelrahman",
    role: "Cosmetic Patient",
    rating: 5,
    treatment: "Laser Whitening & Veneers",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    quote: "The result was completely transformative! I used to hide my smile in photographs. Dr. Aya and her team made the laser whitening process completely painless and swift. I couldn't be happier!",
  },
  {
    id: 2,
    name: "Omar El-Hadary",
    role: "Regular Care Patient",
    rating: 5,
    treatment: "Painless Root Canal & Crown",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    quote: "I was extremely anxious about getting a root canal after a bad past experience. DentCare redefined dental visits for me. Zero pain during and after the procedure. Incredible 3D technology!",
  },
  {
    id: 3,
    name: "Nour Khaled",
    role: "Orthodontics Patient",
    rating: 5,
    treatment: "Clear Aligners Therapy",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    quote: "Top-tier clinic with an incredibly warm, professional staff. My clear aligner treatment finished 2 months ahead of schedule with perfect alignment. Highly recommended!",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-teal-50/15 to-background dark:via-teal-950/20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            Patient Smiles & Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Trusted by Thousands of Happy Smiles
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Read real feedback from patients who experienced our painless care, cutting-edge technology, and warm atmosphere.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card p-8 sm:p-12 rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden">
            {/* Background Quote Mark */}
            <Quote className="absolute -top-4 -right-4 w-40 h-40 text-primary/5 rotate-12 pointer-events-none" />

            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/30 mb-4 group">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/placeholder.svg";
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h4 className="font-bold text-foreground text-lg">{testimonials[currentIndex].name}</h4>
                <p className="text-xs text-muted-foreground font-medium">{testimonials[currentIndex].role}</p>

                <div className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Patient
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                    ))}
                  </div>

                  <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-primary mb-3 bg-primary/10 px-3 py-1 rounded-md">
                    {testimonials[currentIndex].treatment}
                  </span>

                  <p className="text-base sm:text-lg text-foreground/90 italic leading-relaxed mb-6 font-medium">
                    "{testimonials[currentIndex].quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex gap-1.5">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full w-9 h-9 border-border/80 hover:bg-secondary"
                      onClick={prevTestimonial}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full w-9 h-9 border-border/80 hover:bg-secondary"
                      onClick={nextTestimonial}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
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

export default TestimonialsSection;
