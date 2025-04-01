
import React, { useState, useEffect } from 'react';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Calendar } from 'lucide-react';
import { users, generateInvoiceNumber } from '@/data/mockData';

// The form schema
const formSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  number: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(1, "Unit price must be at least 1"),
  })).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  onInvoiceCreated: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onInvoiceCreated }) => {
  const [items, setItems] = useState<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  
  const [total, setTotal] = useState(0);
  
  // Get clients for dropdown
  const clients = users.filter(user => user.role === 'client' && user.active);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      number: generateInvoiceNumber(),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
    },
  });
  
  // Update total when items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.total, 0);
    setTotal(newTotal);
  }, [items]);
  
  // Handle adding a new item
  const handleAddItem = () => {
    setItems([
      ...items, 
      { 
        id: String(items.length + 1), 
        description: '', 
        quantity: 1, 
        unitPrice: 0, 
        total: 0 
      }
    ]);
  };
  
  // Handle removing an item
  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };
  
  // Handle updating an item
  const handleItemChange = (id: string, field: string, value: string) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: field === 'description' ? value : Number(value) };
        
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Update form values for validation
    const formItems = updatedItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
    
    form.setValue('items', formItems);
  };
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Create the invoice object
    const invoice = {
      ...data,
      id: String(Math.random()).substring(2, 10),
      status: 'pending',
      total,
      items: items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    };
    
    // Call the onInvoiceCreated callback
    onInvoiceCreated();
    
    // Reset the form
    form.reset();
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value.toString()} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="date" 
                      {...field} 
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="date" 
                      {...field} 
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">Invoice Items</h3>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-6">
                  <FormItem>
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
                <div className="col-span-2">
                  <FormItem>
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>
                      Qty
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
                <div className="col-span-2">
                  <FormItem>
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
                <div className="col-span-1">
                  <FormItem>
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>
                      Total
                    </FormLabel>
                    <div className="h-10 flex items-center font-medium">
                      ${item.total.toFixed(2)}
                    </div>
                  </FormItem>
                </div>
                
                <div className="col-span-1">
                  <FormItem>
                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>
                      &nbsp;
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </FormItem>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-md">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional notes for the client"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
            <div className="text-2xl font-bold">${total.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Create Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
