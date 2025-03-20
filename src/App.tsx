
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import ClientDashboard from "./pages/ClientDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Messages from "./pages/Messages";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";

// Components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Auth protection wrapper component
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: { 
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, user, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles as any)) {
    // Redirect to appropriate dashboard based on role
    if (hasRole(['admin', 'project_manager', 'team_member'])) {
      return <Navigate to="/team-dashboard" replace />;
    }
    return <Navigate to="/client-dashboard" replace />;
  }

  return children;
};

// Main layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto pt-16 md:pt-0 md:pl-64">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Client routes */}
              <Route 
                path="/client-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Team routes */}
              <Route 
                path="/team-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'project_manager', 'team_member']}>
                    <TeamDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Common routes */}
              <Route 
                path="/projects/:projectId" 
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <Services />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
