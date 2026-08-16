import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft, Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    }

    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please enter your first and last name.",
      });
      setIsSubmitting(false);
      return;
    }

    const { error } = await signUp(registerEmail, registerPassword, firstName, lastName);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please login instead.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Welcome to DentCare. You can now book appointments.",
      });
      navigate("/dashboard");
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">Authenticating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-teal-50/20 to-background dark:via-teal-950/10 p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Glow Circles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Brand Header */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary via-teal-500 to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              Dent<span className="text-primary">Care</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider -mt-1">Patient Portal</span>
          </div>
        </Link>

        {/* Main Card */}
        <Card className="glass-card border border-white/60 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-extrabold text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in to manage your bookings or create a patient account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-secondary/60 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg font-bold text-xs">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg font-bold text-xs">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="font-bold text-xs text-foreground mb-1.5 block">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="pl-10 rounded-xl border-border/80"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="login-password font-bold text-xs text-foreground mb-1.5 block">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 rounded-xl border-border/80"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-xl font-bold bg-gradient-to-r from-primary to-accent py-2.5 shadow-md shadow-primary/20 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In to Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="font-bold text-xs text-foreground mb-1.5 block">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="pl-10 rounded-xl border-border/80"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-bold text-xs text-foreground mb-1.5 block">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="rounded-xl border-border/80"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-email" className="font-bold text-xs text-foreground mb-1.5 block">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-10 rounded-xl border-border/80"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-password" className="font-bold text-xs text-foreground mb-1.5 block">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 rounded-xl border-border/80"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Must be at least 6 characters</p>
                  </div>
                  <Button type="submit" className="w-full rounded-xl font-bold bg-gradient-to-r from-primary to-accent py-2.5 shadow-md shadow-primary/20 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Patient Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-semibold text-muted-foreground mt-6">
          <Link to="/" className="inline-flex items-center hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;