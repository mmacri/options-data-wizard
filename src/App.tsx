
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import TradeManager from "./pages/TradeManager";
import Reporting from "./pages/Reporting";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./hooks/useThemeMode";
import { ToastProvider, useToast, setToastHandler } from "./hooks/use-toast";

// ToastInitializer ensures the toast handler is set up once the app is mounted
const ToastInitializer = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Set the global toast handler
    setToastHandler({ toast });
  }, [toast]);
  
  return null;
};

const App = () => {
  // Create a client inside the component to ensure it's within React's lifecycle
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <ToastProvider>
          <TooltipProvider>
            {/* Initialize the toast handler */}
            <ToastInitializer />
            
            {/* We only need one toaster UI component */}
            <Toaster />
            
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/trade-manager" element={<TradeManager />} />
                    <Route path="/reporting" element={<Reporting />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
