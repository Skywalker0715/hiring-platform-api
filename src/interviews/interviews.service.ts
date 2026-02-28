import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  create(createInterviewDto: CreateInterviewDto) {
    return this.prisma.interview.create({
      data: createInterviewDto,
    });
  }

  findAll() {
    return this.prisma.interview.findMany({
      include: {
        application: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: true,
      },
    });
  }

  update(id: string, updateInterviewDto: UpdateInterviewDto) {
    return this.prisma.interview.update({
      where: { id },
      data: updateInterviewDto,
    });
  }

  remove(id: string) {
    return this.prisma.interview.delete({
      where: { id },
    });
  }
}
