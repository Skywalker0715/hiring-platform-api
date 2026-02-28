import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateApplicationDto {
  @IsNotEmpty({ message: 'Job ID is required' })
  @IsString()
  jobId: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsObject()
  formData?: Prisma.JsonValue; 
}