import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const { data } = await api.post("/payments/verify", { sessionId });

      if (data.success) {
        // The verify endpoint only confirms payment status; fetch the appointment
        // itself (matched by stripeSessionId) to show its details below.
        const { data: appointments } = await api.get("/appointments");
        const match = appointments.find((a: any) => a.stripeSessionId === sessionId);
        if (match) {
          setAppointmentData({
            service: match.service,
            appointment_date: match.appointmentDate,
            appointment_time: match.appointmentTime,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full bg-card border-border shadow-lg">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your appointment has been confirmed. We've sent a confirmation email with all the details.
            </p>

            {appointmentData && (
              <div className="bg-secondary/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{appointmentData.service}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{appointmentData.appointment_date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{appointmentData.appointment_time}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link to="/dashboard">
                <Button className="w-full">View My Appointments</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">Return to Home</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;