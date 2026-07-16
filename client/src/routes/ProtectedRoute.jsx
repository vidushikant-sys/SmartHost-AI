import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ==========================================================
// ProtectedRoute
// Redirects to "/" (Login) if there's no auth token.
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// ==========================================================

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
