import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Award, Heart, Users, Target, Calendar } from "lucide-react";

const team = [
  {
    name: "Dr. Mahmoud El-Sayed",
    role: "Lead Dentist",
    specialty: "Cosmetic Dentistry",
    experience: "15 years",
  },
  {
    name: "Dr. Aya Hassan",
    role: "Senior Dentist",
    specialty: "Orthodontics",
    experience: "12 years",
  },
  {
    name: "Dr. Ahmed Farouk",
    role: "Dental Surgeon",
    specialty: "Oral Surgery",
    experience: "10 years",
  },
  {
    name: "Dr. Mariam Fahmy",
    role: "Pediatric Specialist",
    specialty: "Pediatric Dentistry",
    experience: "8 years",
  },
];

const values = [
  {
    icon: Heart,
    title: "Patient First",
    description: "Every decision we make puts our patients' comfort and health at the forefront.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every procedure, using the latest techniques and technology.",
  },
  {
    icon: Users,
    title: "Compassion",
    description: "We treat every patient with kindness, understanding, and respect.",
  },
  {
    icon: Target,
    title: "Innovation",
    description: "We continuously invest in advanced technology for better outcomes.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                Caring for Your Smile Since 2009
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                DentCare was founded with a simple mission: to provide exceptional dental care 
                in a warm, welcoming environment. Over the years, we've grown from a small 
                practice to a trusted dental care provider serving thousands of patients.
              </p>
              <p className="text-muted-foreground mb-8">
                Our team of experienced professionals is committed to using the latest technology 
                and techniques to ensure you receive the best possible care. We believe that 
                everyone deserves a healthy, beautiful smile.
              </p>
              <Link to="/book">
                <Button size="lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Visit
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-hero rounded-3xl p-8 text-primary-foreground">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "15+", label: "Years of Experience" },
                    { value: "10K+", label: "Happy Patients" },
                    { value: "25+", label: "Expert Dentists" },
                    { value: "50+", label: "Awards Won" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-primary-foreground/10 rounded-xl">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-primary-foreground/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                What We Stand For
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="bg-card border-border text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Meet Our Experts
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team of highly skilled dental professionals is dedicated to providing 
                you with the best possible care.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="bg-card border-border overflow-hidden group">
                  <div className="aspect-square bg-secondary flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center">
                      <span className="text-3xl text-primary-foreground font-bold">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                    <p className="text-muted-foreground text-sm mt-2">{member.specialty}</p>
                    <p className="text-muted-foreground text-xs mt-1">{member.experience} experience</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;