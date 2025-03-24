
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, Save, X } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import Icon from '@/components/ui/icon-mapper';
import { Service, services as originalServices, IconName } from '@/data/mockData';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const serviceFormSchema = z.object({
  id: z.string().min(1, "Service ID is required"),
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.enum(['search', 'mouse-pointer-click', 'file-text', 'share-2', 'bar-chart'] as const),
  features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required"),
  price: z.number().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const AdminServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [servicesList, setServicesList] = useState<Service[]>([...originalServices]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [newFeature, setNewFeature] = useState('');
  
  const iconOptions: { value: IconName; label: string }[] = [
    { value: 'search', label: 'Search' },
    { value: 'mouse-pointer-click', label: 'Click' },
    { value: 'file-text', label: 'Document' },
    { value: 'share-2', label: 'Share' },
    { value: 'bar-chart', label: 'Chart' },
  ];

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      icon: 'search',
      features: [''],
      price: undefined,
    },
  });

  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      form.reset({
        id: service.id,
        name: service.name,
        description: service.description,
        icon: service.icon,
        features: service.features,
        price: service.price,
      });
    } else {
      setEditingService(null);
      form.reset({
        id: `service-${Date.now()}`,
        name: '',
        description: '',
        icon: 'search',
        features: [''],
        price: undefined,
      });
    }
    setIsDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues('features') || [];
      form.setValue('features', [...currentFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features') || [];
    if (currentFeatures.length > 1) {
      form.setValue('features', 
        currentFeatures.filter((_, i) => i !== index)
      );
    }
  };

  const confirmDelete = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (serviceToDelete) {
      // Remove from original services array
      const serviceIndex = originalServices.findIndex(s => s.id === serviceToDelete.id);
      if (serviceIndex !== -1) {
        originalServices.splice(serviceIndex, 1);
      }
      
      // Update local state
      const updatedServices = servicesList.filter(service => service.id !== serviceToDelete.id);
      setServicesList(updatedServices);
      
      toast({
        title: "Service deleted",
        description: `${serviceToDelete.name} has been removed.`,
      });
      
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const onSubmit = (values: ServiceFormValues) => {
    const formattedService: Service = {
      id: values.id,
      name: values.name,
      description: values.description,
      icon: values.icon,
      features: values.features,
      price: values.price
    };
    
    if (editingService) {
      // Update existing service
      const updatedServices = servicesList.map(service => 
        service.id === values.id ? formattedService : service
      );
      setServicesList(updatedServices);
      
      // Update in the original services array
      const serviceIndex = originalServices.findIndex(s => s.id === values.id);
      if (serviceIndex !== -1) {
        originalServices[serviceIndex] = formattedService;
      } else {
        // If not found (shouldn't happen), add it
        originalServices.push(formattedService);
      }
      
      toast({
        title: "Service updated",
        description: "Your changes have been saved.",
      });
    } else {
      // Add new service
      setServicesList([...servicesList, formattedService]);
      
      // Add to the original services array
      originalServices.push(formattedService);
      
      toast({
        title: "Service created",
        description: "The new service has been added.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <PageTransition className="container py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Services</h1>
        <p className="text-muted-foreground">
          Add, edit, or remove marketing services available to clients
        </p>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => openServiceDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden md:table-cell">Features</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicesList.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="p-2 rounded-full bg-primary/10 text-primary w-8 h-8 flex items-center justify-center">
                    <Icon name={service.icon} className="h-4 w-4" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm max-w-[300px] truncate">
                  {service.description}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-xs text-muted-foreground">
                    {service.features.length} features
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openServiceDialog(service)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => confirmDelete(service)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Service Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService 
                ? 'Update the details for this service' 
                : 'Fill out the form to add a new service to your portfolio'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SEO Optimization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the service in detail" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center">
                                <Icon name={icon.value} className="mr-2 h-4 w-4" />
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <Label>Features</Label>
                <div className="space-y-2 mt-2">
                  {form.watch('features').map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input 
                        value={feature}
                        onChange={(e) => {
                          const updatedFeatures = [...form.getValues('features')];
                          updatedFeatures[index] = e.target.value;
                          form.setValue('features', updatedFeatures);
                        }}
                        placeholder="e.g., Keyword research"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFeature(index)}
                        disabled={form.watch('features').length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Input 
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add another feature"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addFeature}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 999"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Service</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {serviceToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default AdminServices;
