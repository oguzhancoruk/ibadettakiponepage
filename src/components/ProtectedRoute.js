import { Navigate } from "react-router-dom";
import { getSession } from "../utils/session";
export default function ProtectedRoute({ children }) {
  return getSession() ? children : <Navigate to="/login" replace />;
}
