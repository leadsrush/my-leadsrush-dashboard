
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { services } from '@/data/mockData';
// Import Lucide icons directly
import { Search, MousePointerClick, FileText, Share2, BarChart } from "lucide-react";

const ClientServiceAnalytics = () => {
  const [activeTab, setActiveTab] = useState("what-others-use");
  
  // This would be real data in a production app
  const serviceUsage = [
    { id: 'seo', percentage: 85 },
    { id: 'ppc', percentage: 72 },
    { id: 'content', percentage: 64 },
    { id: 'social', percentage: 58 },
    { id: 'analytics', percentage: 45 },
  ];
  
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
        return <BarChart className="h-5 w-5" />;
      default:
        return <BarChart className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>What Other Clients Are Doing</CardTitle>
        <CardDescription>
          Discover which services are popular among other clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="what-others-use" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="what-others-use">Service Adoption</TabsTrigger>
            <TabsTrigger value="top-services">Top Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="what-others-use" className="space-y-4">
            {serviceUsage.map((item) => {
              const service = services.find(s => s.id === item.id);
              if (!service) return null;
              
              return (
                <div key={service.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 bg-primary/10 p-1.5 rounded-full">
                        {getIconByServiceId(service.id)}
                      </div>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <span className="text-sm">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} />
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Percentage of clients using each service
            </p>
          </TabsContent>
          
          <TabsContent value="top-services" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serviceUsage
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 4)
                .map((item) => {
                  const service = services.find(s => s.id === item.id);
                  if (!service) return null;
                  
                  return (
                    <Card key={service.id} className="bg-muted/50">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-2 bg-primary/10 p-1.5 rounded-full">
                              {getIconByServiceId(service.id)}
                            </div>
                            <CardTitle className="text-base">{service.name}</CardTitle>
                          </div>
                          <span className="text-sm font-bold">{item.percentage}%</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              }
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientServiceAnalytics;
