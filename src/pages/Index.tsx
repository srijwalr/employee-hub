import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to /employees with replace to avoid adding to history
    navigate("/employees", { replace: true });
  }, [navigate]);

  // Render a loading state while redirecting
  return <div>Loading...</div>;
};

export default Index;