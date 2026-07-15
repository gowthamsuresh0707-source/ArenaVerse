import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

beforeAll(async () => {
  // Clear tables or prepare database state
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Authentication Flow', () => {
  it('should successfully register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@arenaverse.gg',
        username: 'testplayer',
        password: 'Password123!',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
  });

  it('should not allow registration with duplicate credentials', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@arenaverse.gg',
        username: 'testplayer',
        password: 'Password123!',
      });

    expect(res.statusCode).toEqual(409);
  });
});
