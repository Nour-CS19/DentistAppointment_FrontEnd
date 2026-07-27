
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // If not logged in, redirect to auth
      if (!user) {
        navigate("/auth");
        return;
      }

      // If admin route but user is not admin, redirect to dashboard
      if (requireAdmin && !isAdmin) {
        navigate("/dashboard");
        return;
      }
    }
  }, [user, isLoading, isAdmin, requireAdmin, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If admin required but user is not admin, don't render
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;