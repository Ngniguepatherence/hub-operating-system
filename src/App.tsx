import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Spaces from "./pages/Spaces";
import Media from "./pages/Media";
import Finance from "./pages/Finance";
import Students from "./pages/Students";
import HR from "./pages/HR";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/crm" 
        element={<ProtectedRoute><CRM /></ProtectedRoute>} 
      />
      <Route 
        path="/spaces" 
        element={<ProtectedRoute><Spaces /></ProtectedRoute>} 
      />
      <Route 
        path="/media" 
        element={<ProtectedRoute><Media /></ProtectedRoute>} 
      />
      <Route 
        path="/media/:type" 
        element={<ProtectedRoute><Media /></ProtectedRoute>} 
      />
      <Route 
        path="/students" 
        element={<ProtectedRoute><Students /></ProtectedRoute>} 
      />
      <Route 
        path="/finance" 
        element={<ProtectedRoute><Finance /></ProtectedRoute>} 
      />
      <Route 
        path="/hr" 
        element={<ProtectedRoute><HR /></ProtectedRoute>} 
      />
      <Route 
        path="/documents" 
        element={<ProtectedRoute><Documents /></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Settings /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications" 
        element={<ProtectedRoute><Notifications /></ProtectedRoute>} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;