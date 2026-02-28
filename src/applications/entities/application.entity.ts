import { Prisma } from '@prisma/client';

export class Application {
  id: string;
  jobId: string;
  userId: string;
  applicationNumber: string | null;
  status: string;
  formData: Prisma.JsonValue | null;
  appliedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  notes: string | null;
  // appliedAt is the creation date, so we can rename for clarity if needed,
  // but schema has 'applied_at' and 'updated_at'
  updatedAt: Date;
}

// You can keep this class if you use it for detailed views
export class ApplicationWithDetails extends Application {
  user: {
    id: string;
    email: string;
    applicant_profile: {
      full_name: string;
      phone_number?: string;
    } | null;
  };
  job: {
    id: string;
    title: string;
    company_info: Prisma.JsonValue | null; // Assuming company info is in the job model
    location: string | null;
    job_type: string | null;
  };
}