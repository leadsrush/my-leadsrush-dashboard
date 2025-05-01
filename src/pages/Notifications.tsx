import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { NotificationList } from '@/components/notifications/NotificationList';
import PageTransition from '@/components/layout/PageTransition';
import { useToast } from '@/hooks/use-toast';
import { getNotifications } from '@/data/notificationData';
import { Notification } from '@/types/notification';
import { useAuth } from '@/context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedTab, setSelectedTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  
  // Fetch notifications data
  useEffect(() => {
    if (user?.id) {
      // In real app, this would call an API
      const fetchedNotifications = getNotifications(user.id);
      if (fetchedNotifications) {
        setNotifications(fetchedNotifications);
      }
    }
  }, [user]);
  
  // Filter notifications based on selected tab
  const getFilteredNotifications = () => {
    if (selectedTab === 'all') return notifications;
    if (selectedTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === selectedTab);
  };
  
  const filteredNotifications = getFilteredNotifications();
  
  // Mark selected notifications as read
  const markAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        selectedNotifications.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      )
    );
    
    toast({
      title: "Marked as read",
      description: `${selectedNotifications.length} notifications marked as read.`
    });
    
    setSelectedNotifications([]);
    setIsSelectMode(false);
  };
  
  // Delete selected notifications
  const deleteSelected = () => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(
        notification => !selectedNotifications.includes(notification.id)
      )
    );
    
    toast({
      title: "Notifications deleted",
      description: `${selectedNotifications.length} notifications deleted.`
    });
    
    setSelectedNotifications([]);
    setIsSelectMode(false);
  };
  
  // Toggle select mode
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedNotifications([]);
  };
  
  // Handle notification click - either select or navigate
  const handleNotificationClick = (id: string, link?: string) => {
    if (isSelectMode) {
      toggleNotificationSelection(id);
    } else if (link) {
      navigate(link);
    }
  };
  
  // Toggle notification selection
  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };
  
  // Count notifications by type
  const getNotificationCountByType = (type: string) => {
    return notifications.filter(n => n.type === type).length;
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get notification counts
  const messageCounts = getNotificationCountByType('message');
  const projectCounts = getNotificationCountByType('project');
  const invoiceCounts = getNotificationCountByType('invoice');
  const systemCounts = getNotificationCountByType('system');
  
  return (
    <PageTransition>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={toggleSelectMode}
            >
              {isSelectMode ? 'Cancel' : 'Select'}
            </Button>
            
            {isSelectMode && selectedNotifications.length > 0 && (
              <>
                <Button 
                  variant="default" 
                  size="icon"
                  onClick={markAsRead}
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={deleteSelected}
                  title="Delete selected"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Notification filters */}
        <div className="mb-6">
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="all" className="flex-1">
                All
                <Badge variant="outline" className="ml-2">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                <Badge variant="outline" className="ml-2">{unreadCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="message" className="flex-1">
                Messages
                <Badge variant="outline" className="ml-2">{messageCounts}</Badge>
              </TabsTrigger>
              <TabsTrigger value="project" className="flex-1">
                Projects
                <Badge variant="outline" className="ml-2">{projectCounts}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {filteredNotifications && filteredNotifications.length > 0 ? (
                <NotificationList 
                  notifications={filteredNotifications}
                  isSelectMode={isSelectMode}
                  selectedIds={selectedNotifications}
                  onNotificationClick={handleNotificationClick}
                  onToggleSelect={toggleNotificationSelection}
                />
              ) : (
                <EmptyState type="all" />
              )}
            </TabsContent>
            
            <TabsContent value="unread">
              {filteredNotifications && filteredNotifications.length > 0 ? (
                <NotificationList 
                  notifications={filteredNotifications}
                  isSelectMode={isSelectMode}
                  selectedIds={selectedNotifications}
                  onNotificationClick={handleNotificationClick}
                  onToggleSelect={toggleNotificationSelection}
                />
              ) : (
                <EmptyState type="unread" />
              )}
            </TabsContent>
            
            <TabsContent value="message">
              {filteredNotifications && filteredNotifications.length > 0 ? (
                <NotificationList 
                  notifications={filteredNotifications}
                  isSelectMode={isSelectMode}
                  selectedIds={selectedNotifications}
                  onNotificationClick={handleNotificationClick}
                  onToggleSelect={toggleNotificationSelection}
                />
              ) : (
                <EmptyState type="message" />
              )}
            </TabsContent>
            
            <TabsContent value="project">
              {filteredNotifications && filteredNotifications.length > 0 ? (
                <NotificationList 
                  notifications={filteredNotifications}
                  isSelectMode={isSelectMode}
                  selectedIds={selectedNotifications}
                  onNotificationClick={handleNotificationClick}
                  onToggleSelect={toggleNotificationSelection}
                />
              ) : (
                <EmptyState type="project" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

// Empty state component
const EmptyState = ({ type }: { type: string }) => {
  let message = "";
  
  switch (type) {
    case "all":
      message = "You don't have any notifications yet.";
      break;
    case "unread":
      message = "You don't have any unread notifications.";
      break;
    case "message":
      message = "You don't have any message notifications.";
      break;
    case "project":
      message = "You don't have any project notifications.";
      break;
    default:
      message = "No notifications to display.";
  }
  
  return (
    <Card className="bg-muted border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BellIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Notifications</h3>
        <p className="text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
};

export default Notifications;
