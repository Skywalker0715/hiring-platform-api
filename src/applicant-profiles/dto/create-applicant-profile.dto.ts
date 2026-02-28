import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSkillDto } from 'src/skills/dto/create-skill.dto';
import { CreateWorkExperienceDto } from 'src/work-experiences/dto/create-work-experience.dto';
import { CreateEducationDto } from 'src/education/dto/create-education.dto';

export class CreateApplicantProfileDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  domicile?: string;

  @IsDateString()
  @IsOptional()
  date_of_birth?: Date;

  @IsString()
  @IsOptional()
  about_me?: string;

  @IsUrl()
  @IsOptional()
  photo_profile_url?: string;

  @IsUrl()
  @IsOptional()
  cv_url?: string;

  @IsUrl()
  @IsOptional()
  linkedin_url?: string;

  @IsUrl()
  @IsOptional()
  github_url?: string;

  @IsUrl()
  @IsOptional()
  portfolio_url?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  skills?: CreateSkillDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkExperienceDto)
  work_experiences?: CreateWorkExperienceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations?: CreateEducationDto[];
}
