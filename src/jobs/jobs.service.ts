import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, JobStatus, UpdateJobDto, UpdateJobStatusDto } from './dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  // Recruiter: Create new job
  async create(recruiterId: string, createJobDto: CreateJobDto) {
    // Verify user is recruiter
    const recruiter = await this.prisma.user.findUnique({
      where: { id: recruiterId },
      select: { role: true },
    });

    if (!recruiter || recruiter.role !== 'recruiter') {
      throw new ForbiddenException('Only recruiters can post jobs');
    }

    // Validate salary range
    if (
      createJobDto.salaryMin &&
      createJobDto.salaryMax &&
      createJobDto.salaryMin > createJobDto.salaryMax
    ) {
      throw new BadRequestException(
        'Minimum salary cannot be greater than maximum salary',
      );
    }

    const slug = createJobDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const job = await this.prisma.job.create({
      data: {
        slug,
        title: createJobDto.title,
        description: createJobDto.description,
        location: createJobDto.location,
        salary_min: createJobDto.salaryMin ? BigInt(createJobDto.salaryMin) : undefined,
        salary_max: createJobDto.salaryMax ? BigInt(createJobDto.salaryMax) : undefined,
        currency: createJobDto.currency || 'IDR',
        job_type: createJobDto.jobType,
        required_skills: createJobDto.requiredSkills || undefined,
        status: createJobDto.status || JobStatus.DRAFT,
        created_by: recruiterId,
        responsibilities: createJobDto.responsibilities,
        requirements: createJobDto.requirements,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    return {
      message: 'Job created successfully',
      data: job,
    };
  }

  // Public: Get all active jobs with filters
  async findAll(filters?: {
    search?: string;
    location?: string;
    jobType?: string;
    salaryMin?: number;
    salaryMax?: number;
    skills?: string[];
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: JobStatus.PUBLISHED,
    };

    // Search in title and description
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filter by location
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    // Filter by job type
    if (filters?.jobType) {
      where.job_type = filters.jobType;
    }

    // Filter by salary range
    if (filters?.salaryMin) {
      where.salary_min = { gte: BigInt(filters.salaryMin) };
    }
    if (filters?.salaryMax) {
      where.salary_max = { lte: BigInt(filters.salaryMax) };
    }

    // Filter by skills
    // NOTE: `required_skills` is JSON in the schema; for now fallback to searching skill terms in title/description
    if (filters?.skills && filters.skills.length > 0) {
      where.OR = filters.skills.map((s) => ({
        OR: [
          { title: { contains: s, mode: 'insensitive' } },
          { description: { contains: s, mode: 'insensitive' } },
        ],
      }));
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      message: 'Jobs retrieved successfully',
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Recruiter: Get my jobs
  async findMyJobs(recruiterId: string, status?: string) {
    const where: any = { created_by: recruiterId };

    if (status) {
      where.status = status;
    }

    const jobs = await this.prisma.job.findMany({
      where,
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      message: 'Jobs retrieved successfully',
      data: jobs,
      total: jobs.length,
    };
  }

  // Public: Get job detail
  async findOne(id: string, userId?: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            full_name: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user already applied (if userId provided)
    let hasApplied = false;
    if (userId) {
      const application = await this.prisma.application.findFirst({
        where: {
          job_id: id,
          user_id: userId,
        },
      });
      hasApplied = !!application;
    }

    return {
      message: 'Job retrieved successfully',
      data: {
        ...job,
        hasApplied,
      },
    };
  }

  // Recruiter: Update job
  async update(id: string, recruiterId: string, updateJobDto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      select: { created_by: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.created_by !== recruiterId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    // Validate salary range if provided
    if (
      updateJobDto.salaryMin &&
      updateJobDto.salaryMax &&
      updateJobDto.salaryMin > updateJobDto.salaryMax
    ) {
      throw new BadRequestException(
        'Minimum salary cannot be greater than maximum salary',
      );
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        title: updateJobDto.title,
        description: updateJobDto.description,
        location: updateJobDto.location,
        salary_min: updateJobDto.salaryMin ? BigInt(updateJobDto.salaryMin) : undefined,
        salary_max: updateJobDto.salaryMax ? BigInt(updateJobDto.salaryMax) : undefined,
        currency: updateJobDto.currency || undefined,
        job_type: updateJobDto.jobType,
        required_skills: updateJobDto.requiredSkills || undefined,
        responsibilities: updateJobDto.responsibilities,
        requirements: updateJobDto.requirements,
        status: updateJobDto.status,
      },
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    return {
      message: 'Job updated successfully',
      data: updated,
    };
  }

  // Company: Update job status
  async updateStatus(
    id: string,
    recruiterId: string,
    updateStatusDto: UpdateJobStatusDto,
  ) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      select: { created_by: true, status: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.created_by !== recruiterId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: { status: updateStatusDto.status },
    });

    return {
      message: 'Job status updated successfully',
      data: updated,
    };
  }

  // Company: Delete job (soft delete by setting status to archived)
  async remove(id: string, recruiterId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      select: { created_by: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.created_by !== recruiterId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    // Check if there are applications
    const applicationCount = await this.prisma.application.count({
      where: { job_id: id },
    });

    if (applicationCount > 0) {
      // Soft delete: change status to closed
      await this.prisma.job.update({
        where: { id },
        data: { status: JobStatus.CLOSED },
      });

      return {
        message: 'Job archived successfully (has applications)',
      };
    } else {
      // Hard delete if no applications
      await this.prisma.job.delete({
        where: { id },
      });

      return {
        message: 'Job deleted successfully',
      };
    }
  }

  // Get job statistics for recruiter
  async getCompanyStats(recruiterId: string) {
    const total = await this.prisma.job.count({
      where: { created_by: recruiterId },
    });

    const active = await this.prisma.job.count({
      where: { created_by: recruiterId, status: JobStatus.PUBLISHED },
    });

    const draft = await this.prisma.job.count({
      where: { created_by: recruiterId, status: JobStatus.DRAFT },
    });

    const closed = await this.prisma.job.count({
      where: { created_by: recruiterId, status: JobStatus.CLOSED },
    });

    const totalApplications = await this.prisma.application.count({
      where: {
        job: {
          created_by: recruiterId,
        },
      },
    });

    return {
      message: 'Statistics retrieved successfully',
      data: {
        total,
        active,
        draft,
        closed,
        totalApplications,
      },
    };
  }

  // Get similar jobs (based on title, location, or skills)
  async findSimilarJobs(jobId: string, limit: number = 5) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: {
        title: true,
        location: true,
        required_skills: true,
        job_type: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const similarJobs = await this.prisma.job.findMany({
      where: {
        id: { not: jobId },
        status: JobStatus.PUBLISHED,
        OR: [
          { title: { contains: job.title.split(' ')[0], mode: 'insensitive' } },
          { location: { equals: job.location } },
          { job_type: { equals: job.job_type } },
        ],
      },
      take: limit,
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      message: 'Similar jobs retrieved successfully',
      data: similarJobs,
    };
  }

  // Get job recommendations for user (based on profile)
  async getRecommendations(userId: string, limit: number = 10) {
    // Get user profile to understand their preferences
    const userProfile = await this.prisma.applicantProfile.findUnique({
      where: { user_id: userId },
      select: {
        domicile: true,
        about_me: true,
      },
    });

    // Build recommendation criteria
    const where: any = {
      status: JobStatus.PUBLISHED,
      applications: {
        none: {
          user_id: userId, // Exclude jobs user already applied to
        },
      },
    };

    // Prefer jobs in user's location if available
    if (userProfile?.domicile) {
      where.location = { contains: userProfile.domicile, mode: 'insensitive' };
    }

    const recommendedJobs = await this.prisma.job.findMany({
      where,
      take: limit,
      include: {
        creator: {
          select: {
            id: true,
            full_name: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      message: 'Job recommendations retrieved successfully',
      data: recommendedJobs,
    };
  }
}
