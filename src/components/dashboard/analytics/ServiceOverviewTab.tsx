
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Icon from '@/components/ui/icon-mapper';

interface ServiceOverviewTabProps {
  sortedByUsage: Array<{
    name: string;
    id: string;
    icon: string;
    count: number;
    clients: number;
    revenue: number;
  }>;
  pieData: Array<{
    name: string;
    value: number;
  }>;
}

const ServiceOverviewTab: React.FC<ServiceOverviewTabProps> = ({ sortedByUsage, pieData }) => {
  // Colors for charts
  const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
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
                  color={colors[idx % colors.length]}
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
  );
};

export default ServiceOverviewTab;
