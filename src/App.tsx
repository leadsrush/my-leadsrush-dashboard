
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Messages from "./pages/Messages";
import Services from "./pages/Services";
import AdminServices from "./pages/AdminServices";
import AdminInvoices from "./pages/AdminInvoices";
import ClientInvoices from "./pages/ClientInvoices";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import ClientMessage from "./pages/ClientMessage";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
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
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Redirect to appropriate dashboard based on role
    if (hasRole(['admin'])) {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (hasRole(['project_manager', 'team_member'])) {
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
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
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
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Navigate to={'/team-dashboard'} replace />
                </ProtectedRoute>
              } />
              
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
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
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
              
              {/* Invoice routes */}
              <Route 
                path="/invoices" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientInvoices />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/invoices" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminInvoices />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin service management route */}
              <Route 
                path="/admin/services" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminServices />
                  </ProtectedRoute>
                } 
              />
              
              {/* Client management routes */}
              <Route path="/clients" element={
                <ProtectedRoute allowedRoles={['admin', 'project_manager']}>
                  <Clients />
                </ProtectedRoute>
              } />
              
              <Route path="/clients/:clientId" element={
                <ProtectedRoute allowedRoles={['admin', 'project_manager']}>
                  <ClientDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/client-message/:clientId" element={
                <ProtectedRoute allowedRoles={['admin', 'project_manager']}>
                  <ClientMessage />
                </ProtectedRoute>
              } />
              
              <Route path="/team" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Team />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
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
