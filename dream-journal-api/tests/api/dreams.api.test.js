const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Dream = require('../../models/Dream');

jest.setTimeout(30000);

let token;
let userId;

beforeAll(async () => {
  const mongoURI = process.env.MONGO_URI;
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await User.deleteMany({});
  await Dream.deleteMany({});

  const testUser = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  userId = testUser._id;

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });

  token = loginRes.body.token;
  if (!token) throw new Error('Failed to get token');
});

afterEach(async () => {
  await Dream.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Dream API Tests', () => {
  test('POST /api/dreams - valid data', async () => {
    const res = await request(app)
      .post('/api/dreams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Flying Dream',
        description: 'Soaring high',
        emotions: ['joy'],
        type: 'adventure',
        lucid: false,
        rating: 4
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Flying Dream');
  });

  test('POST /api/dreams - invalid emotion enum', async () => {
    const res = await request(app)
      .post('/api/dreams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Wrong Emotion',
        description: 'Test',
        emotions: ['neutral'], // ❌ not allowed
        type: 'adventure'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/dreams - with token', async () => {
    await Dream.create({
      user: userId,
      title: 'Get All',
      description: '...',
      emotions: ['joy'],
      type: 'adventure'
    });

    const res = await request(app)
      .get('/api/dreams')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/dreams/:id - found', async () => {
    const dream = await Dream.create({
      user: userId,
      title: 'Single',
      description: '...',
      emotions: ['joy'],
      type: 'adventure'
    });

    const res = await request(app)
      .get(`/api/dreams/${dream._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Single');
  });

  test('GET /api/dreams/:id - not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/dreams/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/dreams/:id - update', async () => {
    const dream = await Dream.create({
      user: userId,
      title: 'Before Update',
      description: 'Old desc',
      emotions: ['joy'],
      type: 'adventure'
    });

    const res = await request(app)
      .put(`/api/dreams/${dream._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Dream Title',
        type: 'nightmare' // ✅ valid
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Dream Title');
  });

  test('PUT /api/dreams/:id - not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/dreams/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No Dream' });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/dreams/:id - success', async () => {
    const dream = await Dream.create({
      user: userId,
      title: 'To Delete',
      description: '...',
      emotions: ['joy'],
      type: 'adventure'
    });

    const res = await request(app)
      .delete(`/api/dreams/${dream._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('DELETE /api/dreams/:id - not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/dreams/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test('GET /api/dreams/stats - valid stats', async () => {
    await Dream.insertMany([
      { user: userId, title: 'A', description: '...', emotions: ['joy'], type: 'adventure', rating: 3 },
      { user: userId, title: 'B', description: '...', emotions: ['fear'], type: 'nightmare', rating: 4 },
      { user: userId, title: 'C', description: '...', emotions: ['joy'], type: 'fantasy', rating: 5 }
    ]);

    const res = await request(app)
      .get('/api/dreams/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data).toHaveProperty('totalDreams');
    expect(res.body.data).toHaveProperty('mostCommonEmotion');
  });

  test('GET /api/dreams - unauthorized', async () => {
    const res = await request(app).get('/api/dreams');
    expect(res.statusCode).toBe(401);
  });
});
