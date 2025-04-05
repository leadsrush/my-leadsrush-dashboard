
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { services } from '@/data/mockData';
import Icon from '@/components/ui/icon-mapper';
import { IconName } from '@/data/mockData';

interface ServiceUsageData {
  name: string;
  icon: IconName;
  value: number;
  color: string;
}

// This would typically come from the backend
const generateServiceUsageData = (): ServiceUsageData[] => {
  const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  return services.map((service, index) => ({
    name: service.name,
    icon: service.icon,
    value: Math.floor(Math.random() * 30) + 10, // Simulated percentage between 10-40%
    color: colors[index % colors.length]
  }));
};

const ClientServiceAnalytics: React.FC = () => {
  const serviceData = generateServiceUsageData();
  const total = serviceData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages
  const dataWithPercent = serviceData.map(item => ({
    ...item,
    percent: Math.round((item.value / total) * 100)
  }));
  
  // Sort by usage percentage (descending)
  const sortedData = [...dataWithPercent].sort((a, b) => b.percent - a.percent);
  const topServices = sortedData.slice(0, 3);
  
  const config = serviceData.reduce(
    (acc, { name, color }) => ({
      ...acc,
      [name]: { color },
    }),
    {}
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">What Other Clients Are Doing</CardTitle>
        <p className="text-sm text-muted-foreground">
          Popular services among our clients
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <div className="text-sm font-medium">Top Services</div>
            {topServices.map((service, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-full" 
                  style={{ backgroundColor: `${service.color}20` }}
                >
                  <Icon name={service.icon} className="h-4 w-4" color={service.color} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{service.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {service.percent}%
                    </Badge>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${service.percent}%`, 
                        backgroundColor: service.color 
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              Based on current client subscriptions
            </p>
          </div>
          
          <div className="flex justify-center items-center">
            <ChartContainer className="w-full h-full" config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientServiceAnalytics;
