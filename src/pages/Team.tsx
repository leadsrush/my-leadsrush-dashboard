
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, PlusCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: "Emma Rodriguez",
    role: "Project Manager",
    email: "emma@leadsrush.com",
    phone: "+1 (555) 123-4567",
    department: "Management",
    projects: 5,
    avatar: "ER"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Developer",
    email: "michael@leadsrush.com",
    phone: "+1 (555) 234-5678",
    department: "Development",
    projects: 3,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "UX Designer",
    email: "sarah@leadsrush.com",
    phone: "+1 (555) 345-6789",
    department: "Design",
    projects: 4,
    avatar: "SJ"
  },
  {
    id: 4,
    name: "David Williams",
    role: "Marketing Specialist",
    email: "david@leadsrush.com",
    phone: "+1 (555) 456-7890",
    department: "Marketing",
    projects: 2,
    avatar: "DW"
  },
  {
    id: 5,
    name: "Jessica Brown",
    role: "Content Strategist",
    email: "jessica@leadsrush.com",
    phone: "+1 (555) 567-8901",
    department: "Marketing",
    projects: 3,
    avatar: "JB"
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Backend Developer",
    email: "robert@leadsrush.com",
    phone: "+1 (555) 678-9012",
    department: "Development",
    projects: 2,
    avatar: "RK"
  }
];

const Team = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const departments = ["Management", "Development", "Design", "Marketing"];

  const filteredTeamMembers = mockTeamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && member.department.toLowerCase() === activeTab.toLowerCase();
  });

  const handleAddTeamMember = () => {
    toast({
      title: "Feature not implemented",
      description: "Adding new team members is not available in this demo.",
      variant: "destructive"
    });
  };

  const handleContact = (type: string, value: string) => {
    toast({
      title: `${type} Information`,
      description: value
    });
  };

  return (
    <PageTransition>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Team Members</h1>
          <Button onClick={handleAddTeamMember} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {departments.map(dept => (
              <TabsTrigger key={dept} value={dept.toLowerCase()}>{dept}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeamMembers.length > 0 ? (
            filteredTeamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="p-4 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-2 text-xl">
                    <span>{member.avatar}</span>
                  </Avatar>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-2 inline-block">
                    {member.department}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm">
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">Active Projects:</span>
                      <span className="font-medium">{member.projects}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContact("Email", member.email)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContact("Phone", member.phone)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center col-span-full">
              <p className="text-muted-foreground">No team members found matching your search.</p>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Team;
