import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";

export default function ProtectedRoute({ children }) {
  const { currentUser, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingState message="Checking account access..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}