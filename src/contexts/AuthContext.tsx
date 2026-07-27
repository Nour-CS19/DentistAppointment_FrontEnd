import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, tokenStorage } from "@/lib/api";

type UserRole = "admin" | "client";

// Kept snake_case (user_id/first_name/last_name) to match the original Supabase
// shape, so Dashboard.tsx / Book.tsx / Admin.tsx don't need to change every
// `profile?.first_name` reference.
interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
}

// Minimal stand-in for Supabase's `User` shape — only what the pages actually use.
interface AuthUser {
  id: string;
  email: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuthResult = (data: { token: string; profile: any }) => {
    tokenStorage.set(data.token);
    setUser({ id: data.profile.userId, email: data.profile.email });
    setProfile({
      user_id: data.profile.userId,
      first_name: data.profile.firstName,
      last_name: data.profile.lastName,
      email: data.profile.email,
      phone: data.profile.phone ?? null,
      role: data.profile.role,
    });
    setRole(data.profile.role);
  };

  // There's no server-side "get current session" endpoint (no Supabase session
  // to restore) — the JWT itself is the session. We just decode what we stored
  // and re-validate lazily: if a call ever 401s, the axios interceptor clears it.
  const restoreSession = () => {
    const token = tokenStorage.get();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload["nameid"] || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const email = payload["email"] || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      const roleClaim = payload["role"] || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        tokenStorage.clear();
        setIsLoading(false);
        return;
      }

      setUser({ id: userId, email });
      setRole((Array.isArray(roleClaim) ? roleClaim[0] : roleClaim) || "client");
      // Profile details (first/last name, phone) aren't in the JWT — fetch on demand
      // from an appointments call isn't ideal, so we keep name blank until the user
      // hits an endpoint that returns profile info, e.g. after next login.
    } catch {
      tokenStorage.clear();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const refreshProfile = async () => {
    // No dedicated /me endpoint yet — add one to Application/Api if you need to
    // rehydrate full profile details (first/last name, phone) after a page refresh.
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data } = await api.post("/auth/register", { email, password, firstName, lastName });
      applyAuthResult(data);
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.response?.data?.error || "Registration failed") };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      applyAuthResult(data);
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.response?.data?.error || "Invalid email or password") };
    }
  };

  const signOut = async () => {
    tokenStorage.clear();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const value = {
    user,
    profile,
    role,
    isLoading,
    isAdmin: role === "admin",
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
