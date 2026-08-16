import { CheckCircle, Award, Users, Clock } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Expert Team",
    description: "Board-certified dentists with years of specialized training.",
  },
  {
    icon: CheckCircle,
    title: "Latest Technology",
    description: "State-of-the-art equipment for precise, comfortable treatment.",
  },
  {
    icon: Users,
    title: "Patient-Centered",
    description: "Personalized care plans tailored to your unique needs.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Evening and weekend appointments to fit your schedule.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              A Dental Experience You'll Actually Enjoy
            </h2>
            <p className="text-muted-foreground mb-8">
              We believe going to the dentist should be a positive experience. That's why we've 
              created a warm, welcoming environment where you can relax while receiving 
              top-quality care.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-hero rounded-3xl p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">
                Schedule Your Visit Today
              </h3>
              <p className="text-primary-foreground/80 mb-6">
                New patients receive a complimentary consultation and X-rays with their first visit.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary-foreground/20 border-2 border-primary flex items-center justify-center text-sm font-medium"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-primary-foreground/80">
                  Join 10,000+ happy patients
                </p>
              </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-secondary rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;