import { Education } from 'src/education/entities/education.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkExperience } from 'src/work-experiences/entities/work-experience.entity';

export class ApplicantProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  gender: string | null;
  domicile: string | null;
  date_of_birth: Date | null;
  about_me: string | null;
  photo_profile_url: string | null;
  cv_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  created_at: Date;
  updated_at: Date;

  // Relations
  user?: User;
  skills?: Skill[];
  work_experiences?: WorkExperience[];
  educations?: Education[];
}
