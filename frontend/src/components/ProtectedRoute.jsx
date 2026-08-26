import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const jwtoken = localStorage.getItem("jwtoken");
    if (!jwtoken) {
      navigate("/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, [navigate]);

  if (checking) return null;
  if (!isAuthenticated) return null;
  return children;
}
