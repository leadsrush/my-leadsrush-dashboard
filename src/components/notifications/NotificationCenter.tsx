
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getNotificationsByUser, 
  getUnreadNotificationCount, 
  markAllNotificationsAsRead 
} from '@/data/notificationData';
import { NotificationItem } from './NotificationItem';
import { useAuth } from '@/context/AuthContext';

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  className 
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  if (!user) return null;
  
  const notifications = getNotificationsByUser(user.id);
  const unreadCount = getUnreadNotificationCount(user.id);
  
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(user.id);
    setRefreshKey(prev => prev + 1);
  };
  
  const handleNotificationRead = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={className}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          <div className="divide-y" key={refreshKey}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onRead={handleNotificationRead}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No notifications
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
