import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../api/types";

type Props = {
  children: React.ReactNode;
  roles?: Role[];
};

export function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/kanban" replace />;
  return <>{children}</>;
}
