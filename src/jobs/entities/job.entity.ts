import { Prisma } from '@prisma/client';

export class Job {
  id: string;
  slug: string;
  createdBy: string | null;
  title: string;
  description: string;
  department: string | null;
  status: string; // 'draft', 'published', 'closed'
  salaryMin: bigint | null;
  salaryMax: bigint | null;
  currency: string | null;
  displaySalary: string | null;
  location: string | null;
  jobType: string | null; // 'Full-time', 'Part-time', 'Contract', 'Internship'
  responsibilities: Prisma.JsonValue | null; // Array of strings
  requirements: Prisma.JsonValue | null; // Array of strings
  qualifications: Prisma.JsonValue | null; // Array of strings
  requiredSkills: Prisma.JsonValue | null; // Array of strings
  companyInfo: Prisma.JsonValue | null; // {name, about, size, industry, website, location}
  startedOn: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations can be included for detailed views
  // creator?: User; 
  // applications?: Application[];
}
