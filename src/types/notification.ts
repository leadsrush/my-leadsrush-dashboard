
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export type NotificationType = 'message' | 'project' | 'invoice' | 'system' | 'client';
