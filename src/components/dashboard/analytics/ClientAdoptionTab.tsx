
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ClientAdoptionTabProps {
  clientAdoptionData: Array<{
    name: string;
    services: number;
    potential: number;
  }>;
}

const ClientAdoptionTab: React.FC<ClientAdoptionTabProps> = ({ clientAdoptionData }) => {
  const config = {
    services: { theme: { light: '#0ea5e9', dark: '#0ea5e9' } },
    potential: { theme: { light: '#e2e8f0', dark: '#1e293b' } },
  };

  return (
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
  );
};

export default ClientAdoptionTab;
