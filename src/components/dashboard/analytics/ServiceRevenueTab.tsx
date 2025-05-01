
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ServiceRevenueTabProps {
  sortedByUsage: Array<{
    name: string;
    id: string;
    icon: string;
    count: number;
    clients: number;
    revenue: number;
  }>;
}

const ServiceRevenueTab: React.FC<ServiceRevenueTabProps> = ({ sortedByUsage }) => {
  // Empty config object for the ChartContainer
  const config = {};
  
  return (
    <div className="min-h-[400px]">
      <h3 className="text-lg font-medium mb-4">Revenue by Service</h3>
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
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="text-xs text-muted-foreground mt-4 text-center">
        Estimated revenue based on current service usage (simulated data)
      </div>
    </div>
  );
};

export default ServiceRevenueTab;
