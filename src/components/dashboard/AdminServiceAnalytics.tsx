
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Project, services } from '@/data/mockData';
import ServiceOverviewTab from './analytics/ServiceOverviewTab';
import ClientAdoptionTab from './analytics/ClientAdoptionTab';
import ServiceRevenueTab from './analytics/ServiceRevenueTab';

interface ServiceAnalyticsProps {
  clients: User[];
  projects: Project[];
}

const AdminServiceAnalytics: React.FC<ServiceAnalyticsProps> = ({ clients, projects }) => {
  const activeClients = clients.filter(client => client.active);
  
  // Generate service usage data
  const serviceUsage = services.map(service => {
    const projectsUsingService = projects.filter(project => 
      project.serviceIds.includes(service.id)
    );
    
    return {
      name: service.name,
      id: service.id,
      icon: service.icon,
      count: projectsUsingService.length,
      clients: [...new Set(projectsUsingService.map(p => p.clientId))].length,
      revenue: projectsUsingService.length * (service.price || 500), // Simulated revenue
    };
  });
  
  // Sort by usage count
  const sortedByUsage = [...serviceUsage].sort((a, b) => b.count - a.count);
  
  // Calculate percentages for pie chart
  const total = serviceUsage.reduce((sum, service) => sum + service.count, 0);
  const pieData = serviceUsage.map(service => ({
    name: service.name,
    value: Math.round((service.count / (total || 1)) * 100),
  }));
  
  // Client adoption data
  const clientAdoptionData = activeClients.map(client => {
    const clientProjects = projects.filter(p => p.clientId === client.id);
    const serviceIds = clientProjects.flatMap(p => p.serviceIds);
    const uniqueServices = [...new Set(serviceIds)];
    
    return {
      name: client.name,
      services: uniqueServices.length,
      potential: services.length - uniqueServices.length,
    };
  }).sort((a, b) => b.services - a.services).slice(0, 5);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Service Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="adoption">Client Adoption</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="m-0">
            <ServiceOverviewTab 
              sortedByUsage={sortedByUsage} 
              pieData={pieData} 
            />
          </TabsContent>
          
          <TabsContent value="adoption" className="m-0">
            <ClientAdoptionTab 
              clientAdoptionData={clientAdoptionData} 
            />
          </TabsContent>
          
          <TabsContent value="revenue" className="m-0">
            <ServiceRevenueTab 
              sortedByUsage={sortedByUsage} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminServiceAnalytics;
