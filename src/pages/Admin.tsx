import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";
import { 
  Calendar, Users, DollarSign, Clock, 
  LayoutDashboard, CalendarDays, LogOut, 
  Edit2, Trash2, Eye, Plus, ArrowLeft, Search, Filter
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
  user_id: string;
  service: string;
  price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  const [activeView, setActiveView] = useState<"list" | "detail" | "create" | "edit">("list");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state for create/edit
  const [formData, setFormData] = useState({
    service: "",
    price: "",
    appointment_date: "",
    appointment_time: "",
    status: "pending",
    payment_status: "unpaid",
    notes: "",
    user_email: ""
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
      return;
    }

    if (isAdmin) {
      fetchAppointments();

      // No realtime channel on the ASP.NET backend — poll instead.
      const interval = setInterval(fetchAppointments, 15000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, isLoading, navigate]);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;
    
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        `${apt.profiles?.first_name} ${apt.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }
    
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/admin/appointments");
      // Map camelCase DTO (incl. joined patient fields) back to the snake_case
      // shape this page's JSX already expects.
      const mapped = data.map((a: any) => ({
        id: a.id,
        user_id: a.userId,
        service: a.service,
        price: a.price,
        appointment_date: a.appointmentDate,
        appointment_time: a.appointmentTime,
        status: a.status,
        payment_status: a.paymentStatus,
        notes: a.notes,
        created_at: a.createdAt,
        profiles: {
          first_name: a.patientFirstName,
          last_name: a.patientLastName,
          email: a.patientEmail,
          phone: a.patientPhone,
        },
      }));

      setAppointments(mapped as Appointment[]);
      setFilteredAppointments(mapped as Appointment[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoadingData(false);
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
      status: apt.status,
      payment_status: apt.payment_status,
      notes: apt.notes || "",
      user_email: apt.profiles?.email || ""
    });
    setActiveView("edit");
  };

  const handleCreateNew = () => {
    setSelectedAppointment(null);
    setFormData({
      service: "",
      price: "",
      appointment_date: "",
      appointment_time: "",
      status: "pending",
      payment_status: "unpaid",
      notes: "",
      user_email: ""
    });
    setActiveView("create");
  };

  const handleSaveAppointment = async () => {
    if (!formData.service || !formData.price || !formData.appointment_date || !formData.appointment_time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (activeView === "create") {
      if (!formData.user_email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please provide patient email.",
        });
        return;
      }

      try {
        await api.post("/admin/appointments", {
          patientEmail: formData.user_email,
          service: formData.service,
          price: parseFloat(formData.price),
          appointmentDate: formData.appointment_date,
          appointmentTime: formData.appointment_time,
          status: formData.status,
          paymentStatus: formData.payment_status,
          notes: formData.notes || null,
        });
        toast({
          title: "Success",
          description: "Appointment created successfully.",
        });
        fetchAppointments();
        setActiveView("list");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Failed to create appointment.",
        });
      }
    } else if (activeView === "edit" && selectedAppointment) {
      try {
        // Two calls: one for the editable fields, one for status/paymentStatus
        // (kept as separate endpoints on the backend — see AppointmentsController vs AdminController).
        await api.put(`/appointments/${selectedAppointment.id}`, {
          service: formData.service,
          price: parseFloat(formData.price),
          appointmentDate: formData.appointment_date,
          appointmentTime: formData.appointment_time,
          notes: formData.notes || null,
        });
        await api.put(`/admin/appointments/${selectedAppointment.id}/status`, {
          status: formData.status,
          paymentStatus: formData.payment_status,
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
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await api.delete(`/appointments/${selectedAppointment.id}`);
      toast({
        title: "Success",
        description: "Appointment deleted successfully.",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete appointment.",
      });
    }
    setShowDeleteDialog(false);
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

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.appointment_date && apt.appointment_date.split("T")[0] === todayStr
  );

  const totalRevenue = appointments
    .filter((a) => a.payment_status && a.payment_status.toLowerCase() === "paid")
    .reduce((sum, a) => sum + (a.price || 0), 0);
  const formattedTotalRevenue = formatCurrency(totalRevenue, i18n.language);

  const pendingAppointments = appointments.filter((a) => (a.status || "").toLowerCase() === "pending");

  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length.toString(), icon: Calendar, color: "text-primary" },
    { label: "Total Appointments", value: appointments.length.toString(), icon: Users, color: "text-teal-600" },
    { label: "Revenue", value: formattedTotalRevenue, icon: DollarSign, color: "text-gold-500" },
    { label: "Pending", value: pendingAppointments.length.toString(), icon: Clock, color: "text-accent" },
  ];



  // LIST VIEW
  const renderListView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Click on any appointment to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr 
                      key={apt.id} 
                      className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                      onClick={() => handleViewAppointment(apt)}
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">
                          {apt.profiles?.first_name} {apt.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{apt.profiles?.email}</p>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{apt.service}</td>
                      <td className="py-4 px-4">
                        <p className="text-foreground">{apt.appointment_date}</p>
                        <p className="text-sm text-muted-foreground">{apt.appointment_time}</p>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(apt.status)}</td>
                      <td className="py-4 px-4">{getPaymentBadge(apt.payment_status)}</td>
                      <td className="py-4 px-4 font-medium text-foreground">{formatCurrency(apt.price, i18n.language)}</td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // DETAIL VIEW
  const renderDetailView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveView("list")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium text-lg">
                {selectedAppointment?.profiles?.first_name} {selectedAppointment?.profiles?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{selectedAppointment?.profiles?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{selectedAppointment?.profiles?.phone || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

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
                <p className="font-medium">{selectedAppointment?.appointment_date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{selectedAppointment?.appointment_time}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                {selectedAppointment && getStatusBadge(selectedAppointment.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment</p>
                {selectedAppointment && getPaymentBadge(selectedAppointment.payment_status)}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-2xl text-primary">{formatCurrency(selectedAppointment?.price, i18n.language)}</p>
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

      <div className="flex gap-3">
        <Button onClick={() => handleEditAppointment(selectedAppointment!)} className="bg-primary hover:bg-primary/90">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Appointment
        </Button>
        <Button 
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Appointment
        </Button>
      </div>
    </div>
  );

  // FORM VIEW (Create/Edit)
  const renderFormView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setActiveView("list")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {activeView === "create" ? "Create New Appointment" : "Edit Appointment"}
        </h2>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {activeView === "create" && (
              <div className="md:col-span-2">
                <Label htmlFor="user_email">Patient Email *</Label>
                <Input
                  id="user_email"
                  type="email"
                  value={formData.user_email}
                  onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                  placeholder="patient@example.com"
                  disabled={activeView === "edit"}
                />
                <p className="text-xs text-muted-foreground mt-1">Enter the email of an existing patient</p>
              </div>
            )}

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
            
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="payment_status">Payment Status *</Label>
              <Select value={formData.payment_status} onValueChange={(value) => setFormData({...formData, payment_status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about the appointment..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveAppointment} className="bg-primary hover:bg-primary/90">
              {activeView === "create" ? "Create Appointment" : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => setActiveView("list")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">DentCare</span>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "appointments", label: "Appointments", icon: CalendarDays },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}>
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, Dr. {profile?.last_name || "Admin"}
            </h1>
            <p className="text-muted-foreground">Here's what's happening at your practice today.</p>
          </div>
        </div>

        {/* Content based on active tab and view */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Latest appointments in your practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveTab("appointments");
                        handleViewAppointment(apt);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {apt.profiles?.first_name} {apt.profiles?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{apt.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{apt.appointment_date}</p>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          {getStatusBadge(apt.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setActiveTab("appointments")}
                >
                  View All Appointments
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === "appointments" && (
          <>
            {activeView === "list" && renderListView()}
            {activeView === "detail" && renderDetailView()}
            {activeView === "create" && renderFormView()}
            {activeView === "edit" && renderFormView()}
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;