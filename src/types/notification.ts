
export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'project' | 'invoice' | 'system' | 'client';
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = Notification['type'];
