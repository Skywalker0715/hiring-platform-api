export class WorkExperience {
  id: string;
  applicant_profile_id: string;
  job_title: string;
  company: string;
  location?: string;
  start_date: Date;
  end_date?: Date;
  is_current?: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
