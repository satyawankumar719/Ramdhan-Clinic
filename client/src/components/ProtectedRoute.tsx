import { ReactNode } from "react";
import { useAuth } from "@/store/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

type Role = "patient" | "doctor" | "admin";

interface ProtectedRouteProps {
  role?: Role;
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Not logged in - redirect to login
      navigate("/login", { replace: true });
      return;
    }

    if (!isLoading && user && role && user.role !== role) {
      // Wrong role - redirect to their own dashboard
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, isLoading, role, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hero"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (role && user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
