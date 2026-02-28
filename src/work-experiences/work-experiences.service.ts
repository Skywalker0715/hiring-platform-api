import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Injectable()
export class WorkExperiencesService {
  constructor(private prisma: PrismaService) {}

  create(createWorkExperienceDto: CreateWorkExperienceDto) {
    return this.prisma.workExperience.create({
      data: createWorkExperienceDto,
    });
  }

  findAll() {
    return this.prisma.workExperience.findMany();
  }

  findOne(id: string) {
    return this.prisma.workExperience.findUnique({
      where: { id },
    });
  }

  update(id: string, updateWorkExperienceDto: UpdateWorkExperienceDto) {
    return this.prisma.workExperience.update({
      where: { id },
      data: updateWorkExperienceDto,
    });
  }

  remove(id: string) {
    return this.prisma.workExperience.delete({
      where: { id },
    });
  }
}
