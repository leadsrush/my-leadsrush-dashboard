
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import lucide icons directly instead of using dynamic icons
import { Search, MousePointerClick, FileText, Share2, BarChart as BarChartIcon } from "lucide-react";

interface ServiceOverviewTabProps {
  sortedByUsage: Array<{
    name: string;
    id: string;
    icon: string;
    count: number;
    clients: number;
  }>;
}

// Helper function to map service ID to icon component
const getIconByServiceId = (serviceId: string) => {
  switch (serviceId) {
    case 'seo':
      return <Search className="h-5 w-5" />;
    case 'ppc':
      return <MousePointerClick className="h-5 w-5" />;
    case 'content':
      return <FileText className="h-5 w-5" />;
    case 'social':
      return <Share2 className="h-5 w-5" />;
    case 'analytics':
      return <BarChartIcon className="h-5 w-5" />;
    default:
      return <BarChartIcon className="h-5 w-5" />;
  }
};

const ServiceOverviewTab: React.FC<ServiceOverviewTabProps> = ({ sortedByUsage }) => {
  const config = {};
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sortedByUsage.slice(0, 3).map((service) => (
          <Card key={service.id} className="bg-background">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-center">
                <div className="bg-primary/10 p-2 rounded-full">
                  {getIconByServiceId(service.id)}
                </div>
                <span className="text-lg font-bold">{service.count}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <CardTitle className="text-sm">{service.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {service.clients} {service.clients === 1 ? 'client' : 'clients'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-80" config={config}>
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Projects" fill="#9333ea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clients" name="Clients" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceOverviewTab;
