
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { Service, services } from '@/data/mockData';

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };
  
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form to the backend
    
    toast({
      title: 'Project request submitted',
      description: 'Your project request has been sent to our team.',
    });
    
    setShowRequestForm(false);
    navigate('/client-dashboard');
  };

  return (
    <PageTransition className="container py-6 max-w-7xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">Our Services</h1>
        <p className="text-muted-foreground">
          Explore our marketing services and request a new project
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ServiceCard 
              service={service}
              onSelect={handleServiceSelect}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedService?.name}</DialogTitle>
            <DialogDescription>
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="text-sm font-medium mb-3">Service Features</h4>
            <ul className="space-y-2">
              {selectedService?.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedService(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowRequestForm(true);
              setSelectedService(null);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Request Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Project Request Form Dialog */}
      <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request New Project</DialogTitle>
            <DialogDescription>
              Fill out the form below to request a new marketing project
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitRequest}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="Enter a name for your project" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea 
                  id="project-description" 
                  placeholder="Describe your project goals and requirements"
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <Separator />
              
              <div>
                <Label>Select Services</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {services.map(service => (
                    <div 
                      key={service.id} 
                      className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50"
                    >
                      <input 
                        type="checkbox" 
                        id={`service-${service.id}`} 
                        className="h-4 w-4 rounded"
                      />
                      <Label 
                        htmlFor={`service-${service.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input 
                  id="timeline" 
                  type="text"
                  placeholder="Expected timeline (e.g., 3 months)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Services;
