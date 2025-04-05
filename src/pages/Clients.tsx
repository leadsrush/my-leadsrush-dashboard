
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Search, PlusCircle, MessageSquare } from "lucide-react";
import { users } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ClientAddForm from "@/components/clients/ClientAddForm";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const clients = users.filter(user => user.role === 'client');
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewClientDetails = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleSendMessage = (clientId: string) => {
    navigate(`/client-message/${clientId}`);
  };
  
  return (
    <PageTransition>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          
          <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <ClientAddForm 
                onSuccess={() => {
                  setShowAddClientDialog(false);
                  toast({
                    title: "Success",
                    description: "Client added successfully",
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 text-center cursor-pointer" 
                  onClick={() => handleViewClientDetails(client.id)}>
                  <Avatar className="h-20 w-20 mx-auto mb-2 text-xl">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{client.name.split(' ').map(n => n[0]).join('')}</span>
                    )}
                  </Avatar>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{client.email}</div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between mt-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${client.active ? 'text-green-500' : 'text-red-500'}`}>
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(client.id);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Send a Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center col-span-full">
              <p className="text-muted-foreground">No clients found.</p>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Clients;
