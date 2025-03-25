
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Search, Eye, Clock, CheckCircle } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { 
  Invoice, 
  getInvoicesByClient, 
  getPendingInvoicesByClient,
  getPaidInvoicesByClient,
  getTotalPaidByClient,
  getTotalPendingByClient,
  users 
} from '@/data/mockData';

const ClientInvoices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  if (!user) return null;
  
  const clientId = user.id;
  const allInvoices = getInvoicesByClient(clientId);
  const pendingInvoices = getPendingInvoicesByClient(clientId);
  const paidInvoices = getPaidInvoicesByClient(clientId);
  const totalPaid = getTotalPaidByClient(clientId);
  const totalPending = getTotalPendingByClient(clientId);
  
  let displayedInvoices: Invoice[] = [];
  
  switch (activeTab) {
    case 'pending':
      displayedInvoices = pendingInvoices;
      break;
    case 'paid':
      displayedInvoices = paidInvoices;
      break;
    default:
      displayedInvoices = allInvoices;
  }
  
  const filteredInvoices = displayedInvoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
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
        
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          View and manage your invoices
        </p>
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid
            </CardTitle>
            <CardDescription>
              Lifetime payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {paidInvoices.length} invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balance
            </CardTitle>
            <CardDescription>
              Pending payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {pendingInvoices.length} invoices
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-1.5">
              Pending
              {pendingInvoices.length > 0 && (
                <Badge variant="outline" className="ml-1">
                  {pendingInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {invoice.number}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'paid' ? 'success' : 'outline'}>
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                  <p className="text-sm">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default ClientInvoices;
