
import React from 'react';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onRead?: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onRead }) => {
  const handleRead = (id: string) => {
    if (onRead) {
      onRead(id);
    }
  };

  return (
    <div className="divide-y">
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No notifications to display
        </div>
      ) : (
        notifications.map(notification => (
          <NotificationItem 
            key={notification.id} 
            notification={notification}
            onRead={() => handleRead(notification.id)} 
          />
        ))
      )}
    </div>
  );
};

export default NotificationList;
