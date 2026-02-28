import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

// You can define an enum for roles to ensure type safety
export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  APPLICANT = 'applicant',
  EMPLOYEE = 'employee',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Valid email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters' })
  fullName: string; // Changed to camelCase

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsEnum(UserRole)
  role?: string; // Role can be optionally assigned on registration
}
