const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../app'); 
const User = require('../../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Integration Tests', () => {
  const userData = {
    username: 'testuser',
    email: `test+${Date.now()}@example.com`,
    password: 'testpass123',
  };

  test('POST /api/auth/register - should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
  });

  test('POST /api/auth/register - should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing@fields.com' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register - should fail if user already exists', async () => {
    await request(app).post('/api/auth/register').send(userData);
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - should login a user', async () => {
    // First register the user
    await request(app).post('/api/auth/register').send(userData);

    // Now login
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
  });

  test('POST /api/auth/login - should fail with wrong password', async () => {
    await request(app).post('/api/auth/register').send(userData);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - should fail with non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nouser@example.com', password: 'somepass' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me - should return user details with token', async () => {
    // Register
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(userData);

    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(userData.email);
  });

  test('GET /api/auth/me - should fail with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/logout - should clear token cookie', async () => {
    // Register and login to get a token
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(userData);

    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  test('GET /api/auth/logout - should fail without token', async () => {
    const res = await request(app)
      .get('/api/auth/logout')
      .expect(401);
    expect(res.body.success).toBe(false);
  });
});
