import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

// Assuming an enum for interview types and statuses for better validation
export enum InterviewType {
  ONSITE = 'onsite',
  VIDEO = 'video',
  PHONE = 'phone',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  application_id: string;

  @IsDateString()
  @IsNotEmpty()
  scheduled_date: Date;

  @IsString()
  @IsNotEmpty()
  scheduled_time: string; // e.g., '10:00 AM - 11:00 AM'

  @IsEnum(InterviewType)
  @IsNotEmpty()
  interview_type: InterviewType;

  @IsString()
  @IsOptional()
  location?: string; // Physical address for onsite

  @IsUrl()
  @IsOptional()
  meeting_link?: string; // Zoom/Google Meet link

  @IsString()
  @IsOptional()
  interviewer_name?: string;

  @IsString()
  @IsOptional()
  interviewer_title?: string;

  @IsEnum(InterviewStatus)
  @IsOptional()
  status?: InterviewStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
