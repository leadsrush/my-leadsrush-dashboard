
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users, generateInvoiceNumber, invoices } from '@/data/mockData';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFormProps {
  onInvoiceCreated: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onInvoiceCreated }) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<InvoiceItem>({ description: '', quantity: 0, unitPrice: 0 });
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();
  const clients = users.filter(user => user.role === 'client');

  useEffect(() => {
    // Generate a new invoice number
    setInvoiceNumber(generateInvoiceNumber());
    
    // Set default dates
    const today = new Date();
    setInvoiceDate(today.toISOString().split('T')[0]);
    
    // Set due date to 15 days from now
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
    setDueDate(dueDate.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    // Calculate total amount whenever invoiceItems change
    const newTotal = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    setTotalAmount(newTotal);
  }, [invoiceItems]);

  const addInvoiceItem = () => {
    if (newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const item: InvoiceItem = {
        description: newItem.description,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice
      };
      
      setInvoiceItems([...invoiceItems, item]);
      setNewItem({ description: '', quantity: 0, unitPrice: 0 });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all item fields with valid values.",
        variant: "destructive",
      });
    }
  };

  const removeInvoiceItem = (index: number) => {
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceItems];
    if (field === 'quantity' || field === 'unitPrice') {
      const numValue = parseFloat(value as string);
      newItems[index] = { 
        ...newItems[index], 
        [field]: isNaN(numValue) ? 0 : numValue 
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setInvoiceItems(newItems);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!invoiceNumber || !clientId || !invoiceDate || !dueDate || invoiceItems.length === 0) {
      toast({
        title: "Error!",
        description: "Please fill in all fields and add at least one invoice item.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the invoice data to your backend
    const invoiceData = {
      id: `inv${invoices.length + 1}`,
      number: invoiceNumber,
      clientId: clientId,
      issueDate: invoiceDate,
      dueDate: dueDate,
      items: invoiceItems.map((item, index) => ({
        id: `item${index + 1}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      })),
      status: 'pending' as const,
      total: totalAmount,
      notes: 'Thank you for your business.'
    };

    console.log('Invoice Data:', invoiceData);
    
    // Simulate adding to the mock data
    // In a real app, this would be an API call
    invoices.push(invoiceData);
    
    // Notify the client (simulated)
    simulateClientNotification(clientId, invoiceNumber);
    
    // Call the success callback
    onInvoiceCreated();
    
    // Reset form after submit
    setInvoiceNumber(generateInvoiceNumber());
    setClientId('');
    setInvoiceItems([]);
    setNewItem({ description: '', quantity: 0, unitPrice: 0 });
  };

  const simulateClientNotification = (clientId: string, invoiceNumber: string) => {
    const client = users.find(user => user.id === clientId);
    if (client) {
      console.log(`Notification sent to ${client.name} (${client.email}) for invoice ${invoiceNumber}`);
      // In a real application, this would trigger an email or notification
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            type="text"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            readOnly
            className="bg-muted"
          />
        </div>
        <div>
          <Label htmlFor="clientName">Select Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <Input
            type="date"
            id="invoiceDate"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>

      <Table>
        <TableCaption>List of items in this invoice</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price ($)</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)}
                  min="1"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateInvoiceItem(index, 'unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </TableCell>
              <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => removeInvoiceItem(index)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Amount:</TableCell>
            <TableCell className="font-medium" colSpan={2}>${totalAmount.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <Label htmlFor="newItemDescription">New Item Description</Label>
          <Input
            type="text"
            id="newItemDescription"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="newItemQuantity">Quantity</Label>
          <Input
            type="number"
            id="newItemQuantity"
            value={newItem.quantity || ''}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="newItemUnitPrice">Unit Price ($)</Label>
          <Input
            type="number"
            id="newItemUnitPrice"
            value={newItem.unitPrice || ''}
            onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <Button className="mt-2" onClick={addInvoiceItem}>Add Item</Button>

      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={handleSubmit}>Create & Send Invoice</Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
