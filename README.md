# Hiring API (Backend)

Backend API untuk sistem rekrutmen berbasis **NestJS + Prisma + PostgreSQL (Supabase)**.

Project ini mendukung alur utama:
- autentikasi user
- manajemen user per role
- posting lowongan
- apply lowongan
- profile pelamar (skills, education, work experience, upload)
- interview, notification, attendance

## Cerita Singkat Project

API ini dibuat untuk memisahkan proses hiring menjadi modul yang jelas:
- `recruiter` membuat dan mengelola lowongan
- `applicant` melengkapi profil lalu melamar
- `admin` mengelola akun user
- `employee` mengelola data akun sendiri

Flow besar:
1. User login/register.
2. Recruiter membuat lowongan (`jobs`).
3. Applicant melengkapi data profil.
4. Applicant apply lowongan (`applications`).
5. Recruiter review lamaran dan jadwalkan interview.

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Auth (Passport)
- Class Validator / Class Transformer

## Roles

- `admin`
- `recruiter`
- `applicant`
- `employee`

## Struktur Modul Utama

- `auth`
- `users`
- `jobs`
- `applications`
- `applicant-profiles`
- `skills`
- `education`
- `work-experiences`
- `job-configurations`
- `upload`
- `interviews`
- `notifications`
- `attendances`

## Persiapan Project

1. Install dependencies:

```bash
npm install
```

2. Buat/cek `.env`:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/postgres"
JWT_SECRET="<your_jwt_secret>"
PORT=5000
NODE_ENV=development
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Sync schema ke database (development):

```bash
npx prisma db push
```

5. Jalankan server:

```bash
npm run start:dev
```

Base URL default:
`http://localhost:5000`

## Catatan Supabase

Jika menggunakan Supabase transaction pooler (`:6543`), kadang bisa muncul issue koneksi/prepared statement.

Untuk perubahan schema, direct connection (`:5432`) biasanya lebih stabil.

## Step-by-Step Testing API (Postman)

### 1) Auth
1. `POST /auth/register`
2. `POST /auth/login`
3. Simpan `access_token`
4. `POST /auth/me`
5. `POST /auth/logout`

### 2) Users
Gunakan token `admin`:
1. `POST /users`
2. `GET /users`
3. `GET /users/:id`
4. `PATCH /users/:id`
5. `PUT /users/:id`
6. `DELETE /users/:id`

Gunakan token `employee`:
1. `PATCH /users/employee/me`
2. `PUT /users/employee/me`

### 3) Jobs
Gunakan token `recruiter`:
1. `POST /jobs`
2. `GET /jobs/my-jobs`
3. `GET /jobs/my-jobs/stats`
4. `PATCH /jobs/:id`
5. `PATCH /jobs/:id/status`
6. `DELETE /jobs/:id`

Public/applicant:
1. `GET /jobs`
2. `GET /jobs/:id`
3. `GET /jobs/:id/similar`
4. `GET /jobs/recommendations` (token applicant)

### 4) Applicant Profile Data
Gunakan token login:
1. `POST /applicant-profiles`
2. `POST /skills`
3. `POST /education`
4. `POST /work-experiences`
5. `POST /upload` (form-data, key: `file`)

### 5) Applications
Gunakan token `applicant`:
1. `POST /applications`
2. `GET /applications/my-applications`
3. `GET /applications/my-applications/stats`
4. `PATCH /applications/:id`
5. `PATCH /applications/:id/withdraw`
6. `DELETE /applications/:id`

Gunakan token `recruiter`:
1. `GET /applications/recruiter/all`
2. `GET /applications/job/:jobId`
3. `PATCH /applications/:id/status`

### 6) Interview, Notification, Attendance
1. `POST /interviews` lalu test CRUD endpoint interview
2. `POST /notifications` lalu test CRUD endpoint notification
3. `POST /attendances` lalu test CRUD endpoint attendance

## Scripts Penting

```bash
# run dev
npm run start:dev

# build
npm run build

# run production
npm run start:prod

# test
npm run test
```

## Status Saat Ini

- Core modules sudah teruji via Postman.
- Beberapa endpoint masih bisa ditingkatkan pada sisi RBAC granular (owner-based authorization).
- Format date disarankan konsisten ISO DateTime untuk kompatibilitas Prisma.

## License

UNLICENSED (sesuai `package.json` project ini).
