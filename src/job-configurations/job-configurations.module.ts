import { Module } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { JobConfigurationsController } from './job-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JobConfigurationsController],
  providers: [JobConfigurationsService],
  exports: [JobConfigurationsService],
})
export class JobConfigurationsModule {}
