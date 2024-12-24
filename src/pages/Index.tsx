import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to /employees since that's the current route
    navigate("/employees", { replace: true });
  }, [navigate]);

  return null;
};

export default Index;