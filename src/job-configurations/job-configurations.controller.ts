import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { CreateJobConfigurationDto } from './dto/create-job-configuration.dto';
import { UpdateJobConfigurationDto } from './dto/update-job-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('job-configurations')
@UseGuards(JwtAuthGuard)
export class JobConfigurationsController {
  constructor(private readonly jobConfigurationsService: JobConfigurationsService) {}

  @Post()
  create(@Body() createJobConfigurationDto: CreateJobConfigurationDto) {
    return this.jobConfigurationsService.create(createJobConfigurationDto);
  }

  @Get()
  findAll() {
    return this.jobConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobConfigurationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobConfigurationDto: UpdateJobConfigurationDto) {
    return this.jobConfigurationsService.update(id, updateJobConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobConfigurationsService.remove(id);
  }
}
