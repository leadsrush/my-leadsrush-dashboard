
import { Notification } from '@/types/notification';

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    type: 'message',
    title: 'New message from John',
    content: 'Hello, I wanted to discuss the project timeline with you.',
    link: '/messages'
  },
  {
    id: '2',
    userId: 'user1',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    type: 'project',
    title: 'Project update: Website Redesign',
    content: 'The project has been updated to 75% completion.',
    link: '/projects/123'
  },
  {
    id: '3',
    userId: 'user1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    type: 'invoice',
    title: 'Invoice paid',
    content: 'Invoice #INV-2023-004 has been paid by Client XYZ.',
    link: '/invoices'
  },
  {
    id: '4',
    userId: 'user1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: 'client',
    title: 'New client registered',
    content: 'ABC Company has registered as a new client.',
    link: '/clients'
  },
  {
    id: '5',
    userId: 'user1',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    type: 'system',
    title: 'System maintenance',
    content: 'The system will undergo maintenance on Sunday at 2 AM.',
    link: '/settings'
  }
];

// Get notifications for a specific user
export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get count of unread notifications
export const getUnreadNotificationCount = (userId: string): number => {
  return mockNotifications.filter(notification => notification.userId === userId && !notification.read).length;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (userId: string): void => {
  mockNotifications.forEach(notification => {
    if (notification.userId === userId) {
      notification.read = true;
    }
  });
};

// Mark a single notification as read
export const markNotificationAsRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};
