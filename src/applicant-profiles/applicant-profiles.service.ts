import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicantProfileDto } from './dto/create-applicant-profile.dto';
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto';

@Injectable()
export class ApplicantProfilesService {
  constructor(private prisma: PrismaService) {}

  create(createApplicantProfileDto: CreateApplicantProfileDto) {
    const {
      skills,
      work_experiences,
      educations,
      ...profileData
    } = createApplicantProfileDto;

    return this.prisma.applicantProfile.create({
      data: {
        ...profileData,
        skills: skills ? { create: skills } : undefined,
        work_experiences: work_experiences
          ? { create: work_experiences }
          : undefined,
        educations: educations ? { create: educations } : undefined,
      },
      include: {
        skills: true,
        work_experiences: true,
        educations: true,
      },
    });
  }

  findAll() {
    return this.prisma.applicantProfile.findMany({
      include: {
        skills: true,
        work_experiences: true,
        educations: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.applicantProfile.findUnique({
      where: { id },
      include: {
        skills: true,
        work_experiences: true,
        educations: true,
      },
    });
  }

  update(id: string, updateApplicantProfileDto: UpdateApplicantProfileDto) {
    const {
      skills,
      work_experiences,
      educations,
      ...profileData
    } = updateApplicantProfileDto;

    const data: Prisma.ApplicantProfileUpdateInput = {
      ...profileData,
    };

    if (skills) {
      data.skills = {
        deleteMany: {},
        create: skills,
      };
    }

    if (work_experiences) {
      data.work_experiences = {
        deleteMany: {},
        create: work_experiences,
      };
    }

    if (educations) {
      data.educations = {
        deleteMany: {},
        create: educations,
      };
    }

    return this.prisma.applicantProfile.update({
      where: { id },
      data,
      include: {
        skills: true,
        work_experiences: true,
        educations: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.applicantProfile.delete({
      where: { id },
    });
  }
}
