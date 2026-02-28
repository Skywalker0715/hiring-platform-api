import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { JobStatus } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class UpdateJobStatusDto {
  @IsEnum(JobStatus, { message: 'Invalid job status' })
  status: JobStatus;
}