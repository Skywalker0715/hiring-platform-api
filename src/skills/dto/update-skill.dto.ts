import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  skill_name?: string;
}
