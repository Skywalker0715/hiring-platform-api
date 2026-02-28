import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import {
  UpdateApplicationDto,
  UpdateApplicationStatusDto,
  ApplicationStatus,
} from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private async generateApplicationNumber() {
    // Format: APP-YYYYMMDD-XXXXXX (max 50 chars, human-readable)
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const datePart = `${y}${m}${d}`;

    for (let i = 0; i < 5; i++) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      const candidate = `APP-${datePart}-${rand}`;
      const existing = await this.prisma.application.findUnique({
        where: { application_number: candidate },
        select: { id: true },
      });
      if (!existing) {
        return candidate;
      }
    }

    // Very unlikely fallback to avoid blocking request
    return `APP-${datePart}-${Date.now().toString().slice(-6)}`;
  }

  // Applicant: Apply to a job
  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { jobId, coverLetter } = createApplicationDto;

    // Check if user is applicant
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'applicant') {
      throw new ForbiddenException('Only applicants can apply to jobs');
    }

    // Ensure applicant has completed required profile sections before applying
    const profile = await this.prisma.applicantProfile.findUnique({
      where: { user_id: userId },
      select: {
        id: true,
        _count: {
          select: {
            skills: true,
            work_experiences: true,
            educations: true,
          },
        },
      },
    });

    const uploadsCount = await this.prisma.upload.count({
      where: { user_id: userId },
    });

    const missingSections: string[] = [];

    if (!profile) {
      missingSections.push('applicant_profile');
    } else {
      if (profile._count.educations === 0) missingSections.push('education');
      if (profile._count.skills === 0) missingSections.push('skills');
      if (profile._count.work_experiences === 0)
        missingSections.push('work_experiences');
    }

    if (uploadsCount === 0) missingSections.push('upload');

    if (missingSections.length > 0) {
      throw new BadRequestException(
        `Please complete required sections before applying: ${missingSections.join(', ')}`,
      );
    }

    // Check if job exists and is active
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        created_by: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== 'published') {
      throw new BadRequestException('This job is no longer active');
    }

    // Check if user already applied
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        user_id: userId,
        job_id: jobId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this job');
    }

    // Create application
    const applicationNumber = await this.generateApplicationNumber();
    const application = await this.prisma.application.create({
      data: {
        user_id: userId,
        job_id: jobId,
        application_number: applicationNumber,
        form_data: { coverLetter },
        status: ApplicationStatus.PENDING,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company_info: true,
            location: true,
            job_type: true,
          },
        },
      },
    });

    return {
      message: 'Application submitted successfully',
      data: application,
    };
  }

  // Applicant: Get my applications
  async findMyApplications(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { user_id: userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company_info: true,
            location: true,
            job_type: true,
            salary_min: true,
            salary_max: true,
            status: true,
          },
        },
      },
      orderBy: { applied_at: 'desc' },
    });

    return {
      message: 'Applications retrieved successfully',
      data: applications,
      total: applications.length,
    };
  }

  // Recruiter: Get applications for their jobs
  async findApplicationsForCompany(recruiterId: string, status?: string) {
    const where: any = {
      job: {
        created_by: recruiterId,
      },
    };

    if (status) {
      where.status = status;
    }

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            applicant_profile: {
              select: {
                full_name: true,
                phone_number: true,
                domicile: true,
                about_me: true,
                photo_profile_url: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            job_type: true,
          },
        },
      },
      orderBy: { applied_at: 'desc' },
    });

    return {
      message: 'Applications retrieved successfully',
      data: applications,
      total: applications.length,
    };
  }

  // Get applications for specific job (Recruiter only)
  async findApplicationsByJob(jobId: string, recruiterId: string) {
    // Verify job belongs to recruiter
    const job = await this.prisma.job.findFirst({
      where: {
        id: jobId,
        created_by: recruiterId,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found or access denied');
    }

    const applications = await this.prisma.application.findMany({
      where: { job_id: jobId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            applicant_profile: {
              select: {
                full_name: true,
                phone_number: true,
                domicile: true,
                about_me: true,
                photo_profile_url: true,
              },
            },
          },
        },
      },
      orderBy: { applied_at: 'desc' },
    });

    // Get statistics
    const stats = await this.getApplicationStats(jobId);

    return {
      message: 'Applications retrieved successfully',
      data: applications,
      total: applications.length,
      stats,
    };
  }

  // Get single application detail
  async findOne(id: string, userId: string, userRole: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            applicant_profile: {
              select: {
                full_name: true,
                phone_number: true,
                domicile: true,
                about_me: true,
                photo_profile_url: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            company_info: true,
            location: true,
            job_type: true,
            salary_min: true,
            salary_max: true,
            created_by: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Authorization check
    if (userRole === 'applicant' && application.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'recruiter' && application.job.created_by !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      message: 'Application retrieved successfully',
      data: application,
    };
  }

  // Applicant: Update own application (before reviewed)
  async update(
    id: string,
    userId: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Cannot update application after it has been reviewed',
      );
    }

    // Map incoming DTO to DB fields
    const updateData: any = {};
    if (updateApplicationDto.coverLetter !== undefined) {
      updateData.form_data = { ...(application.form_data as any), coverLetter: updateApplicationDto.coverLetter };
    }
    if (updateApplicationDto.status !== undefined) {
      updateData.status = updateApplicationDto.status;
    }
    if (updateApplicationDto.rejectionReason !== undefined) {
      updateData.notes = updateApplicationDto.rejectionReason;
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company_info: true,
          },
        },
      },
    });

    return {
      message: 'Application updated successfully',
      data: updated,
    };
  }

  // Recruiter: Update application status
  async updateStatus(
    id: string,
    recruiterId: string,
    updateStatusDto: UpdateApplicationStatusDto,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            created_by: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.created_by !== recruiterId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        ...(updateStatusDto.rejectionReason ? { notes: updateStatusDto.rejectionReason } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            applicant_profile: {
              select: {
                full_name: true,
                phone_number: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // TODO: Send notification to user about status change
    // await this.notificationService.sendApplicationStatusUpdate(updated);

    return {
      message: 'Application status updated successfully',
      data: updated,
    };
  }

  // Applicant: Withdraw application
  async withdraw(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (
      application.status === ApplicationStatus.ACCEPTED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Cannot withdraw application with this status',
      );
    }

    await this.prisma.application.update({
      where: { id },
      data: { status: ApplicationStatus.WITHDRAWN },
    });

    return {
      message: 'Application withdrawn successfully',
    };
  }

  // Applicant: Delete application (only if pending or withdrawn)
  async remove(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (
      application.status !== ApplicationStatus.PENDING &&
      application.status !== ApplicationStatus.WITHDRAWN
    ) {
      throw new BadRequestException(
        'Can only delete pending or withdrawn applications',
      );
    }

    await this.prisma.application.delete({
      where: { id },
    });

    return {
      message: 'Application deleted successfully',
    };
  }

  // Get application statistics for a job
  async getApplicationStats(jobId: string) {
    const total = await this.prisma.application.count({
      where: { job_id: jobId },
    });

    const pending = await this.prisma.application.count({
      where: { job_id: jobId, status: ApplicationStatus.PENDING },
    });

    const reviewed = await this.prisma.application.count({
      where: { job_id: jobId, status: ApplicationStatus.REVIEWED },
    });

    const accepted = await this.prisma.application.count({
      where: { job_id: jobId, status: ApplicationStatus.ACCEPTED },
    });

    const rejected = await this.prisma.application.count({
      where: { job_id: jobId, status: ApplicationStatus.REJECTED },
    });

    return {
      total,
      pending,
      reviewed,
      accepted,
      rejected,
    };
  }

  // Get user's application statistics
  async getMyStats(userId: string) {
    const total = await this.prisma.application.count({
      where: { user_id: userId },
    });

    const pending = await this.prisma.application.count({
      where: { user_id: userId, status: ApplicationStatus.PENDING },
    });

    const reviewed = await this.prisma.application.count({
      where: { user_id: userId, status: ApplicationStatus.REVIEWED },
    });

    const accepted = await this.prisma.application.count({
      where: { user_id: userId, status: ApplicationStatus.ACCEPTED },
    });

    const rejected = await this.prisma.application.count({
      where: { user_id: userId, status: ApplicationStatus.REJECTED },
    });

    return {
      message: 'Statistics retrieved successfully',
      data: {
        total,
        pending,
        reviewed,
        accepted,
        rejected,
      },
    };
  }
}
