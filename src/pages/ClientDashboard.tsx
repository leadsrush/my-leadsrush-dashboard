
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/layout/PageTransition';
import ProjectCard from '@/components/dashboard/ProjectCard';
import InvoiceSummary from '@/components/dashboard/InvoiceSummary';
import { useAuth } from '@/context/AuthContext';
import { 
  getProjectsByClient, 
  getUnreadMessageCount, 
  getMessagesByUser, 
  Project, 
  services,
  getInvoicesByClient,
  getTotalPaidByClient 
} from '@/data/mockData';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  
  useEffect(() => {
    if (user) {
      const userProjects = getProjectsByClient(user.id);
      setProjects(userProjects);
      setUnreadMessages(getUnreadMessageCount(user.id));
      setTotalPaid(getTotalPaidByClient(user.id));
    }
  }, [user]);

  if (!user) return null;

  const recentInvoices = getInvoicesByClient(user.id).slice(0, 3);
  
  return (
    <PageTransition className="container py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}. Here's an overview of your marketing projects.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <CardDescription>Current marketing initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
          <CardFooter>
            <Link to="/services" className="text-xs text-muted-foreground hover:underline">
              View all services
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <CardDescription>Communication with your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages} unread</div>
          </CardContent>
          <CardFooter>
            <Link to="/messages" className="text-xs text-muted-foreground hover:underline">
              View messages
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CardDescription>Lifetime campaign investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/invoices" className="text-xs text-muted-foreground hover:underline">
              View all invoices
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Your Projects</h2>
            <Button variant="outline" asChild>
              <Link to="/services">
                <PlusCircle className="mr-2 h-4 w-4" />
                Request New Project
              </Link>
            </Button>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                />
              ))}
              
              <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                <div className="text-center mb-4">
                  <h3 className="font-medium mb-1">Need another service?</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore our marketing services
                  </p>
                </div>
                <Button asChild>
                  <Link to="/services">
                    Browse Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 border-dashed">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium mb-2">No active projects yet</h3>
                <p className="text-muted-foreground">
                  Explore our services and request your first marketing project
                </p>
              </div>
              <Button asChild size="lg">
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          )}
        </div>
        
        <div>
          <InvoiceSummary recentInvoices={recentInvoices} clientId={user.id} />
        </div>
      </div>
    </PageTransition>
  );
};

export default ClientDashboard;
