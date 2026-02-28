import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  async create(createEducationDto: CreateEducationDto) {
    return this.prisma.education.create({ data: createEducationDto });
  }

  async findAll() {
    return this.prisma.education.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.education.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async update(id: string, updateEducationDto: UpdateEducationDto) {
    return this.prisma.education.update({
      where: { id },
      data: updateEducationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.education.delete({ where: { id } });
  }
}
