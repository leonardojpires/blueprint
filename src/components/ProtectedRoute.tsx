import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div
        className="app-workspace flex min-h-screen items-center justify-center"
        role="status"
      >
        <span
          className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
