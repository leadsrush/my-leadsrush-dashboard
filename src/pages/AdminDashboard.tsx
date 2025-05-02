
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import AdminServiceAnalytics from '@/components/dashboard/AdminServiceAnalytics';
import InvoiceSummary from '@/components/dashboard/InvoiceSummary';
import { services, projects } from '@/data/mockData';

// Define invoice type to match InvoiceSummary component's expectations
interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: string;
  date: string;
  dueDate: string;
  number?: string; // Make optional
  issueDate?: string; // Make optional
  items?: any[]; // Make optional
  total?: number; // Make optional
}

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Get data that would normally come from an API
  const clients = []; // Simplified, would come from API
  
  // Generate mock recent invoices
  const recentInvoices: Invoice[] = projects.slice(0, 5).map(project => ({
    id: `INV-${project.id.substring(0, 6)}`,
    clientId: project.clientId,
    clientName: `Client ${project.clientId.substring(0, 3)}`,
    amount: Math.floor(Math.random() * 5000) + 1000,
    status: ['paid', 'pending', 'overdue'][Math.floor(Math.random() * 3)],
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    number: `INV-${Math.floor(Math.random() * 1000)}`,
    issueDate: new Date().toISOString(),
    items: [],
    total: Math.floor(Math.random() * 5000) + 1000
  }));

  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user?.profile?.name || 'Admin'}. Here's an overview of key metrics and activities.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">125</div>
              <p className="text-xs text-muted-foreground mt-1">
                22 new in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78</div>
              <p className="text-xs text-muted-foreground mt-1">
                15 started this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$12,500</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">47</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last month's count
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminServiceAnalytics clients={clients} projects={projects} />
          <InvoiceSummary recentInvoices={recentInvoices} clientId={null} />
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
