import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  CalendarIcon,
  FileText,
  Check,
  AlertTriangle,
  Clock,
  Filter,
  Trash2,
  Send,
  DollarSign,
  ChevronDown,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from '@/components/ui/StatusBadge';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/context/AuthContext';
import InvoiceList from '@/components/invoices/InvoiceList';

// Mock data for client invoices
const clientInvoices = [
  {
    id: 'INV-001',
    amount: 2500,
    status: 'paid',
    dueDate: '2024-05-15',
    issueDate: '2024-04-15',
    project: 'Website Redesign',
  },
  {
    id: 'INV-002',
    amount: 1800,
    status: 'pending',
    dueDate: '2024-05-20',
    issueDate: '2024-04-20',
    project: 'SEO Services',
  },
  {
    id: 'INV-003',
    amount: 3200,
    status: 'overdue',
    dueDate: '2024-04-25',
    issueDate: '2024-04-01',
    project: 'Social Media Campaign',
  },
  {
    id: 'INV-004',
    amount: 950,
    status: 'paid',
    dueDate: '2024-04-10',
    issueDate: '2024-03-20',
    project: 'Content Writing',
  },
  {
    id: 'INV-005',
    amount: 4500,
    status: 'draft',
    dueDate: '2024-05-30',
    issueDate: '2024-04-25',
    project: 'E-commerce Development',
  },
];

// Invoice status config
const statusConfig = {
  paid: {
    label: 'Paid',
    icon: Check,
    color: 'success'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'warning'
  },
  overdue: {
    label: 'Overdue',
    icon: AlertTriangle,
    color: 'destructive'
  },
  draft: {
    label: 'Draft',
    icon: FileText,
    color: 'default'
  }
};

// Component for filter sheet
const FilterSheet = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Invoices</SheetTitle>
          <SheetDescription>
            Narrow down your invoice list using these filters.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Invoice Status</h3>
            <div className="space-y-1">
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input type="checkbox" id={`status-${key}`} className="rounded" />
                  <label htmlFor={`status-${key}`} className="text-sm">{label}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Amount Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="min-amount" className="text-xs">Min</label>
                <input type="number" id="min-amount" className="w-full rounded border p-2 text-sm" placeholder="0" />
              </div>
              <div>
                <label htmlFor="max-amount" className="text-xs">Max</label>
                <input type="number" id="max-amount" className="w-full rounded border p-2 text-sm" placeholder="5000" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">Apply Filters</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ClientInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('issueDate');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  
  // Filter invoices based on selected status
  const filteredInvoices = selectedStatus
    ? clientInvoices.filter(invoice => invoice.status === selectedStatus)
    : clientInvoices;
  
  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    if (sortBy === 'dueDate') {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    // Default: sort by issueDate
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });
  
  // Stats calculations
  const totalPaid = clientInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const totalPending = clientInvoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const totalOverdue = clientInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const handlePayInvoice = (invoiceId: string) => {
    toast({
      title: "Payment initiated",
      description: `Payment for invoice ${invoiceId} has been initiated.`,
    });
  };

  return (
    <PageTransition>
      <div className="container py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Invoices</h1>
          <p className="text-muted-foreground">
            View and manage all your invoices in one place
          </p>
        </header>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Due</p>
                <h3 className="text-2xl font-bold">${totalPending + totalOverdue}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <h3 className="text-2xl font-bold">${totalPaid}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">${totalPending}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <h3 className="text-2xl font-bold">${totalOverdue}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Invoice list */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Invoices</CardTitle>
              
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="issueDate">Issue Date</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowFilter(true)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardDescription>
              {selectedStatus ? `Showing ${statusConfig[selectedStatus as keyof typeof statusConfig].label} invoices` : "Showing all invoices"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex space-x-2 overflow-auto pb-2 mb-4">
              <Button
                variant={selectedStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(null)}
              >
                All
              </Button>
              
              {Object.entries(statusConfig).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant={selectedStatus === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(key)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={invoice.status}
                          statusConfig={{
                            paid: { label: "Paid", variant: "success" },
                            pending: { label: "Pending", variant: "warning" },
                            overdue: { label: "Overdue", variant: "destructive" },
                            draft: { label: "Draft", variant: "default" },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.project}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download PDF</span>
                            </DropdownMenuItem>
                            {invoice.status === 'pending' && (
                              <DropdownMenuItem
                                onClick={() => handlePayInvoice(invoice.id)}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Pay Now</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {sortedInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {sortedInvoices.length} of {clientInvoices.length} invoices
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </CardFooter>
        </Card>
        
        {/* Invoice detail sheet */}
        {selectedInvoice && (
          <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center">
                  <span>Invoice {selectedInvoice.id}</span>
                  <StatusBadge
                    status={selectedInvoice.status}
                    statusConfig={{
                      paid: { label: "Paid", variant: "success" },
                      pending: { label: "Pending", variant: "warning" },
                      overdue: { label: "Overdue", variant: "destructive" },
                      draft: { label: "Draft", variant: "default" },
                    }}
                  />
                </SheetTitle>
                <SheetDescription>
                  {selectedInvoice.project}
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-semibold">Amount Due</h3>
                      <p className="text-2xl font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                      <p>{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground mt-2">Due Date</p>
                      <p>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Invoice From</h3>
                    <p>LeadsRush Africa</p>
                    <p>123 Business Street</p>
                    <p>Cape Town, South Africa</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Invoice To</h3>
                    <p>{user?.profile?.name || 'Client'}</p>
                    <p>Client Company Ltd</p>
                    <p>{user?.profile?.email || 'client@example.com'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Items</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>{selectedInvoice.project}</TableCell>
                            <TableCell className="text-right">${selectedInvoice.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  {selectedInvoice.status === 'pending' && (
                    <Button className="w-full" onClick={() => handlePayInvoice(selectedInvoice.id)}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Invoice
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Filter sheet */}
        <FilterSheet open={showFilter} onOpenChange={setShowFilter} />
      </div>
    </PageTransition>
  );
};

export default ClientInvoices;
