import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  applicant_profile_id: string;

  @IsString()
  @IsNotEmpty()
  skill_name: string;
}
