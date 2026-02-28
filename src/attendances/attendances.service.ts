import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  create(createAttendanceDto: CreateAttendanceDto) {
    const { user_id, approved_by, ...rest } = createAttendanceDto;

    const data: Prisma.AttendanceCreateInput = {
      ...rest,
      user: {
        connect: { id: user_id },
      },
      attendance_date: new Date(createAttendanceDto.attendance_date),
    };

    if (approved_by) {
      data.approver = {
        connect: { id: approved_by },
      };
    }

    return this.prisma.attendance.create({
      data,
      include: {
        user: true,
        approver: true,
      },
    });
  }

  findAll() {
    return this.prisma.attendance.findMany({
      include: {
        user: true,
        approver: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.attendance.findUnique({
      where: { id },
      include: {
        user: true,
        approver: true,
      },
    });
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const { user_id, approved_by, ...rest } = updateAttendanceDto;

    const data: Prisma.AttendanceUpdateInput = {
      ...rest,
    };

    if (user_id) {
      data.user = {
        connect: { id: user_id },
      };
    }

    if (approved_by) {
      data.approver = {
        connect: { id: approved_by },
      };
    }

    if (updateAttendanceDto.attendance_date) {
      data.attendance_date = new Date(updateAttendanceDto.attendance_date);
    }

    return this.prisma.attendance.update({
      where: { id },
      data,
      include: {
        user: true,
        approver: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.attendance.delete({
      where: { id },
    });
  }
}
