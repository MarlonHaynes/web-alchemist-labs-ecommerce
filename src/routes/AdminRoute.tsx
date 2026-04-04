import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";

export default function AdminRoute({ children }) {
  const { currentUser, isAuthLoading, isAdmin } = useAuth();

  if (isAuthLoading) {
    return <LoadingState message="Checking admin access..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}