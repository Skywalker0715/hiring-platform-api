import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let accessToken: string;
  let testUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    authService = app.get<AuthService>(AuthService);

    // Clean up previous test data
    await prisma.user.deleteMany({ where: { email: 'test.user.notification@example.com' } });

    // 1. Create a user for testing
    const registerDto = {
      email: 'test.user.notification@example.com',
      password: 'password123',
      full_name: 'Test User Notification',
      role: 'applicant'
    };
    const userReg = await authService.register(registerDto);
    testUser = userReg.data;

    // 2. Login to get accessToken
    const loginResponse = await authService.login(testUser);
    accessToken = loginResponse.data.access_token;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.notification.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await app.close();
  });

  let notificationId: string;

  it('should create a new notification', async () => {
    const createDto = {
      userId: testUser.id,
      type: 'test_notification',
      title: 'Test Notification',
      message: 'This is a test notification.',
    };

    const response = await request(app.getHttpServer())
      .post('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createDto)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toEqual(createDto.title);
    notificationId = response.body.id;
  });

  it('should get all notifications for the user', async () => {
    const response = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    const found = response.body.find((n) => n.id === notificationId);
    expect(found).toBeDefined();
  });

  it('should get a single notification by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toEqual(notificationId);
  });

  it('should update a notification (mark as read)', async () => {
    const updateDto = { isRead: true };

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.isRead).toEqual(true);
  });

  it('should delete a notification', async () => {
    await request(app.getHttpServer())
      .delete(`/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Verify it's deleted
    await request(app.getHttpServer())
      .get(`/notifications/${notificationId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404); // Assuming it returns 404 when not found
  });

  it('should fail to create notification with invalid data', async () => {
    const invalidDto = {
      userId: testUser.id,
      // Missing type, title, message
    };

    await request(app.getHttpServer())
      .post('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidDto)
      .expect(400); // Bad Request
  });
});
