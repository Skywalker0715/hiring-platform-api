import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { userId, ...rest } = createNotificationDto;
    return this.prisma.notification.create({
      data: {
        ...rest,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany();
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      return await this.prisma.notification.update({ where: { id }, data: updateNotificationDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Notification with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.notification.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Notification with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
