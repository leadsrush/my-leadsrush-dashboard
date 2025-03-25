
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  ArrowLeft,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Invoice, 
  User, 
  invoices, 
  users, 
  getInvoiceById,
  generateInvoiceNumber
} from '@/data/mockData';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const AdminInvoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([...invoices]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    // Filter users to only show clients
    const filteredClients = users.filter(user => user.role === 'client' && user.active);
    setClientUsers(filteredClients);
  }, []);

  const filteredInvoices = invoicesList.filter(invoice => {
    const client = users.find(user => user.id === invoice.clientId);
    const clientName = client?.name.toLowerCase() || '';
    const invoiceNumber = invoice.number.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return clientName.includes(query) || invoiceNumber.includes(query);
  });

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    // Find and update the invoice in our local state
    const updatedInvoices = invoicesList.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: 'paid' as const } : invoice
    );
    
    // Also update the original array
    const originalInvoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
    if (originalInvoiceIndex !== -1) {
      invoices[originalInvoiceIndex].status = 'paid';
    }
    
    setInvoicesList(updatedInvoices);
    
    toast({
      title: "Invoice marked as paid",
      description: "The invoice has been successfully marked as paid.",
    });
  };

  // Create invoice form schema
  const invoiceFormSchema = z.object({
    clientId: z.string({
      required_error: "Please select a client",
    }),
    dueDate: z.string({
      required_error: "Please select a due date",
    }),
    items: z.array(z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.coerce.number().min(0, "Price must be a positive number"),
    })).min(1, "At least one item is required"),
    notes: z.string().optional(),
  });

  type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
    },
  });

  const { watch, setValue } = form;
  const items = watch('items');

  const calculateItemTotal = (item: { quantity: number; unitPrice: number }) => {
    return item.quantity * item.unitPrice;
  };

  const calculateInvoiceTotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const addInvoiceItem = () => {
    setValue('items', [...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (items.length > 1) {
      setValue('items', items.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (values: InvoiceFormValues) => {
    // Generate item IDs and calculate totals
    const invoiceItems = values.items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: calculateItemTotal(item)
    }));

    // Create the new invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: generateInvoiceNumber(),
      clientId: values.clientId,
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: values.dueDate,
      items: invoiceItems,
      status: 'pending',
      total: invoiceItems.reduce((sum, item) => sum + item.total, 0),
      notes: values.notes
    };

    // Update both the local state and the original array
    setInvoicesList([newInvoice, ...invoicesList]);
    invoices.unshift(newInvoice);

    // Close the dialog and show a success message
    setIsCreateDialogOpen(false);
    form.reset();

    toast({
      title: "Invoice created",
      description: `Invoice ${newInvoice.number} has been created and sent to the client.`,
    });
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
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">
              Manage client invoices and payments
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => {
                const client = users.find(user => user.id === invoice.clientId);
                
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {invoice.number}
                      </div>
                    </TableCell>
                    <TableCell>{client?.name || 'Unknown Client'}</TableCell>
                    <TableCell>{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>${invoice.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'outline'}>
                        {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        
                        {invoice.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="text-green-500 border-green-500 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Mark as Paid</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice #{selectedInvoice?.number}</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-1">From</h4>
                  <p className="text-sm">LeadsRush Marketing Agency</p>
                  <p className="text-sm text-muted-foreground">123 Business Ave, Suite 100</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">To</h4>
                  <p className="text-sm">
                    {users.find(user => user.id === selectedInvoice.clientId)?.name || 'Unknown Client'}
                  </p>
                  <p className="text-sm text-muted-foreground">Client Address Line 1</p>
                  <p className="text-sm text-muted-foreground">Client City, State ZIP</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Invoice Number</h4>
                  <p className="text-sm">{selectedInvoice.number}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Issue Date</h4>
                  <p className="text-sm">{format(new Date(selectedInvoice.issueDate), 'MMMM dd, yyyy')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Due Date</h4>
                  <p className="text-sm">{format(new Date(selectedInvoice.dueDate), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-medium">${selectedInvoice.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {selectedInvoice.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Badge variant={selectedInvoice.status === 'paid' ? 'success' : 'outline'} className="text-sm py-1 px-3">
                  {selectedInvoice.status === 'paid' ? 'Paid' : 'Pending Payment'}
                </Badge>
                
                {selectedInvoice.status === 'pending' && (
                  <Button 
                    onClick={() => {
                      handleMarkAsPaid(selectedInvoice.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Invoice Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) form.reset();
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          {clientUsers.map((client) => (
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
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Invoice Items</h4>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addInvoiceItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {items.map((_, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={index !== 0 ? 'sr-only' : undefined}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Service description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="w-20">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={index !== 0 ? 'sr-only' : undefined}>
                                Qty
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  min="1" 
                                  placeholder="Qty"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="w-32">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={index !== 0 ? 'sr-only' : undefined}>
                                Price
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  min="0" 
                                  step="0.01" 
                                  placeholder="0.00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="w-32 flex flex-col">
                        <FormLabel className={index !== 0 ? 'sr-only' : undefined}>
                          Total
                        </FormLabel>
                        <div className="h-10 flex items-center">
                          ${calculateItemTotal(items[index]).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="pt-8">
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInvoiceItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-2">
                  <div className="w-32 text-right font-medium">
                    Total: ${calculateInvoiceTotal().toFixed(2)}
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Additional notes to client (optional)" 
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Invoice</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default AdminInvoices;
