import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto, UpdateJobStatusDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // Recruiter: Create new job
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recruiter')
  create(@Request() req, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user.id, createJobDto);
  }

  // Public: Get all active jobs with filters
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('jobType') jobType?: string,
    @Query('salaryMin') salaryMin?: string,
    @Query('salaryMax') salaryMax?: string,
    @Query('skills') skills?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      search,
      location,
      jobType,
      salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
      skills: skills ? skills.split(',') : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };
    return this.jobsService.findAll(filters);
  }

  // Recruiter: Get my jobs
  @Get('my-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recruiter')
  findMyJobs(@Request() req, @Query('status') status?: string) {
    return this.jobsService.findMyJobs(req.user.id, status);
  }

  // Recruiter: Get job statistics
  @Get('my-jobs/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recruiter')
  getCompanyStats(@Request() req) {
    return this.jobsService.getCompanyStats(req.user.id);
  }

  // Applicant: Get job recommendations
  @Get('recommendations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('applicant')
  getRecommendations(@Request() req, @Query('limit') limit?: string) {
    return this.jobsService.getRecommendations(
      req.user.id,
      limit ? parseInt(limit) : 10,
    );
  }

  // Public: Get job detail
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    // Get userId from JWT if authenticated, otherwise undefined
    const userId = req.user?.id;
    return this.jobsService.findOne(id, userId);
  }

  // Public: Get similar jobs
  @Get(':id/similar')
  findSimilarJobs(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.jobsService.findSimilarJobs(id, limit ? parseInt(limit) : 5);
  }

  // Recruiter: Update job
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recruiter')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, req.user.id, updateJobDto);
  }

  // Recruiter: Update job status
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recruiter')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobsService.updateStatus(id, req.user.id, updateStatusDto);
  }

  // Recruiter: Delete/Archive job
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recruiter')
  remove(@Request() req, @Param('id') id: string) {
    return this.jobsService.remove(id, req.user.id);
  }
}
