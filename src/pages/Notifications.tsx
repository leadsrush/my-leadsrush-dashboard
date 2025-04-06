
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationType } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Notifications = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userProfile) return;
      
      setLoading(true);
      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('userId', userProfile.id)
          .order('createdAt', { ascending: false });
          
        if (activeTab !== 'all') {
          query = query.eq('type', activeTab);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Failed to load notifications",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [userProfile, activeTab, refreshKey]);
  
  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = format(new Date(notification.createdAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);
  
  const handleMarkAllAsRead = async () => {
    if (!userProfile) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('userId', userProfile.id)
        .eq('read', false);
        
      if (error) throw error;
      
      setRefreshKey(prev => prev + 1);
      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read.",
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read.",
        variant: "destructive",
      });
    }
  };
  
  const notificationTypes: { value: string, label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'message', label: 'Messages' },
    { value: 'project', label: 'Projects' },
    { value: 'invoice', label: 'Invoices' },
    { value: 'system', label: 'System' },
  ];
  
  // Add client type for admin and project managers
  if (userProfile?.role === 'admin' || userProfile?.role === 'project_manager') {
    notificationTypes.splice(1, 0, { value: 'client', label: 'Clients' });
  }
  
  const handleNotificationRead = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <PageTransition className="container py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your projects, messages, and more
          </p>
        </div>
        <Button variant="outline" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>
      
      <Card>
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="flex justify-between items-center border-b p-4">
            <TabsList>
              {notificationTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[calc(100vh-240px)]">
              {loading ? (
                <div className="flex justify-center p-8">
                  <p>Loading notifications...</p>
                </div>
              ) : Object.keys(groupedNotifications).length > 0 ? (
                <div className="divide-y" key={refreshKey}>
                  {Object.entries(groupedNotifications).map(([date, notifications]) => (
                    <div key={date}>
                      <div className="p-3 bg-muted/50">
                        <p className="text-sm font-medium">
                          {format(new Date(date), "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="divide-y">
                        {notifications.map((notification) => (
                          <NotificationItem 
                            key={notification.id} 
                            notification={notification}
                            onRead={handleNotificationRead}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-2">No notifications found</p>
                  {activeTab !== 'all' && (
                    <Button variant="outline" onClick={() => setActiveTab('all')}>
                      View all notifications
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </PageTransition>
  );
};

export default Notifications;
