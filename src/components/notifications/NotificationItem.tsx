
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Mail, FileText, Users, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types/notification';
import { markNotificationAsRead } from '@/data/notificationData';

interface NotificationItemProps {
  notification: Notification;
  onRead?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRead 
}) => {
  const navigate = useNavigate();
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'project':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'invoice':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'client':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleClick = () => {
    markNotificationAsRead(notification.id);
    if (onRead) onRead();
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className={cn(
        "flex items-start p-3 gap-3 hover:bg-muted transition-colors cursor-pointer",
        !notification.read && "bg-muted/50"
      )}
    >
      <div className="mt-1">
        {getIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.content}
        </p>
        
        {!notification.read && (
          <div className="h-2 w-2 bg-primary rounded-full absolute top-3 right-3" />
        )}
      </div>
    </div>
  );
};
