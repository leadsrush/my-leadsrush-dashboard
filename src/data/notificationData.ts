
import { Notification } from '@/types/notification';

// Helper to create notifications with default values
const createNotification = (
  id: string, 
  userId: string,
  type: Notification['type'],
  title: string,
  content: string,
  link?: string,
  read = false,
): Notification => ({
  id,
  userId,
  type,
  title,
  content,
  link,
  read,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within last week
});

// Export notifications so it can be modified by message functions
export const notifications: Notification[] = [
  // Client notifications
  createNotification('notif1', 'client1', 'project', 'Project Update', 'Your SEO campaign has new results', '/projects/project1'),
  createNotification('notif2', 'client1', 'invoice', 'Invoice Due', 'You have an invoice due in 3 days', '/invoices'),
  createNotification('notif3', 'client1', 'message', 'New Message', 'Project manager sent you a message', '/messages'),
  createNotification('notif4', 'client2', 'project', 'Campaign Complete', 'Your social media campaign is complete', '/projects/project3'),
  createNotification('notif5', 'client2', 'system', 'Account Update', 'Your account details were updated', '/settings'),
  
  // Admin notifications
  createNotification('notif6', 'admin1', 'client', 'New Client', 'A new client has been registered', '/clients'),
  createNotification('notif7', 'admin1', 'invoice', 'Overdue Invoice', 'Client "Acme Corp" has an overdue invoice', '/admin/invoices'),
  createNotification('notif8', 'admin1', 'project', 'Project Deadline', 'Project "Email Campaign" is due tomorrow', '/projects/project4'),
  createNotification('notif9', 'admin1', 'system', 'Server Maintenance', 'Scheduled maintenance in 24 hours', '/settings'),
  
  // Project manager notifications
  createNotification('notif10', 'pm1', 'client', 'Client Request', 'Client "TechStart" requested a call', '/clients/client2'),
  createNotification('notif11', 'pm1', 'project', 'Task Assigned', 'You were assigned to a new project', '/projects/project2'),
  createNotification('notif12', 'pm1', 'message', 'Client Message', 'Client "Global Media" sent a message', '/messages'),
  
  // Team member notifications
  createNotification('notif13', 'team1', 'project', 'Task Update', 'Task "Create Banner Ads" was updated', '/projects/project5'),
  createNotification('notif14', 'team1', 'message', 'Team Message', 'Project manager sent you a message', '/messages'),
  createNotification('notif15', 'team1', 'system', 'Meeting Reminder', 'Team meeting in 1 hour', ''),
];

// Utility functions
export const getNotificationsByUser = (userId: string): Notification[] => {
  return notifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getUnreadNotificationCount = (userId: string): number => {
  return notifications.filter(notification => notification.userId === userId && !notification.read).length;
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  notifications
    .filter(notification => notification.userId === userId)
    .forEach(notification => {
      notification.read = true;
    });
};
