import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobConfigurationDto } from './dto/create-job-configuration.dto';
import { UpdateJobConfigurationDto } from './dto/update-job-configuration.dto';

@Injectable()
export class JobConfigurationsService {
  constructor(private prisma: PrismaService) {}

  create(createJobConfigurationDto: CreateJobConfigurationDto) {
    return this.prisma.jobConfiguration.create({
      data: createJobConfigurationDto,
    });
  }

  findAll() {
    return this.prisma.jobConfiguration.findMany();
  }

  findOne(id: string) {
    return this.prisma.jobConfiguration.findUnique({ where: { id } });
  }

  update(id: string, updateJobConfigurationDto: UpdateJobConfigurationDto) {
    return this.prisma.jobConfiguration.update({
      where: { id },
      data: updateJobConfigurationDto,
    });
  }

  remove(id: string) {
    return this.prisma.jobConfiguration.delete({ where: { id } });
  }
}
