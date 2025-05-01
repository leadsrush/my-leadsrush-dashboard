
import React, { useState } from 'react';
import { CalendarIcon, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from '@/components/layout/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ProjectCard from '@/components/dashboard/ProjectCard';
import ServiceRecommendation from '@/components/dashboard/ServiceRecommendation';
import ClientServiceAnalytics from '@/components/dashboard/ClientServiceAnalytics';
import { projects } from '@/data/mockData';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // This would come from API in a real app
  const clientProjects = projects.filter(project => project.clientId === (user?.id || ''));
  const hasActiveProjects = clientProjects.length > 0;
  
  const activeProjects = clientProjects.filter(p => p.status === 'in_progress');
  const completedProjects = clientProjects.filter(p => p.status === 'completed');
  
  // Calculate upcoming deadlines
  const now = new Date();
  const upcomingDeadlines = activeProjects
    .filter(p => {
      const deadline = new Date(p.endDate || '');
      const diffTime = Math.abs(deadline.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 14; // Show deadlines within next 14 days
    })
    .sort((a, b) => new Date(a.endDate || '').getTime() - new Date(b.endDate || '').getTime());
  
  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto py-8">
        {/* Welcome header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.profile?.name || 'Client'}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your projects and services
          </p>
        </header>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <h3 className="text-3xl font-bold">{activeProjects.length}</h3>
                </div>
                <Badge variant="success">{activeProjects.length > 0 ? 'In Progress' : 'None'}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Projects</p>
                  <h3 className="text-3xl font-bold">{completedProjects.length}</h3>
                </div>
                <Badge>{completedProjects.length > 0 ? 'Done' : 'None'}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Services Used</p>
                  <h3 className="text-3xl font-bold">{clientProjects.reduce((acc, project) => acc + project.serviceIds.length, 0)}</h3>
                </div>
                <Badge variant="outline">Total</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Projects and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
            
            {hasActiveProjects ? (
              <div className="grid gap-4">
                {activeProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                
                {activeProjects.length === 0 && completedProjects.length > 0 && (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p className="text-muted-foreground">All your projects are completed.</p>
                    <Button variant="outline" className="mt-2">Request New Project</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground mb-4">You don't have any projects yet.</p>
                <Button variant="default">Request Your First Project</Button>
              </div>
            )}
            
            {/* Upcoming deadlines */}
            {upcomingDeadlines.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map(project => {
                    const deadline = new Date(project.endDate || '');
                    const diffTime = Math.abs(deadline.getTime() - now.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={project.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                          <span>{project.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`mr-2 ${diffDays <= 3 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                            {diffDays} days left
                          </span>
                          <Button variant="ghost" size="icon">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Service Analytics</h2>
            {hasActiveProjects ? (
              <ClientServiceAnalytics userId={user?.id || ''} />
            ) : (
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-medium mb-2">Recommended Services</h3>
                <ServiceRecommendation />
              </div>
            )}
          </div>
        </div>
        
        {/* Onboarding dialog - would typically be shown only once */}
        <Dialog open={showOnboarding && !hasActiveProjects} onOpenChange={setShowOnboarding}>
          <DialogContent>
            <DialogTitle>Welcome to LeadsRush Africa!</DialogTitle>
            <DialogDescription>
              We're excited to have you on board. Let's get started by setting up your first project.
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setShowOnboarding(false)}>Get Started</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default ClientDashboard;
