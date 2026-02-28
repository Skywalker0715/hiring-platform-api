import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({ data: createSkillDto });
  }

  async findAll() {
    return this.prisma.skill.findMany();
  }

  async findOne(id: string) {
    return this.prisma.skill.findUnique({ where: { id } });
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    return this.prisma.skill.update({ where: { id }, data: updateSkillDto });
  }

  async remove(id: string) {
    return this.prisma.skill.delete({ where: { id } });
  }
}
