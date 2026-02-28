import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async create(uploadFileDto: UploadFileDto): Promise<Upload> {
    return (this.prisma as any).upload.create({
      data: uploadFileDto,
    });
  }

  async findAll(): Promise<Upload[]> {
    return (this.prisma as any).upload.findMany();
  }

  async findOne(id: string): Promise<Upload> {
    return (this.prisma as any).upload.findUnique({
      where: { id },
    });
  }

  async remove(id: string): Promise<Upload> {
    return (this.prisma as any).upload.delete({
      where: { id },
    });
  }
}
