
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Project, services } from '@/data/mockData';
import Icon from '@/components/ui/icon-mapper';
import { getProjectsByClient } from '@/data/mockData';

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
    const clientProjects = getProjectsByClient(client.id);
    const serviceIds = clientProjects.flatMap(p => p.serviceIds);
    const uniqueServices = [...new Set(serviceIds)];
    
    return {
      name: client.name,
      services: uniqueServices.length,
      potential: services.length - uniqueServices.length,
    };
  }).sort((a, b) => b.services - a.services).slice(0, 5);
  
  // Colors for charts
  const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  const config = {
    services: { theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
    potential: { theme: { light: '#e2e8f0', dark: '#1e293b' } },
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Service Popularity</h3>
                <div className="space-y-4">
                  {sortedByUsage.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-full" 
                        style={{ backgroundColor: `${colors[idx % colors.length]}20` }}
                      >
                        <Icon 
                          name={service.icon} 
                          className="h-4 w-4" 
                          style={{ color: colors[idx % colors.length] }} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{service.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {service.count} projects
                            </Badge>
                            <Badge variant="secondary">
                              {service.clients} clients
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${(service.count / (Math.max(...sortedByUsage.map(s => s.count)) || 1)) * 100}%`, 
                              backgroundColor: colors[idx % colors.length]
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-4">Service Distribution</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="adoption" className="m-0">
            <div className="min-h-[400px]">
              <h3 className="text-lg font-medium mb-4">Top Clients by Service Adoption</h3>
              <ChartContainer config={config} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientAdoptionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                    />
                    <Bar 
                      dataKey="services" 
                      stackId="a" 
                      fill="#0ea5e9" 
                      name="Active Services" 
                    />
                    <Bar 
                      dataKey="potential" 
                      stackId="a" 
                      fill="#e2e8f0" 
                      name="Potential Services" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="text-xs text-muted-foreground mt-4 text-center">
                Shows the number of services each client is using and potential for additional services
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="m-0">
            <div className="min-h-[400px]">
              <h3 className="text-lg font-medium mb-4">Revenue by Service</h3>
              <ChartContainer className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={sortedByUsage}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      label={{ 
                        value: 'Estimated Revenue ($)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' } 
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="text-xs text-muted-foreground mt-4 text-center">
                Estimated revenue based on current service usage (simulated data)
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminServiceAnalytics;
