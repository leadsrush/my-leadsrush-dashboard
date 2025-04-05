
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Mail, FileText, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getNotificationsByUser, markNotificationAsRead } from '@/data/notificationData';
import { Notification, NotificationType } from '@/types/notification';

const NotificationList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const notifications = getNotificationsByUser(user.id).slice(0, 5);
  
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
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Recent Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="flex items-start p-4 gap-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {notification.content}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No notifications
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationList;
