
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Edit, 
  MessageSquare, 
  MoreHorizontal, 
  User,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import PageTransition from '@/components/layout/PageTransition';
import MessageThread from '@/components/dashboard/MessageThread';
import { useAuth } from '@/context/AuthContext';
import { getProjectById, getUserById, getServiceById, getMessagesByUser } from '@/data/mockData';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get project data
  const project = projectId ? getProjectById(projectId) : null;
  
  if (!project) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="mb-4 text-muted-foreground">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  // Get additional data
  const client = getUserById(project.clientId);
  const projectManager = getUserById(project.projectManagerId);
  const teamMembers = project.teamMemberIds.map(id => getUserById(id)).filter(Boolean);
  const services = project.serviceIds.map(id => getServiceById(id)).filter(Boolean);
  
  // Format dates
  const formattedStartDate = format(new Date(project.startDate), 'MMM d, yyyy');
  const formattedEndDate = project.endDate 
    ? format(new Date(project.endDate), 'MMM d, yyyy')
    : 'Ongoing';
    
  // Get project messages
  const projectMessages = getMessagesByUser(user?.id || '')
    .filter(msg => msg.projectId === project.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Mocked function to send a message
  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
    // In a real app, this would send the message to the backend
  };

  return (
    <PageTransition className="container py-6 max-w-7xl">
      {/* Header */}
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
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted-foreground mt-1">
              {client?.name} • Started on {formattedStartDate}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => setActiveTab('messages')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            
            {hasRole(['admin', 'project_manager']) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Team
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Archive Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Project Progress & Info */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Progress Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>
                  Current status and timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall completion</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Timeline</h4>
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Start Date</div>
                        <div className="text-sm text-muted-foreground">{formattedStartDate}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">End Date</div>
                        <div className="text-sm text-muted-foreground">{formattedEndDate}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Services</h4>
                    {services.map(service => (
                      <div key={service.id} className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Team Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>
                  Team members working on this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Project Manager</h4>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={projectManager?.avatar} alt={projectManager?.name} />
                      <AvatarFallback>{projectManager?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{projectManager?.name}</div>
                      <div className="text-xs text-muted-foreground">{projectManager?.email}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Team Members</h4>
                  <div className="space-y-3">
                    {teamMembers.map(member => (
                      <div key={member?.id} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={member?.avatar} alt={member?.name} />
                          <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{member?.name}</div>
                          <div className="text-xs text-muted-foreground">{member?.email}</div>
                        </div>
                      </div>
                    ))}
                    
                    {teamMembers.length === 0 && (
                      <p className="text-sm text-muted-foreground">No additional team members</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Client</h4>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={client?.avatar} alt={client?.name} />
                      <AvatarFallback>{client?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{client?.name}</div>
                      <div className="text-xs text-muted-foreground">{client?.email}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Project tasks and their current status
                </CardDescription>
              </div>
              {hasRole(['admin', 'project_manager', 'team_member']) && (
                <Button size="sm">
                  Add Task
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {project.tasks.map(task => {
                    const assignee = getUserById(task.assigneeId);
                    
                    return (
                      <Card key={task.id} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{task.title}</div>
                            <StatusBadge status={task.status} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {task.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-xs">{assignee?.name}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-xs">
                                  Due: {format(new Date(task.dueDate), 'MMM d')}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {project.tasks.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No tasks have been added yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Project Messages</CardTitle>
              <CardDescription>
                Communicate with your team about this project
              </CardDescription>
            </CardHeader>
            <MessageThread 
              messages={projectMessages}
              onSendMessage={handleSendMessage}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
};

export default ProjectDetails;
