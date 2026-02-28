# API Test Notes (Tested Modules)

Dokumen ini merangkum endpoint yang sudah dites untuk 4 modul:
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

Base URL:
- `http://localhost:5000`

Role di project:
- `admin`
- `recruiter`
- `applicant`
- `employee`

Keterangan akses:
- `Public`: tanpa token
- `Auth`: wajib token user login
- `Role`: wajib token + role tertentu

## 1) Auth Module

Status: `Tested`

1. `POST /auth/register`
- Access: `Public`
- Tujuan: registrasi user baru

2. `POST /auth/login`
- Access: `Public`
- Tujuan: login dan ambil `access_token`

3. `POST /auth/logout`
- Access: `Auth` (token valid)
- Tujuan: logout session (stateless)

4. `POST /auth/me`
- Access: `Auth` (token valid)
- Tujuan: cek profile dari token login

## 2) Users Module

Status: `Tested`

1. `POST /users`
- Access: `Role(admin)`
- Tujuan: admin create user baru (`admin`)

2. `GET /users`
- Access: `Role(admin, recruiter)`
- Tujuan: list user

3. `GET /users/:id`
- Access: `Role(admin, recruiter)`
- Tujuan: detail user per id

4. `PATCH /users/:id`
- Access: `Role(admin)`
- Tujuan: update sebagian data user

5. `PUT /users/:id`
- Access: `Role(admin)`
- Tujuan: replace data user penuh

6. `DELETE /users/:id`
- Access: `Role(admin)`
- Tujuan: delete user

7. `PATCH /users/employee/me`
- Access: `Role(employee)`
- Tujuan: employee update data akun sendiri (partial)

8. `PUT /users/employee/me`
- Access: `Role(employee)`
- Tujuan: employee replace data akun sendiri (full)

Catatan:
- Endpoint `:id` adalah area administrasi (admin scope).
- Applicant edit profil pelamar dilakukan di modul `applicant-profiles`.

## 3) Jobs Module

Status: `Tested (11 endpoint)`

1. `POST /jobs`
- Access: `Role(recruiter)`
- Tujuan: create lowongan

2. `GET /jobs`
- Access: `Public`
- Tujuan: list lowongan (support filter query)

3. `GET /jobs/my-jobs`
- Access: `Role(recruiter)`
- Tujuan: list lowongan milik recruiter

4. `GET /jobs/my-jobs/stats`
- Access: `Role(recruiter)`
- Tujuan: statistik lowongan recruiter

5. `GET /jobs/recommendations`
- Access: `Role(applicant)`
- Tujuan: rekomendasi lowongan untuk applicant

6. `GET /jobs/:id`
- Access: `Public`
- Tujuan: detail lowongan

7. `GET /jobs/:id/similar`
- Access: `Public`
- Tujuan: list lowongan serupa

8. `PATCH /jobs/:id`
- Access: `Role(recruiter)`
- Tujuan: update sebagian data lowongan

9. `PATCH /jobs/:id/status`
- Access: `Role(recruiter)`
- Tujuan: update status lowongan (`draft/published/closed`)

10. `DELETE /jobs/:id`
- Access: `Role(recruiter)`
- Tujuan: delete/archive lowongan

## 4) Applications Module

Status: `Tested (10 endpoint)`

1. `POST /applications`
- Access: `Role(applicant)`
- Tujuan: apply ke lowongan

2. `GET /applications/my-applications`
- Access: `Role(applicant)`
- Tujuan: list lamaran milik applicant

3. `GET /applications/my-applications/stats`
- Access: `Role(applicant)`
- Tujuan: statistik lamaran applicant

4. `GET /applications/recruiter/all`
- Access: `Role(recruiter)`
- Tujuan: list semua lamaran yang masuk ke job milik recruiter

5. `GET /applications/job/:jobId`
- Access: `Role(recruiter)`
- Tujuan: list lamaran untuk job tertentu

6. `GET /applications/:id`
- Access: `Auth`
- Tujuan: detail lamaran (dengan authorization check di service)

7. `PATCH /applications/:id`
- Access: `Role(applicant)`
- Tujuan: update lamaran sendiri (contoh cover letter)

8. `PATCH /applications/:id/status`
- Access: `Role(recruiter)`
- Tujuan: recruiter update status lamaran

9. `PATCH /applications/:id/withdraw`
- Access: `Role(applicant)`
- Tujuan: withdraw lamaran sendiri

10. `DELETE /applications/:id`
- Access: `Role(applicant)`
- Tujuan: delete lamaran sendiri (sesuai rule status)

Catatan:
- `application_number` sekarang auto-generate saat create application.

## 5) Applicant-Profiles Module

Status: `Tested (5 endpoint)`

1. `POST /applicant-profiles`
- Access: `Auth`
- Tujuan: create applicant profile

2. `GET /applicant-profiles`
- Access: `Auth`
- Tujuan: list applicant profiles

3. `GET /applicant-profiles/:id`
- Access: `Auth`
- Tujuan: detail applicant profile

4. `PATCH /applicant-profiles/:id`
- Access: `Auth`
- Tujuan: update applicant profile

5. `DELETE /applicant-profiles/:id`
- Access: `Auth`
- Tujuan: delete applicant profile

Catatan:
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

## 6) Skills Module

Status: `Tested (5 endpoint)`

1. `POST /skills`
- Access: `Auth`
- Tujuan: create skill by `applicant_profile_id`

2. `GET /skills`
- Access: `Auth`
- Tujuan: list skills

3. `GET /skills/:id`
- Access: `Auth`
- Tujuan: detail skill

