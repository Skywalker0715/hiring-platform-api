import {
  IsString,
  IsDateString,
  IsOptional,
  IsUUID,
  IsIn,
  IsNumber,
  IsDecimal,
  MaxLength,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsUUID()
  user_id: string;

  @IsDateString()
  attendance_date: string;

  @IsOptional()
  @IsDateString()
  check_in_time?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  check_in_photo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsIn(['manual', 'auto_finger1', 'auto_finger2', 'auto_face'])
  check_in_method?: string;

  @IsOptional()
  @IsDateString()
  check_out_time?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  check_out_photo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsIn(['manual', 'auto_finger1', 'auto_finger2', 'auto_face'])
  check_out_method?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsIn(['present', 'late', 'absent', 'half_day', 'leave'])
  status?: string = 'present';

  @IsOptional()
  @IsDecimal()
  location_lat?: number;

  @IsOptional()
  @IsDecimal()
  location_lng?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  approved_by?: string;
}