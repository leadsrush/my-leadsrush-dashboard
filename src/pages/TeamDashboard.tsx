
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend 
} from 'recharts';

// Importing tabs for service analytics
import ServiceOverviewTab from '@/components/dashboard/analytics/ServiceOverviewTab';
import ServiceRevenueTab from '@/components/dashboard/analytics/ServiceRevenueTab';
import ClientAdoptionTab from '@/components/dashboard/analytics/ClientAdoptionTab';

// Import mock data
import { 
  getTeamProjects, 
  getServicesByUsage,
  getClientAdoptionData,
  getProjectStatusData
} from '@/data/mockData';

// Define proper type for the enhanced service data
interface EnhancedServiceData {
  name: string;
  id: string;
  icon: string;
  count: number;
  clients: number;
  revenue: number;
}

// Define proper type for client adoption data
interface ClientAdoptionData {
  name: string;
  services: number;
  potential: number;
}

const TeamDashboard = () => {
  const { user, hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Get data that would come from API in real app
  const projects = getTeamProjects(user?.id || '');
  const projectsByStatus = getProjectStatusData();
  
  // Convert service data to the right format
  const rawServices = getServicesByUsage();
  const sortedServices: EnhancedServiceData[] = rawServices.map(service => ({
    name: service.name || `Service ${service.id}`,
    id: service.id,
    icon: service.icon || 'bar-chart',
    count: service.count,
    clients: service.clients || Math.floor(service.count * 0.7),
    revenue: service.revenue || service.count * 1000
  }));

  // Convert client adoption data to the right format
  const rawClientData = getClientAdoptionData();
  const clientAdoptionData: ClientAdoptionData[] = rawClientData.map(client => ({
    name: client.name,
    services: client.new || 0,
    potential: client.existing || 0
  }));
  
  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto py-8">
        {/* Dashboard header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Team Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user?.profile?.name || 'Team Member'}. Here's an overview of your projects and performance.
          </p>
        </header>
        
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {projects.filter(p => p.status === 'in_progress').length} active
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
              <div className="text-3xl font-bold">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(projects.map(p => p.clientId)).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {projects.filter(p => new Date(p.startDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} new in last 30 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Services Provided
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {sortedServices.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {sortedServices.filter(s => s.count > 5).length} frequently used
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectsByStatus.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name === 'In Progress' ? '#ef4444' :
                            entry.name === 'Completed' ? '#22c55e' :
                            entry.name === 'Planning' ? '#f59e0b' : '#64748b'
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} projects`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: 'Jan', completed: 4, new: 6 },
                      { month: 'Feb', completed: 5, new: 8 },
                      { month: 'Mar', completed: 7, new: 5 },
                      { month: 'Apr', completed: 3, new: 9 },
                      { month: 'May', completed: 6, new: 7 },
                      { month: 'Jun', completed: 8, new: 8 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" name="New Projects" fill="#ef4444" />
                    <Bar dataKey="completed" name="Completed" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Service Analytics section - only visible for admin and project managers */}
        {hasRole(['admin', 'project_manager']) && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Service Analytics</h2>
            <Card>
              <CardHeader>
                <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="clients">Client Adoption</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="overview">
                  <ServiceOverviewTab sortedByUsage={sortedServices} />
                </TabsContent>
                <TabsContent value="revenue">
                  <ServiceRevenueTab sortedByUsage={sortedServices} />
                </TabsContent>
                <TabsContent value="clients">
                  <ClientAdoptionTab clientAdoptionData={clientAdoptionData} />
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Recent Activity - Would connect to real data in a production app */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Project {i} Update</p>
                      <p className="text-sm text-muted-foreground">Task completed by Team Member {i}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{i}h ago</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default TeamDashboard;
