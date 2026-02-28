import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUserDto } from './dto/list-user.dto'; // Import ListUserDto
import { PutEmployeeSelfDto } from './dto/put-employee-self.dto';
import { PatchEmployeeSelfDto } from './dto/patch-employee-self.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private sanitize(user: any) {
    if (!user) return null;
    const { password_hash, reset_token, reset_token_expires, ...safe } = user as any;
    return safe;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Set a default role if not provided in the DTO, as schema.prisma's role is not optional
    const userRole = createUserDto.role || 'applicant'; 
    const { password, role, ...userData } = createUserDto; // Exclude password and role from the rest of data

    try {
      const user = await this.prisma.user.create({
        data: { 
          ...userData, 
          password_hash: hashedPassword, 
          role: userRole 
        },
      });

      return this.sanitize(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }

  async findAll(listUserDto: ListUserDto) {
    const { page = 1, limit = 10 } = listUserDto;
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return { data: users.map((u) => this.sanitize(u)), total, page, limit };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return this.sanitize(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const dataToUpdate: Record<string, any> = { ...updateUserDto };

    if (dataToUpdate.password) {
      dataToUpdate.password_hash = await bcrypt.hash(dataToUpdate.password, 10);
      delete dataToUpdate.password; // Remove plain password before updating
    }

    // Ensure role is a string if it's being updated and comes as undefined
    if (dataToUpdate.role === undefined) {
      delete dataToUpdate.role; // If undefined, don't try to update it, let current value persist
    }
    
    const updated = await this.prisma.user.update({ 
      where: { id }, 
      data: dataToUpdate 
    });

    return this.sanitize(updated);
  }

  async replace(id: string, replaceUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(replaceUserDto.password, 10);
    const userRole = replaceUserDto.role || 'applicant';
    const { password, role, ...userData } = replaceUserDto;

    try {
      const replaced = await this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          password_hash: hashedPassword,
          role: userRole,
        },
      });

      return this.sanitize(replaced);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }

  async patchEmployeeSelf(userId: string, patchEmployeeSelfDto: PatchEmployeeSelfDto) {
    const dataToUpdate: Record<string, any> = { ...patchEmployeeSelfDto };

    if (dataToUpdate.password) {
      dataToUpdate.password_hash = await bcrypt.hash(dataToUpdate.password, 10);
      delete dataToUpdate.password;
    }

    delete dataToUpdate.role;

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      return this.sanitize(updated);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }

  async putEmployeeSelf(userId: string, putEmployeeSelfDto: PutEmployeeSelfDto) {
    const hashedPassword = await bcrypt.hash(putEmployeeSelfDto.password, 10);
    const { password, ...userData } = putEmployeeSelfDto;

    try {
      const replaced = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...userData,
          password_hash: hashedPassword,
        },
      });

      return this.sanitize(replaced);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }

  async remove(id: string) {
    const deleted = await this.prisma.user.delete({ where: { id } });
    return this.sanitize(deleted);
  }
}
