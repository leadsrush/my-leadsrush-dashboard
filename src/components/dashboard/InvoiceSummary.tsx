
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Invoice, getTotalPendingByClient } from '@/data/mockData';

interface InvoiceSummaryProps {
  recentInvoices: Invoice[];
  clientId: string;
}

const InvoiceSummary = ({ recentInvoices, clientId }: InvoiceSummaryProps) => {
  const navigate = useNavigate();
  const pendingTotal = getTotalPendingByClient(clientId);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Invoices</CardTitle>
          {pendingTotal > 0 && (
            <Badge variant="outline" className="font-medium">
              ${pendingTotal.toFixed(2)} due
            </Badge>
          )}
        </div>
        <CardDescription>
          Your recent and upcoming invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        {recentInvoices.length > 0 ? (
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-1">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {invoice.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ${invoice.total.toFixed(2)}
                  </span>
                  <Badge variant={invoice.status === 'paid' ? 'success' : 'outline'} className="text-xs">
                    {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No recent invoices</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/invoices')}
        >
          View all invoices
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceSummary;
