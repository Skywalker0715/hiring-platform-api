import { ApplicantProfile } from 'src/applicant-profiles/entities/applicant-profile.entity';

export class Education {
  id: string;
  applicant_profile_id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: Date;
  end_date: Date | null;
  is_current: boolean;
  gpa: string | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;

  // Relation
  profile?: ApplicantProfile;
}
