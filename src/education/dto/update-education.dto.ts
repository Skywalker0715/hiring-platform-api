import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEducationDto } from './create-education.dto';

export class UpdateEducationDto extends PartialType(
  OmitType(CreateEducationDto, ['applicant_profile_id'] as const),
) {}