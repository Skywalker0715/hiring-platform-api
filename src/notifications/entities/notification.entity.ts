export class Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  sender: string | null;
  isRead: boolean;
  createdAt: Date;
}
