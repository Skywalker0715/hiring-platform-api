import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request,Query,} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto, UpdateApplicationStatusDto} from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Applicant: Apply to a job
  @Post()
  @Roles('applicant')
  @UseGuards(RolesGuard)
  create(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.id, createApplicationDto);
  }

  // Applicant: Get my applications
  @Get('my-applications')
  @Roles('applicant')
  @UseGuards(RolesGuard)
  findMyApplications(@Request() req) {
    return this.applicationsService.findMyApplications(req.user.id);
  }

  // Applicant: Get my application statistics
  @Get('my-applications/stats')
  @Roles('applicant')
  @UseGuards(RolesGuard)
  getMyStats(@Request() req) {
    return this.applicationsService.getMyStats(req.user.id);
  }

  // Recruiter: Get all applications for recruiter's jobs
  @Get('recruiter/all')
  @Roles('recruiter')
  @UseGuards(RolesGuard)
  findApplicationsForCompany(@Request() req, @Query('status') status?: string) {
    return this.applicationsService.findApplicationsForCompany(
      req.user.id,
      status,
    );
  }

  // Recruiter: Get applications for specific job
  @Get('job/:jobId')
  @Roles('recruiter')
  @UseGuards(RolesGuard)
  findApplicationsByJob(@Request() req, @Param('jobId') jobId: string) {
    return this.applicationsService.findApplicationsByJob(jobId, req.user.id);
  }

  // Get single application detail
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.applicationsService.findOne(id, req.user.id, req.user.role);
  }

  // Applicant: Update own application (cover letter)
  @Patch(':id')
  @Roles('applicant')
  @UseGuards(RolesGuard)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(
      id,
      req.user.id,
      updateApplicationDto,
    );
  }

  // Recruiter: Update application status
  @Patch(':id/status')
  @Roles('recruiter')
  @UseGuards(RolesGuard)
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      req.user.id,
      updateStatusDto,
    );
  }

  // Applicant: Withdraw application
  @Patch(':id/withdraw')
  @Roles('applicant')
  @UseGuards(RolesGuard)
  withdraw(@Request() req, @Param('id') id: string) {
    return this.applicationsService.withdraw(id, req.user.id);
  }

  // Applicant: Delete application
  @Delete(':id')
  @Roles('applicant')
  @UseGuards(RolesGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.applicationsService.remove(id, req.user.id);
  }
}
