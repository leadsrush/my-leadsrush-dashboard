
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PageTransition from '@/components/layout/PageTransition';
import { useToast } from '@/hooks/use-toast';
import NotificationList from '@/components/notifications/NotificationList';
import { notifications } from '@/data/notificationData';
import { Notification } from '@/types/notification';
import { useAuth } from '@/context/AuthContext';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  // In a real app, we would fetch notifications from an API
  const userNotifications = notifications;
  
  // Filter notifications by type
  const filterByType = (type: string): Notification[] => {
    return userNotifications.filter(notification => notification.type === type);
  };
  
  const unreadCount = userNotifications.filter(n => !n.read).length;
  
  const handleMarkAllRead = () => {
    // In a real app, this would call an API to mark notifications as read
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications have been marked as read.`
    });
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with important events and updates</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </Button>
            )}
            
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="default">{unreadCount} Unread</Badge>
              )}
            </div>
            <CardDescription>You have {userNotifications.length} notifications</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="all">
            <CardContent className="pb-0">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="project">Projects</TabsTrigger>
                <TabsTrigger value="message">Messages</TabsTrigger>
              </TabsList>
            </CardContent>
            
            <Separator />
            
            <CardContent>
              <TabsContent value="all">
                <NotificationList notifications={userNotifications} />
              </TabsContent>
              <TabsContent value="system">
                <NotificationList notifications={filterByType('system')} />
              </TabsContent>
              <TabsContent value="project">
                <NotificationList notifications={filterByType('project')} />
              </TabsContent>
              <TabsContent value="message">
                <NotificationList notifications={filterByType('message')} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </PageTransition>
  );
};

export default NotificationsPage;
