import { User } from 'src/users/entities/user.entity';

export class Attendance {
  id: string;
  user_id: string;
  attendance_date: Date;
  check_in_time: Date | null;
  check_in_photo_url: string | null;
  check_in_method: string | null;
  check_out_time: Date | null;
  check_out_photo_url: string | null;
  check_out_method: string | null;
  status: string;
  location_lat: number | null;
  location_lng: number | null;
  notes: string | null;
  approved_by: string | null;
  created_at: Date;
  updated_at: Date;

  // Relations
  user?: User;
  approver?: User;
}
