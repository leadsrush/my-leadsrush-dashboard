
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';
import NotificationList from '@/components/notifications/NotificationList';

// Import mock notification data if needed
import { mockNotifications } from '@/data/notificationData';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  const messageNotifications = notifications.filter(n => n.type === 'message');
  const projectNotifications = notifications.filter(n => n.type === 'project');
  const systemNotifications = notifications.filter(n => n.type === 'system');
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        // Use mock data if not authenticated
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('userid', user.id)
          .order('createdat', { ascending: false });
          
        if (error) {
          console.error('Error fetching notifications:', error);
          // Fall back to mock data in case of error
          setNotifications(mockNotifications);
        } else if (data) {
          // Transform the data to match the Notification interface
          const transformedData = data.map((item: any): Notification => ({
            id: item.id,
            userId: item.userid,
            read: item.read,
            createdAt: item.createdat,
            type: item.type as any,
            title: item.title,
            content: item.content,
            link: item.link
          }));
          setNotifications(transformedData);
        }
      } catch (error) {
        console.error('Exception fetching notifications:', error);
        setNotifications(mockNotifications);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  const handleReadNotification = async (id: string) => {
    // Update locally first for UI responsiveness
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    // Update in database if user is logged in
    if (user?.id) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };
  
  return (
    <PageTransition>
      <div className="container max-w-5xl mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated with all your activities.
          </p>
        </header>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messageNotifications.length})</TabsTrigger>
            <TabsTrigger value="projects">Projects ({projectNotifications.length})</TabsTrigger>
            <TabsTrigger value="system">System ({systemNotifications.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <NotificationList 
              notifications={notifications} 
              onRead={handleReadNotification} 
            />
          </TabsContent>
          
          <TabsContent value="unread">
            <NotificationList 
              notifications={unreadNotifications} 
              onRead={handleReadNotification} 
            />
          </TabsContent>
          
          <TabsContent value="messages">
            <NotificationList 
              notifications={messageNotifications} 
              onRead={handleReadNotification} 
            />
          </TabsContent>
          
          <TabsContent value="projects">
            <NotificationList 
              notifications={projectNotifications} 
              onRead={handleReadNotification} 
            />
          </TabsContent>
          
          <TabsContent value="system">
            <NotificationList 
              notifications={systemNotifications} 
              onRead={handleReadNotification} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Notifications;
