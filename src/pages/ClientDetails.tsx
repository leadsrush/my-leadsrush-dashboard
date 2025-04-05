
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, BarChart3, FileText } from 'lucide-react';
import { 
  getUserById, 
  getProjectsByClient, 
  getInvoicesByClient,
  getTotalPaidByClient,
  getTotalPendingByClient
} from '@/data/mockData';
import ProjectCard from '@/components/dashboard/ProjectCard';
import InvoiceSummary from '@/components/dashboard/InvoiceSummary';

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  const client = clientId ? getUserById(clientId) : null;
  const clientProjects = clientId ? getProjectsByClient(clientId) : [];
  const clientInvoices = clientId ? getInvoicesByClient(clientId) : [];
  const totalPaid = clientId ? getTotalPaidByClient(clientId) : 0;
  const totalPending = clientId ? getTotalPendingByClient(clientId) : 0;
  
  if (!client) {
    return (
      <PageTransition>
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Client Not Found</h1>
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container py-8">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 text-2xl">
                {client.avatar ? (
                  <img src={client.avatar} alt={client.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{client.name.split(' ').map(n => n[0]).join('')}</span>
                )}
              </Avatar>
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <CardDescription>{client.email}</CardDescription>
              <div className="mt-2">
                <Badge variant={client.active ? "default" : "destructive"}>
                  {client.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/client-message/${client.id}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Send a Message
                </Button>
              </div>
              
              {/* Client Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm">Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-2xl font-bold">{clientProjects.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm">Invoices</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-2xl font-bold">{clientInvoices.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm text-green-600">Paid</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm text-amber-600">Pending</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          {/* Client Details Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects">
              <TabsList className="mb-4">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" /> Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientProjects.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {clientProjects.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No projects found for this client</p>
                        <Button className="mt-4">Create New Project</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" /> Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InvoiceSummary recentInvoices={clientInvoices} clientId={client.id} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* For this demo, we'll show placeholder activity */}
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="bg-muted rounded-full p-2">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Invoice #INV-2023-001 Paid</p>
                          <p className="text-sm text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="bg-muted rounded-full p-2">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Message sent regarding project timeline</p>
                          <p className="text-sm text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClientDetails;
