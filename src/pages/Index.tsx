
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";

const Index = () => {
  const navigate = useNavigate();
  const [userSettings] = useLocalStorage<any>("userSettings", { defaultView: "dashboard" });

  useEffect(() => {
    // Redirect to default view based on user settings
    const defaultPath = `/${userSettings.defaultView || "dashboard"}`;
    navigate(defaultPath);
  }, [navigate, userSettings]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-bold mb-4">Loading Options Data Wizard...</h1>
      </div>
    </div>
  );
};

export default Index;
