import { Prisma } from '@prisma/client';

export class User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  full_name: string;
  theme: string | null;
  language: string | null;
  timezone: string | null;
  notification_preferences: Prisma.JsonValue | null;
  reset_token: string | null;
  reset_token_expires: Date | null;
  created_at: Date;
  updated_at: Date;
}