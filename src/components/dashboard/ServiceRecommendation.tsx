
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, Send } from "lucide-react";
import { User, Service, services, getProjectsByClient } from '@/data/mockData';
import Icon from '@/components/ui/icon-mapper';

interface ServiceRecommendationProps {
  clients: User[];
}

const ServiceRecommendation: React.FC<ServiceRecommendationProps> = ({ clients }) => {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const { toast } = useToast();
  
  const activeClients = clients.filter(client => client.active);
  
  // Get recommendations for the selected client
  const getRecommendedServices = (clientId: string): Service[] => {
    if (!clientId) return [];
    
    const clientProjects = getProjectsByClient(clientId);
    const currentServiceIds = clientProjects.flatMap(p => p.serviceIds);
    const uniqueServiceIds = [...new Set(currentServiceIds)];
    
    // Filter out services the client already has
    return services.filter(service => !uniqueServiceIds.includes(service.id));
  };
  
  const recommendedServices = getRecommendedServices(selectedClient);
  const selectedClientData = activeClients.find(c => c.id === selectedClient);
  
  const handleSendRecommendation = () => {
    if (!selectedClient || !selectedService) {
      toast({
        title: "Missing information",
        description: "Please select both a client and a service to recommend",
        variant: "destructive"
      });
      return;
    }
    
    const service = services.find(s => s.id === selectedService);
    const client = activeClients.find(c => c.id === selectedClient);
    
    toast({
      title: "Recommendation sent!",
      description: `${service?.name} has been recommended to ${client?.name}`,
    });
    
    // Reset the form
    setSelectedService("");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recommend Services</CardTitle>
        <p className="text-sm text-muted-foreground">
          Suggest new services to your clients
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="client" className="text-sm font-medium">Select Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {activeClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedClient && (
            <div className="grid gap-2">
              <label htmlFor="service" className="text-sm font-medium">Recommended Services</label>
              {recommendedServices.length > 0 ? (
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Choose a service to recommend" />
                  </SelectTrigger>
                  <SelectContent>
                    {recommendedServices.map(service => (
                      <SelectItem key={service.id} value={service.id} className="flex items-center">
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 border rounded-md bg-muted/50 text-sm">
                  This client is already using all available services.
                </div>
              )}
            </div>
          )}
          
          {selectedService && (
            <div className="border rounded-md p-4 bg-muted/20">
              <div className="flex items-start gap-3">
                {(() => {
                  const service = services.find(s => s.id === selectedService);
                  if (!service) return null;
                  
                  return (
                    <>
                      <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                        <Icon name={service.icon} className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {service.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              <span className="text-xs">{feature}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendRecommendation} 
          disabled={!selectedClient || !selectedService}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Recommendation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceRecommendation;
