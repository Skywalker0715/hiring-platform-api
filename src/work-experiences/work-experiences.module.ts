import { Module } from '@nestjs/common';
import { WorkExperiencesService } from './work-experiences.service';
import { WorkExperiencesController } from './work-experiences.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkExperiencesController],
  providers: [WorkExperiencesService],
  exports: [WorkExperiencesService],
})
export class WorkExperiencesModule {}
