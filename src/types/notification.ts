
export type NotificationType = 'message' | 'project' | 'invoice' | 'client' | 'system';

export interface Notification {
  id: string;
  userId?: string;
  read: boolean;
  createdAt: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string;
}
