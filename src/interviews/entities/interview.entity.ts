import { Application } from 'src/applications/entities/application.entity';
import { InterviewStatus, InterviewType } from '../dto/create-interview.dto';

export class Interview {
  id: string;
  application_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  interview_type: InterviewType;
  location: string | null;
  meeting_link: string | null;
  interviewer_name: string | null;
  interviewer_title: string | null;
  status: InterviewStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;

  // Relation
  application?: Application;
}
