import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast"

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const AdminInvoices = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({ description: '', quantity: 0, unitPrice: 0 });
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast()

  useEffect(() => {
    // Calculate total amount whenever invoiceItems change
    const newTotal = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    setTotalAmount(newTotal);
  }, [invoiceItems]);

  const addInvoiceItem = () => {
    if (newItem.description && newItem.quantity !== undefined && newItem.unitPrice !== undefined) {
      const item = {
        description: newItem.description,
        quantity: newItem.quantity, // Ensure quantity is defined
        unitPrice: newItem.unitPrice // Ensure unitPrice is defined
      };
      
      setInvoiceItems([...invoiceItems, item]);
      setNewItem({ description: '', quantity: 0, unitPrice: 0 });
    }
  };

  const removeInvoiceItem = (index: number) => {
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const newItems = [...invoiceItems];
    if (field === 'quantity' || field === 'unitPrice') {
      value = parseFloat(value);
      if (isNaN(value)) {
        value = 0;
      }
    }
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceItems(newItems);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!invoiceNumber || !clientName || !invoiceDate || !dueDate || invoiceItems.length === 0) {
      toast({
        title: "Error!",
        description: "Please fill in all fields and add at least one invoice item.",
        variant: "destructive",
      })
      return;
    }

    // Here you would typically send the invoice data to your backend
    const invoiceData = {
      invoiceNumber,
      clientName,
      invoiceDate,
      dueDate,
      invoiceItems,
      totalAmount
    };

    console.log('Invoice Data:', invoiceData);
    toast({
      title: "Success!",
      description: "Invoice created successfully.",
    })
    // Reset form after submit
    setInvoiceNumber('');
    setClientName('');
    setInvoiceDate('');
    setDueDate('');
    setInvoiceItems([]);
    setNewItem({ description: '', quantity: 0, unitPrice: 0 });
    setTotalAmount(0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            type="text"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
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

      <h2 className="text-xl font-semibold mb-2">Invoice Items</h2>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
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
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateInvoiceItem(index, 'unitPrice', e.target.value)}
                />
              </TableCell>
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
            <TableCell className="font-medium">${totalAmount.toFixed(2)}</TableCell>
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
          <Label htmlFor="newItemQuantity">New Item Quantity</Label>
          <Input
            type="number"
            id="newItemQuantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="newItemUnitPrice">New Item Unit Price</Label>
          <Input
            type="number"
            id="newItemUnitPrice"
            value={newItem.unitPrice}
            onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <Button className="mt-2" onClick={addInvoiceItem}>Add Item</Button>

      <div className="mt-8">
        <Button onClick={handleSubmit}>Create Invoice</Button>
      </div>
    </div>
  );
};

export default AdminInvoices;
