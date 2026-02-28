import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus, { message: 'Invalid status' })
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus, { message: 'Invalid status' })
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}