import { Job } from 'src/jobs/entities/job.entity';
import { Prisma } from '@prisma/client';

export class JobConfiguration {
  id: string;
  job_id: string;
  form_config: Prisma.JsonValue | null;
  created_at: Date;
  updated_at: Date;

  // Relation
  job?: Job;
}
