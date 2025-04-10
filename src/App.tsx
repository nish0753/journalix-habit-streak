
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/dashboard/Dashboard";
import AuthPage from "./components/auth/AuthPage";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import HabitTracking from "./pages/HabitTracking";
import Insights from "./pages/Insights";
import MonthlyView from "./components/calendar/MonthlyView";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<AuthPage type="login" />} />
              <Route path="/auth/signup" element={<AuthPage type="signup" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/habits" element={<HabitTracking />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/calendar" element={<MonthlyView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
