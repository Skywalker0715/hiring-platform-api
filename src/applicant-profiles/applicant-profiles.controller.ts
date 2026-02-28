import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApplicantProfilesService } from './applicant-profiles.service';
import { CreateApplicantProfileDto } from './dto/create-applicant-profile.dto';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('applicant-profiles')
@UseGuards(JwtAuthGuard)
export class ApplicantProfilesController {
  constructor(private readonly applicantProfilesService: ApplicantProfilesService) {}

  @Post()
  create(@Body() createApplicantProfileDto: CreateApplicantProfileDto) {
    return this.applicantProfilesService.create(createApplicantProfileDto);
  }

  @Get()
  findAll() {
    return this.applicantProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantProfilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicantProfileDto: UpdateApplicantProfileDto) {
    return this.applicantProfilesService.update(id, updateApplicantProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantProfilesService.remove(id);
  }
}
