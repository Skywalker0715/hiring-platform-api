import { Module } from '@nestjs/common';
import { ApplicantProfilesService } from './applicant-profiles.service';
import { ApplicantProfilesController } from './applicant-profiles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApplicantProfilesController],
  providers: [ApplicantProfilesService],
  exports: [ApplicantProfilesService],
})
export class ApplicantProfilesModule {}
