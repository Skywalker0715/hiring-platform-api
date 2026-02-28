import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { JobConfigurationsModule } from './job-configurations/job-configurations.module';
import { ApplicationsModule } from './applications/applications.module';
import { ApplicantProfilesModule } from './applicant-profiles/applicant-profiles.module';
import { WorkExperiencesModule } from './work-experiences/work-experiences.module';
import { InterviewsModule } from './interviews/interviews.module';
import { AttendancesModule } from './attendances/attendances.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';
import { SkillsModule } from './skills/skills.module';
import { EducationModule } from './education/education.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    JobConfigurationsModule,
    ApplicationsModule,
    ApplicantProfilesModule,
    WorkExperiencesModule,
    InterviewsModule,
    AttendancesModule,
    NotificationsModule,
    UploadModule,
    SkillsModule,
    EducationModule,
  ],
})
export class AppModule {}
