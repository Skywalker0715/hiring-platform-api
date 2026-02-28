import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUrl()
  @IsOptional()
  actionUrl?: string;

  @IsString()
  @IsOptional()
  sender?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
