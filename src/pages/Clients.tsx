
import React from "react";
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
import { Search, PlusCircle, Mail, Phone } from "lucide-react";
import { users } from "@/data/mockData";

const Clients = () => {
  const clients = users.filter(user => user.role === 'client');
  
  return (
    <PageTransition>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add New Client
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-10" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.length > 0 ? (
            clients.map((client) => (
              <Card key={client.id}>
                <CardHeader className="p-4 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-2 text-xl">
                    <span>{client.name.split(' ').map(n => n[0]).join('')}</span>
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
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
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
