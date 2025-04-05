
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { users } from '@/data/mockData';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientAddFormProps {
  onSuccess: () => void;
}

const ClientAddForm: React.FC<ClientAddFormProps> = ({ onSuccess }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      active: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would be an API call to create a new client
    const newClient = {
      id: `client${users.length + 1}`,
      name: data.name,
      email: data.email,
      role: 'client' as const,
      active: data.active,
    };
    
    // For this demo, we'd add to the mock data
    // However, since mockData is imported, changes won't persist between page refreshes
    users.push(newClient);
    
    console.log('Added new client:', newClient);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="client@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3">
              <div>
                <FormLabel>Active Status</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Is this client currently active?
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit">Add Client</Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientAddForm;