4. `PATCH /skills/:id`
- Access: `Auth`
- Tujuan: update skill

5. `DELETE /skills/:id`
- Access: `Auth`
- Tujuan: delete skill

Catatan:
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

## 7) Education Module

Status: `Tested (5 endpoint)`

1. `POST /education`
- Access: `Auth`
- Tujuan: create education by `applicant_profile_id`

2. `GET /education`
- Access: `Auth`
- Tujuan: list education records

3. `GET /education/:id`
- Access: `Auth`
- Tujuan: detail education

4. `PATCH /education/:id`
- Access: `Auth`
- Tujuan: update education

5. `DELETE /education/:id`
- Access: `Auth`
- Tujuan: delete education

Catatan:
- Format tanggal aman pakai ISO DateTime (contoh `2022-07-01T00:00:00.000Z`).
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

## 8) Work-Experiences Module

Status: `Tested (5 endpoint)`

1. `POST /work-experiences`
- Access: `Auth`
- Tujuan: create work experience by `applicant_profile_id`

2. `GET /work-experiences`
- Access: `Auth`
- Tujuan: list work experiences

3. `GET /work-experiences/:id`
- Access: `Auth`
- Tujuan: detail work experience

4. `PATCH /work-experiences/:id`
- Access: `Auth`
- Tujuan: update work experience

5. `DELETE /work-experiences/:id`
- Access: `Auth`
- Tujuan: delete work experience

Catatan:
- Format tanggal aman pakai ISO DateTime (contoh `2022-01-01T00:00:00.000Z`).
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

## 9) Job-Configurations Module

Status: `Tested (5 endpoint)`

1. `POST /job-configurations`
- Access: `Auth`
- Tujuan: create konfigurasi form lamaran untuk suatu job (`job_id`)

2. `GET /job-configurations`
- Access: `Auth`
- Tujuan: list semua job configurations

3. `GET /job-configurations/:id`
- Access: `Auth`
- Tujuan: detail job configuration

4. `PATCH /job-configurations/:id`
- Access: `Auth`
- Tujuan: update job configuration

5. `DELETE /job-configurations/:id`
- Access: `Auth`
- Tujuan: delete job configuration

Catatan:
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

## 10) Upload Module

Status: `Tested (4 endpoint)`

1. `POST /upload`
- Access: `Public` (saat ini belum ada guard)
- Tujuan: upload file (multipart/form-data, key: `file`)

2. `GET /upload`
- Access: `Public` (saat ini belum ada guard)
- Tujuan: list data upload

3. `GET /upload/:id`
- Access: `Public` (saat ini belum ada guard)
- Tujuan: detail upload

4. `DELETE /upload/:id`
- Access: `Public` (saat ini belum ada guard)
- Tujuan: delete data upload

Catatan:
- Untuk `POST /upload`, request harus `form-data`, bukan raw JSON.

## 11) Interviews Module

Status: `Tested (5 endpoint)`

1. `POST /interviews`
- Access: `Auth`
- Tujuan: create jadwal interview berdasarkan `application_id`

2. `GET /interviews`
- Access: `Auth`
- Tujuan: list interview

3. `GET /interviews/:id`
- Access: `Auth`
- Tujuan: detail interview

4. `PATCH /interviews/:id`
- Access: `Auth`
- Tujuan: update interview (status/jadwal/catatan)

5. `DELETE /interviews/:id`
- Access: `Auth`
- Tujuan: delete interview

Catatan:
- `application_id` harus id valid dari tabel `applications`.
- Field `scheduled_date` aman pakai ISO DateTime (contoh `2026-03-01T00:00:00.000Z`).
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

## 12) Notifications Module

Status: `Tested (5 endpoint)`

1. `POST /notifications`
- Access: `Auth`
- Tujuan: create notification

2. `GET /notifications`
- Access: `Auth`
- Tujuan: list notifications

3. `GET /notifications/:id`
- Access: `Auth`
- Tujuan: detail notification

4. `PATCH /notifications/:id`
- Access: `Auth`
- Tujuan: update notification

5. `DELETE /notifications/:id`
- Access: `Auth`
- Tujuan: delete notification

Catatan:
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).
- Untuk testing aman, pakai field yang sudah match schema DB (`type`, `title`, `message`, `sender`).

## 13) Attendances Module

Status: `Tested (5 endpoint)`

1. `POST /attendances`
- Access: `Auth`
- Tujuan: create data attendance

2. `GET /attendances`
- Access: `Auth`
- Tujuan: list attendances

3. `GET /attendances/:id`
- Access: `Auth`
- Tujuan: detail attendance

4. `PATCH /attendances/:id`
- Access: `Auth`
- Tujuan: update attendance

5. `DELETE /attendances/:id`
- Access: `Auth`
- Tujuan: delete attendance

Catatan:
- `attendance_date`, `check_in_time`, `check_out_time` aman pakai ISO DateTime.
- `location_lat`/`location_lng` harus decimal valid tanpa spasi.
- Saat ini belum ada role restriction per endpoint (masih `JwtAuthGuard` saja).

---

## Progress Ringkas

- Auth: selesai test
- Users: selesai test
- Jobs: selesai test
- Applications: selesai test
- Applicant-Profiles: selesai test
- Skills: selesai test
- Education: selesai test
- Work-Experiences: selesai test
- Job-Configurations: selesai test
- Upload: selesai test
- Interviews: selesai test
- Notifications: selesai test
- Attendances: selesai test

Next kandidat modul:
1. Hardening RBAC per modul (owner check + role restriction)
2. Rapikan format date input (auto-convert date-only ke DateTime)
3. Final regression test end-to-end
