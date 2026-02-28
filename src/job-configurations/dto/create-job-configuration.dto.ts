import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateJobConfigurationDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsObject()
  @IsOptional()
  form_config?: object;
}
