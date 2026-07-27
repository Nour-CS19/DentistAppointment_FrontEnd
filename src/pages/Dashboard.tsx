import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";
import { 
  Calendar, Clock, Plus, Edit2, Trash2, Eye, 
  CheckCircle, AlertCircle, XCircle, DollarSign, ArrowLeft
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Appointment {
  id: string;
  service: string;
  price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  
  const [activeView, setActiveView] = useState<"list" | "detail" | "edit">("list");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form state for edit
  const [formData, setFormData] = useState({
    service: "",
    price: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();

      // No realtime channel on the ASP.NET backend — poll instead. 15s is plenty
      // for appointment status changes; lower it if you add SignalR later.
      const interval = setInterval(fetchAppointments, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data } = await api.get("/appointments");
      // Map the API's camelCase DTO back to the snake_case shape this page expects.
      const mapped = data
        .map((a: any) => ({
          id: a.id,
          service: a.service,
          price: a.price,
          appointment_date: a.appointmentDate,
          appointment_time: a.appointmentTime,
          status: a.status,
          payment_status: a.paymentStatus,
          notes: a.notes,
          created_at: a.createdAt,
        }))
        .sort((a: any, b: any) => a.appointment_date.localeCompare(b.appointment_date));
      setAppointments(mapped);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoadingAppointments(false);
  };

  const handleViewAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setActiveView("detail");
  };

  const handleEditAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setFormData({
      service: apt.service,
      price: apt.price.toString(),
      appointment_date: apt.appointment_date,
      appointment_time: apt.appointment_time,
      notes: apt.notes || "",
    });
    setActiveView("edit");
  };

  const handleSaveAppointment = async () => {
    if (!selectedAppointment) return;

    if (!formData.service || !formData.price || !formData.appointment_date || !formData.appointment_time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      await api.put(`/appointments/${selectedAppointment.id}`, {
        service: formData.service,
        price: parseFloat(formData.price),
        appointmentDate: formData.appointment_date,
        appointmentTime: formData.appointment_time,
        notes: formData.notes || null,
      });
      toast({
        title: "Success",
        description: "Appointment updated successfully.",
      });
      fetchAppointments();
      setActiveView("list");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment.",
      });
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await api.delete(`/appointments/${selectedAppointment.id}`);
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
      });
    }
    setShowDeleteDialog(false);
    setSelectedAppointment(null);
    setActiveView("list");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-gold-500/10 text-gold-600 border-gold-500/20">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-teal-600/10 text-teal-600 border-teal-600/20">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-teal-600/10 text-teal-600 border-teal-600/20">Paid</Badge>;
      case "pending":
        return <Badge className="bg-gold-500/10 text-gold-600 border-gold-500/20">Pending</Badge>;
      case "unpaid":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) >= new Date() && apt.status !== "cancelled"
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) < new Date() || apt.status === "cancelled"
  );

  // LIST VIEW
  const renderListView = () => (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.first_name || "Patient"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your dental appointments and records
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/book">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("nav.book")}
            </Button>
          </Link>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {appointments.filter((a) => a.status === "completed").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-600/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(appointments.filter((a) => a.payment_status === "paid").reduce((sum, a) => sum + a.price, 0), i18n.language)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gold-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled dental visits - Click to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No upcoming appointments</p>
              <Link to="/book">
                <Button>Book Your First Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => handleViewAppointment(apt)}
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{apt.service}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(apt.appointment_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                        <Clock className="w-4 h-4 ml-2" />
                        {apt.appointment_time}
                      </div>
                        <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(apt.status)}
                        {getPaymentBadge(apt.payment_status)}
                        <span className="text-sm font-medium text-foreground">{formatCurrency(apt.price, i18n.language)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAppointment(apt)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAppointment(apt)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>Your appointment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleViewAppointment(apt)}
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{apt.service}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        {new Date(apt.appointment_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="mx-1">•</span>
                        {apt.appointment_time}
                      </div>
                        <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(apt.status)}
                        <span className="text-sm font-medium text-foreground">{formatCurrency(apt.price, i18n.language)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // DETAIL VIEW
  const renderDetailView = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => setActiveView("list")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium text-lg">{selectedAppointment?.service}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {selectedAppointment && new Date(selectedAppointment.appointment_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{selectedAppointment?.appointment_time}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("labels.price")}</p>
              <p className="font-medium text-2xl text-primary">{formatCurrency(selectedAppointment?.price, i18n.language)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Appointment Status</p>
              {selectedAppointment && getStatusBadge(selectedAppointment.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
              {selectedAppointment && getPaymentBadge(selectedAppointment.payment_status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booked On</p>
              <p className="font-medium">
                {selectedAppointment && new Date(selectedAppointment.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {selectedAppointment?.notes && (
          <Card className="md:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{selectedAppointment.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={() => handleEditAppointment(selectedAppointment!)} className="bg-primary hover:bg-primary/90">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Appointment
        </Button>
        <Button 
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Cancel Appointment
        </Button>
      </div>
    </>
  );

  // EDIT VIEW
  const renderEditView = () => (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => setActiveView("list")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Edit Appointment</h2>
      </div>

      <Card className="bg-card border-border max-w-2xl">
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div>
              <Label htmlFor="service">Service *</Label>
              <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dental Cleaning">Dental Cleaning</SelectItem>
                  <SelectItem value="Root Canal">Root Canal</SelectItem>
                  <SelectItem value="Teeth Whitening">Teeth Whitening</SelectItem>
                  <SelectItem value="Dental Implants">Dental Implants</SelectItem>
                  <SelectItem value="Orthodontics">Orthodontics</SelectItem>
                  <SelectItem value="Dental Crowns">Dental Crowns</SelectItem>
                  <SelectItem value="Dental Bridges">Dental Bridges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">{t("labels.price")} (EGP) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="150"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date">Date *</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="appointment_time">Time *</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about your appointment..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveAppointment} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setActiveView("list")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  if (isLoading || loadingAppointments) {
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
        <div className="container mx-auto px-4">
          {activeView === "list" && renderListView()}
          {activeView === "detail" && renderDetailView()}
          {activeView === "edit" && renderEditView()}
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;