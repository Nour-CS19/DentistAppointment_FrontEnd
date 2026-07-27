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
import { CheckCircle, Calendar as CalendarIcon, Clock, User, CreditCard, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";

const services = [
  { id: "checkup", name: "Dental Checkup", price: 79 },
  { id: "whitening", name: "Teeth Whitening", price: 199 },
  { id: "filling", name: "Dental Filling", price: 149 },
  { id: "rootcanal", name: "Root Canal", price: 399 },
  { id: "extraction", name: "Tooth Extraction", price: 199 },
  { id: "cleaning", name: "Deep Cleaning", price: 129 },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
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
    { id: "service", label: "Service", icon: CheckCircle },
    { id: "datetime", label: "Date & Time", icon: CalendarIcon },
    { id: "details", label: "Details", icon: User },
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
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book Your Appointment
            </h1>
            <p className="text-muted-foreground">
              Schedule your visit in just a few simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    step === s.id
                      ? "bg-primary text-primary-foreground"
                      : isStepComplete(s.id)
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="bg-card border-border shadow-lg">
            {step === "service" && (
              <>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>Choose the dental service you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedService === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{service.name}</p>
                        <p className="text-primary font-medium">{formatCurrency(service.price, i18n.language)}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleNext} disabled={!selectedService}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "datetime" && (
              <>
                <CardHeader>
                  <CardTitle>Choose Date & Time</CardTitle>
                  <CardDescription>Select your preferred appointment slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label className="mb-3 block">Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label className="mb-3 block">Select Time</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                              selectedTime === time
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext} disabled={!selectedDate || !selectedTime}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "details" && (
              <>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>Add any notes for your appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Patient</p>
                      <p className="font-semibold">{profile?.first_name} {profile?.last_name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any specific concerns or requests..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext}>
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {step === "payment" && (
              <>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>Review your booking and complete payment</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Booking Summary */}
                  <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">{selectedServiceData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Patient:</span>
                        <span className="font-medium">
                          {profile?.first_name} {profile?.last_name}
                        </span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between text-base">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-primary">{formatCurrency(selectedServiceData?.price, i18n.language)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
                      Back
                    </Button>
                    <Button onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          {t("labels.price")} {formatCurrency(selectedServiceData?.price, i18n.language)}
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