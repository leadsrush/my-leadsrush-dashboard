
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search } from "lucide-react";

// Mock client data
const mockClients = [
  {
    id: 1,
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john@acmecorp.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    projects: 3
  },
  {
    id: 2,
    name: "Globex Industries",
    contact: "Jane Doe",
    email: "jane@globex.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    projects: 2
  },
  {
    id: 3,
    name: "Stark Enterprises",
    contact: "Tony Stark",
    email: "tony@stark.com",
    phone: "+1 (555) 111-2222",
    status: "inactive",
    projects: 0
  },
  {
    id: 4,
    name: "Wayne Enterprises",
    contact: "Bruce Wayne",
    email: "bruce@wayne.com",
    phone: "+1 (555) 333-4444",
    status: "active",
    projects: 1
  },
  {
    id: 5,
    name: "Umbrella Corporation",
    contact: "Albert Wesker",
    email: "wesker@umbrella.com",
    phone: "+1 (555) 666-7777",
    status: "pending",
    projects: 1
  }
];

const Clients = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    toast({
      title: "Feature not implemented",
      description: "Adding new clients is not available in this demo.",
      variant: "destructive"
    });
  };

  const handleViewClient = (clientId: number) => {
    toast({
      title: "Feature not implemented",
      description: `Viewing client details for ID: ${clientId} is not available in this demo.`
    });
  };

  return (
    <PageTransition>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Button onClick={handleAddClient} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Client
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                        <span>{client.name.charAt(0)}</span>
                      </Avatar>
                      <div>
                        <div>{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.contact}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' :
                        client.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-y-2 mb-4">
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span>{client.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone: </span>
                      <span>{client.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Active Projects: </span>
                      <span>{client.projects}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewClient(client.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No clients found matching your search.</p>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Clients;
