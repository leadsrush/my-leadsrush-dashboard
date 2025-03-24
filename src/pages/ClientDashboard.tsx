
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageTransition from '@/components/layout/PageTransition';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { useAuth } from '@/context/AuthContext';
import { getProjectsByClient, getUnreadMessageCount, getMessagesByUser, Project, services } from '@/data/mockData';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get client projects
  const clientProjects = user ? getProjectsByClient(user.id) : [];
  const unreadMessages = user ? getUnreadMessageCount(user.id) : 0;
  const recentMessages = user ? getMessagesByUser(user.id).slice(0, 3) : [];
  
  // Calculate overall progress
  const calculateOverallProgress = (projects: Project[]) => {
    if (projects.length === 0) return 0;
    const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0);
    return Math.round(totalProgress / projects.length);
  };
  
  const overallProgress = calculateOverallProgress(clientProjects);

  return (
    <PageTransition className="container py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Button onClick={() => navigate('/services')}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      {/* Dashboard cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <Progress value={overallProgress} className="h-2 mt-2" />
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
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{clientProjects.length}</div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {clientProjects.filter(p => p.status === 'in_progress').length} in progress
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/messages')}
          className="cursor-pointer"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{unreadMessages}</div>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {unreadMessages} unread messages
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Projects section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
            View all
          </Button>
        </div>
        
        {clientProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clientProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">You don't have any projects yet</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/services')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Start a new project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Recent messages section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Messages</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
            View all
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {recentMessages.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="divide-y">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{message.senderId === user?.id ? 'You' : 'Team'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-1">{message.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No recent messages</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ClientDashboard;
