import { PartialType } from '@nestjs/mapped-types';
import { PutEmployeeSelfDto } from './put-employee-self.dto';

export class PatchEmployeeSelfDto extends PartialType(PutEmployeeSelfDto) {}
