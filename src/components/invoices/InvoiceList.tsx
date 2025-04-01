
import React, { useState } from 'react';
import { Search, Download, MoreHorizontal, FileCheck, FileClock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Invoice, InvoiceStatus, invoices, getUserById } from '@/data/mockData';

interface InvoiceListProps {
  filterStatus: InvoiceStatus | null;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ filterStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter invoices based on status and search query
  const filteredInvoices = invoices.filter(invoice => {
    // Apply status filter if provided
    if (filterStatus && invoice.status !== filterStatus) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const client = getUserById(invoice.clientId);
      return (
        invoice.number.toLowerCase().includes(query) ||
        (client && client.name.toLowerCase().includes(query)) ||
        (client && client.email.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleMarkAsPaid = (invoiceId: string) => {
    const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
    if (invoiceIndex >= 0) {
      invoices[invoiceIndex].status = 'paid';
      toast({
        title: "Success",
        description: `Invoice ${invoices[invoiceIndex].number} marked as paid.`,
      });
    }
  };

  const handleResendInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      const client = getUserById(invoice.clientId);
      toast({
        title: "Invoice Resent",
        description: `Invoice ${invoice.number} has been resent to ${client?.name}.`,
      });
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: "Your invoice PDF is being generated and will download shortly.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {filterStatus 
            ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Invoices` 
            : 'All Invoices'}
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No invoices found. {!filterStatus && "Create a new invoice to get started."}
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your invoices.</TableCaption>
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
            {filteredInvoices.map((invoice) => {
              const client = getUserById(invoice.clientId);
              
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>
                    {client ? (
                      <div>
                        <div>{client.name}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </div>
                    ) : (
                      "Unknown Client"
                    )}
                  </TableCell>
                  <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                      {invoice.status === 'paid' ? 
                        <FileCheck className="h-3 w-3 mr-1" /> : 
                        <FileClock className="h-3 w-3 mr-1" />
                      }
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        {invoice.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                            <FileCheck className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleResendInvoice(invoice.id)}>
                          Resend to Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default InvoiceList;
