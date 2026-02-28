import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  Min,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Prisma } from '@prisma/client';

// Enums can be kept as they are, but ensure the values match the schema's intent
export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship',
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Job title is required' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsNotEmpty({ message: 'Job description is required' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  displaySalary?: string;

  @IsNotEmpty({ message: 'Job type is required' })
  @IsEnum(JobType, { message: 'Invalid job type' })
  jobType: JobType;

  @IsOptional()
  @IsEnum(JobStatus, { message: 'Invalid job status' })
  status?: JobStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsObject()
  qualifications?: Prisma.JsonValue;

  @IsOptional()
  @IsObject()
  companyInfo?: Prisma.JsonValue;
}
