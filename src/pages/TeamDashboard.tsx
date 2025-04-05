
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart3, Users, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import ProjectCard from '@/components/dashboard/ProjectCard';
import AdminServiceAnalytics from '@/components/dashboard/AdminServiceAnalytics';
import ServiceRecommendation from '@/components/dashboard/ServiceRecommendation';
import NotificationList from '@/components/notifications/NotificationList';
import { useAuth } from '@/context/AuthContext';
import { getUserById, projects, users, getUnreadMessageCount, getProjectsByTeamMember } from '@/data/mockData';
import { getUnreadNotificationCount } from '@/data/notificationData';

const TeamDashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  
  const teamProjects = user ? (
    hasRole('admin') 
      ? projects
      : getProjectsByTeamMember(user.id)
  ) : [];
  
  const activeClients = users.filter(u => u.role === 'client' && u.active);
  
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
  const unreadMessages = user ? getUnreadMessageCount(user.id) : 0;
  const unreadNotifications = user ? getUnreadNotificationCount(user.id) : 0;

  return (
    <PageTransition className="container py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        {hasRole(['admin', 'project_manager']) && (
          <Button onClick={() => navigate('/clients')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Client
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{activeProjectsCount}</div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completedProjectsCount} completed
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{activeClients.length}</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {users.filter(u => u.role === 'client').length - activeClients.length} inactive
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card onClick={() => navigate('/messages')} className="cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{unreadMessages}</div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {unreadMessages} unread messages
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/notifications')}
          className="cursor-pointer"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{unreadNotifications}</div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {unreadNotifications} unread notifications
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AdminServiceAnalytics clients={users.filter(u => u.role === 'client')} projects={projects} />
        </div>
        <div className="space-y-6">
          <ServiceRecommendation clients={users.filter(u => u.role === 'client')} />
          <NotificationList />
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
            View all
          </Button>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="m-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamProjects
                .filter(p => p.status === 'in_progress')
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              }
              {teamProjects.filter(p => p.status === 'in_progress').length === 0 && (
                <Card className="col-span-full bg-muted/50">
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No active projects</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="planning" className="m-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamProjects
                .filter(p => p.status === 'planning')
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              }
              {teamProjects.filter(p => p.status === 'planning').length === 0 && (
                <Card className="col-span-full bg-muted/50">
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No projects in planning</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="m-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamProjects
                .filter(p => p.status === 'completed')
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              }
              {teamProjects.filter(p => p.status === 'completed').length === 0 && (
                <Card className="col-span-full bg-muted/50">
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No completed projects</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {hasRole(['admin', 'project_manager']) && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Clients</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
              View all
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {activeClients.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="divide-y">
                    {activeClients.map((client) => {
                      const clientProjects = projects.filter(p => p.clientId === client.id);
                      const projectManager = clientProjects.length > 0 
                        ? getUserById(clientProjects[0].projectManagerId) 
                        : null;
                        
                      return (
                        <div key={client.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarImage src={client.avatar} alt={client.name} />
                              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{client.name}</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  {clientProjects.length} projects
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-muted-foreground">{client.email}</span>
                                {projectManager && (
                                  <span className="text-xs text-muted-foreground">
                                    PM: {projectManager.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No active clients</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PageTransition>
  );
};

export default TeamDashboard;
