import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Calendar as CalendarIcon, Clock, User, CreditCard, Loader2, Sparkles, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";

const services = [
  { id: "checkup", name: "Comprehensive Dental Checkup", price: 79, desc: "Includes digital 3D examination & hygiene consultation" },
  { id: "whitening", name: "Laser Teeth Whitening", price: 199, desc: "45-min clinical whitening session for instant brightness" },
  { id: "filling", name: "Composite Dental Filling", price: 149, desc: "Tooth-colored, natural looking durable restoration" },
  { id: "rootcanal", name: "Painless Root Canal Therapy", price: 399, desc: "Microscopic treatment ensuring full tooth preservation" },
  { id: "extraction", name: "Gentle Tooth Extraction", price: 199, desc: "Pain-free procedure with local anesthesia & care kit" },
  { id: "cleaning", name: "Deep Periodontal Cleaning", price: 129, desc: "Ultrasonic scaling & tartar removal for gum health" },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

type BookingStep = "service" | "datetime" | "details" | "payment";

const Book = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  
  const [step, setStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const steps = [
    { id: "service", label: "Select Service", icon: CheckCircle },
    { id: "datetime", label: "Date & Time", icon: CalendarIcon },
    { id: "details", label: "Patient Details", icon: User },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  const handleNext = () => {
    const stepOrder: BookingStep[] = ["service", "datetime", "details", "payment"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: BookingStep[] = ["service", "datetime", "details", "payment"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const handlePayment = async () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) return;

    setIsProcessing(true);

    try {
      const { data } = await api.post("/payments/create-checkout-session", {
        service: selectedServiceData.name,
        price: selectedServiceData.price,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        appointmentTime: selectedTime,
        notes,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.response?.data?.error || error.message || "Failed to process payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepComplete = (stepId: string) => {
    const stepOrder = ["service", "datetime", "details", "payment"];
    const currentIndex = stepOrder.indexOf(step);
    const checkIndex = stepOrder.indexOf(stepId);
    return checkIndex < currentIndex;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">Loading appointment manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-teal-50/20 to-background dark:via-teal-950/10">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Easy Online Booking
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              Book Your Appointment
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Reserve your slot with top-rated specialists in under 60 seconds
            </p>
          </div>

          {/* Stepper Nav */}
          <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto py-2">
            {steps.map((s, index) => {
              const active = step === s.id;
              const completed = isStepComplete(s.id);
              return (
                <div key={s.id} className="flex items-center shrink-0">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                        : completed
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary/70 text-muted-foreground"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 sm:w-10 h-0.5 mx-1 sm:mx-2 rounded-full ${completed ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card Content Container */}
          <Card className="glass-card border border-white/60 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden">
            {step === "service" && (
              <>
                <CardHeader className="border-b border-border/50 pb-5">
                  <CardTitle className="text-xl font-bold text-foreground">Step 1: Choose Your Dental Service</CardTitle>
                  <CardDescription>Select the care or procedure you require</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((service) => {
                      const isSelected = selectedService === service.id;
                      return (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                              : "border-border/60 hover:border-primary/40 bg-card/60"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-foreground text-base">{service.name}</span>
                              {isSelected && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                          </div>
                          <p className="text-primary font-extrabold text-lg">
                            {formatCurrency(service.price, i18n.language)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleNext} disabled={!selectedService} className="rounded-xl font-bold bg-primary px-8">
                      Continue to Date & Time
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "datetime" && (
              <>
                <CardHeader className="border-b border-border/50 pb-5">
                  <CardTitle className="text-xl font-bold text-foreground">Step 2: Select Date & Time Slot</CardTitle>
                  <CardDescription>Pick a convenient schedule for your visit</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-6 flex flex-col items-center">
                      <Label className="mb-3 font-bold text-sm text-foreground self-start">Preferred Calendar Date</Label>
                      <div className="bg-card p-3 rounded-2xl border border-border shadow-xs">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6">
                      <Label className="mb-3 font-bold text-sm text-foreground block">Available Time Slots</Label>
                      <div className="grid grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                                isSelected
                                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                                  : "border-border/60 hover:border-primary/40 bg-card text-foreground"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between pt-4 border-t border-border/50">
                    <Button variant="outline" onClick={handleBack} className="rounded-xl font-semibold">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleNext} disabled={!selectedDate || !selectedTime} className="rounded-xl font-bold bg-primary px-8">
                      Continue to Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "details" && (
              <>
                <CardHeader className="border-b border-border/50 pb-5">
                  <CardTitle className="text-xl font-bold text-foreground">Step 3: Patient Information</CardTitle>
                  <CardDescription>Confirm your details and optional notes</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="bg-secondary/60 rounded-2xl p-5 border border-border/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Registered Patient</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-base">{profile?.first_name} {profile?.last_name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="font-bold text-sm text-foreground mb-2 block">
                      Special Requests / Dental Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mention any symptoms, tooth sensitivity, allergies or specific preferences..."
                      rows={4}
                      className="rounded-xl border-border/80 resize-none"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-border/50">
                    <Button variant="outline" onClick={handleBack} className="rounded-xl font-semibold">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="rounded-xl font-bold bg-primary px-8">
                      Proceed to Review & Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "payment" && (
              <>
                <CardHeader className="border-b border-border/50 pb-5">
                  <CardTitle className="text-xl font-bold text-foreground">Step 4: Review & Payment</CardTitle>
                  <CardDescription>Verify booking details before securely checkout</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-secondary/50 rounded-2xl p-6 mb-6 border border-border/60">
                    <h3 className="font-extrabold text-foreground text-base mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      Appointment Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between pb-2 border-b border-border/40">
                        <span className="text-muted-foreground">Selected Care:</span>
                        <span className="font-bold text-foreground">{selectedServiceData?.name}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-border/40">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold text-foreground">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-border/40">
                        <span className="text-muted-foreground">Time Slot:</span>
                        <span className="font-semibold text-foreground">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-border/40">
                        <span className="text-muted-foreground">Patient Name:</span>
                        <span className="font-semibold text-foreground">
                          {profile?.first_name} {profile?.last_name}
                        </span>
                      </div>
                      <div className="pt-2 flex justify-between items-center text-lg">
                        <span className="font-extrabold text-foreground">Total Fee:</span>
                        <span className="font-extrabold text-2xl text-primary">{formatCurrency(selectedServiceData?.price, i18n.language)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack} disabled={isProcessing} className="rounded-xl font-semibold">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handlePayment} disabled={isProcessing} className="rounded-xl font-bold bg-gradient-to-r from-primary to-accent px-8">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirecting to Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay {formatCurrency(selectedServiceData?.price, i18n.language)} Now
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Book;