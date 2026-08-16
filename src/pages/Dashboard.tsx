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
  CheckCircle, AlertCircle, XCircle, DollarSign, ArrowLeft, Sparkles, LogOut, Loader2
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

      const interval = setInterval(fetchAppointments, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data } = await api.get("/appointments");
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

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline" className="rounded-full">Pending</Badge>;
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge className="bg-primary/15 text-primary border-primary/30 rounded-full font-bold px-3 py-0.5">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-gold-500/15 text-gold-600 border-gold-500/30 rounded-full font-bold px-3 py-0.5">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/15 text-destructive border-destructive/30 rounded-full font-bold px-3 py-0.5">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 rounded-full font-bold px-3 py-0.5">Completed</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status?: string) => {
    if (!status) return <Badge variant="outline" className="rounded-full">Unpaid</Badge>;
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 rounded-full font-bold px-3 py-0.5">Paid</Badge>;
      case "pending":
        return <Badge className="bg-gold-500/15 text-gold-600 border-gold-500/30 rounded-full font-bold px-3 py-0.5">Pending</Badge>;
      case "unpaid":
        return <Badge className="bg-destructive/15 text-destructive border-destructive/30 rounded-full font-bold px-3 py-0.5">Unpaid</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full">{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.appointment_date && new Date(apt.appointment_date) >= new Date() && (apt.status || "").toLowerCase() !== "cancelled"
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.appointment_date && (new Date(apt.appointment_date) < new Date() || (apt.status || "").toLowerCase() === "cancelled")
  );


  // LIST VIEW
  const renderListView = () => (
    <>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-primary/10 via-teal-500/5 to-accent/10 p-6 rounded-3xl border border-primary/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Patient Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome back, {profile?.first_name || "Patient"}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your scheduled visits, appointments, and care history
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link to="/book">
            <Button className="rounded-xl font-bold bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/20">
              <Plus className="w-4 h-4 mr-1.5" />
              {t("nav.book")}
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl font-semibold border-border/80" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-1.5 text-muted-foreground" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <Card className="glass-card border border-white/60 dark:border-white/10 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upcoming Visits</p>
                <p className="text-3xl font-extrabold text-foreground mt-1">{upcomingAppointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border border-white/60 dark:border-white/10 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completed Visits</p>
                <p className="text-3xl font-extrabold text-foreground mt-1">
                  {appointments.filter((a) => a.status === "completed").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border border-white/60 dark:border-white/10 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Invested</p>
                <p className="text-3xl font-extrabold text-primary mt-1">
                  {formatCurrency(appointments.filter((a) => a.payment_status === "paid").reduce((sum, a) => sum + a.price, 0), i18n.language)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="glass-card border border-white/60 dark:border-white/10 shadow-lg rounded-3xl mb-8 overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-xl font-bold text-foreground">Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled dental visits and checkups</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Calendar className="w-8 h-8" />
              </div>
              <p className="text-muted-foreground font-medium mb-4">No upcoming appointments scheduled</p>
              <Link to="/book">
                <Button className="rounded-xl font-bold bg-primary">Book Your First Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 transition-all shadow-xs cursor-pointer"
                  onClick={() => handleViewAppointment(apt)}
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-primary/20">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-extrabold text-foreground text-base">{apt.service}</p>
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mt-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(apt.appointment_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                        <Clock className="w-3.5 h-3.5 ml-2 text-primary" />
                        {apt.appointment_time}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {getStatusBadge(apt.status)}
                        {getPaymentBadge(apt.payment_status)}
                        <span className="text-sm font-extrabold text-foreground ml-1">{formatCurrency(apt.price, i18n.language)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleViewAppointment(apt)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleEditAppointment(apt)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
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
        <Card className="glass-card border border-white/60 dark:border-white/10 rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-xl font-bold text-foreground">Past Appointments</CardTitle>
            <CardDescription>Your dental care history</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {pastAppointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-pointer"
                  onClick={() => handleViewAppointment(apt)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{apt.service}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {new Date(apt.appointment_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span>•</span>
                        {apt.appointment_time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    {getStatusBadge(apt.status)}
                    <span className="text-xs font-bold text-foreground">{formatCurrency(apt.price, i18n.language)}</span>
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
        <Button variant="ghost" onClick={() => setActiveView("list")} className="rounded-xl font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <Card className="glass-card border border-white/60 dark:border-white/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="font-extrabold text-foreground">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dental Service</p>
              <p className="font-bold text-xl text-foreground mt-0.5">{selectedAppointment?.service}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</p>
                <p className="font-semibold text-sm text-foreground mt-0.5">
                  {selectedAppointment && new Date(selectedAppointment.appointment_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</p>
                <p className="font-semibold text-sm text-foreground mt-0.5">{selectedAppointment?.appointment_time}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("labels.price")}</p>
              <p className="font-extrabold text-2xl text-primary mt-0.5">{formatCurrency(selectedAppointment?.price, i18n.language)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-white/60 dark:border-white/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="font-extrabold text-foreground">Status & Medical Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Booking Status</p>
              {selectedAppointment && getStatusBadge(selectedAppointment.status)}
            </div>
            <div className="pt-2 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Payment Status</p>
              {selectedAppointment && getPaymentBadge(selectedAppointment.payment_status)}
            </div>
            <div className="pt-2 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Created On</p>
              <p className="font-semibold text-sm text-foreground mt-0.5">
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
          <Card className="md:col-span-2 glass-card border border-white/60 dark:border-white/10 rounded-3xl">
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Patient Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{selectedAppointment.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={() => handleEditAppointment(selectedAppointment!)} className="rounded-xl font-bold bg-primary">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Appointment
        </Button>
        <Button 
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="rounded-xl font-bold"
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
        <Button variant="ghost" onClick={() => setActiveView("list")} className="rounded-xl font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Edit Appointment</h2>
      </div>

      <Card className="glass-card border border-white/60 dark:border-white/10 rounded-3xl max-w-2xl">
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div>
              <Label htmlFor="service" className="font-bold text-xs text-foreground mb-1.5 block">Service *</Label>
              <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                <SelectTrigger className="rounded-xl border-border/80">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <Label htmlFor="price" className="font-bold text-xs text-foreground mb-1.5 block">{t("labels.price")} (EGP) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="150"
                className="rounded-xl border-border/80"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date" className="font-bold text-xs text-foreground mb-1.5 block">Date *</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                  className="rounded-xl border-border/80"
                />
              </div>
              
              <div>
                <Label htmlFor="appointment_time" className="font-bold text-xs text-foreground mb-1.5 block">Time *</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                  className="rounded-xl border-border/80"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes" className="font-bold text-xs text-foreground mb-1.5 block">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about your appointment..."
                rows={4}
                className="rounded-xl border-border/80 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveAppointment} className="rounded-xl font-bold bg-primary">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setActiveView("list")} className="rounded-xl font-semibold">
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">Loading patient dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-teal-50/20 to-background dark:via-teal-950/10">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {activeView === "list" && renderListView()}
          {activeView === "detail" && renderDetailView()}
          {activeView === "edit" && renderEditView()}
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-foreground">Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-xl">
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment} className="rounded-xl font-bold">
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;