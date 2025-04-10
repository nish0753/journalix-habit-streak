
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/dashboard/Dashboard";
import AuthPage from "./components/auth/AuthPage";
import JournalSection from "./components/journal/JournalSection";
import TodoList from "./components/todos/TodoList";
import MonthlyView from "./components/calendar/MonthlyView";
import ProgressInsights from "./components/insights/ProgressInsights";
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
              <Route path="/journal" element={<JournalSection />} />
              <Route path="/tasks" element={<TodoList />} />
              <Route path="/calendar" element={<MonthlyView />} />
              <Route path="/insights" element={<ProgressInsights />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
