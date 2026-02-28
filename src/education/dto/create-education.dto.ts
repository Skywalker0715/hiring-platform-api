import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  applicant_profile_id: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  field_of_study: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsBoolean()
  @IsOptional()
  is_current?: boolean;

  @IsString()
  @IsOptional()
  gpa?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
