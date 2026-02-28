export class UserResponseDto {
  id: string;
  email: string;
  role: string;
  full_name: string;
  theme?: string | null;
  language?: string | null;
  timezone?: string | null;
  notification_preferences?: any;
  created_at: Date;
  updated_at: Date;
}
