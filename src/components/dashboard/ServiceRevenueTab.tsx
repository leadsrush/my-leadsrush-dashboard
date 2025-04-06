
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '../ui/card';

interface ServiceRevenueTabProps {
  revenueData: {
    name: string;
    revenue: number;
  }[];
}

const ServiceRevenueTab: React.FC<ServiceRevenueTabProps> = ({ revenueData }) => {
  // Format data for the chart
  const formattedData = revenueData.map(item => ({
    name: item.name,
    revenue: item.revenue,
  }));

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`Revenue: $${payload[0].value?.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-96">
      <CardContent className="p-6">
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRevenueTab;
