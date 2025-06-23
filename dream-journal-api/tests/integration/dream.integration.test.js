const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Dream = require('../../models/Dream');
require('dotenv').config({ path: 'tests/test.env' });

let token, userId, otherUserId, otherToken, dreamId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({});
  await Dream.deleteMany({});

  // Create and login a user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ username: 'dreamuser', email: 'dreamuser@example.com', password: 'dreampass123' });
  token = userRes.body.token;
  userId = userRes.body._id || userRes.body.user?._id || userRes.body.data?._id;
  
  if (!userId) {
    console.error('Registration response:', userRes.body);
    throw new Error('Could not get user ID from registration response');
  }

  // Create and login another user
  const otherRes = await request(app)
    .post('/api/auth/register')
    .send({ username: 'otheruser', email: 'otheruser@example.com', password: 'otherpass123' });
  otherToken = otherRes.body.token;
  otherUserId = otherRes.body._id || otherRes.body.user?._id || otherRes.body.data?._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Dream.deleteMany({});
});

describe('Dream Controller Integration Error Cases', () => {
  it('should return 404 for non-existent dream', async () => {
    const fakeId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
      .get(`/api/dreams/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 if user tries to update another user\'s dream', async () => {
    const dreamRes = await request(app)
      .post('/api/dreams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dream',
        description: 'desc',
        emotions: ['joy'],
        tags: ['tag'],
        type: 'adventure',
        lucid: false,
        rating: 3
      });
    
    dreamId = dreamRes.body.data._id;
    expect(dreamId).toBeDefined();

    // Try to update as other user
    const res = await request(app)
      .put(`/api/dreams/${dreamId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 if user tries to delete another user\'s dream', async () => {
    const dreamRes = await request(app)
      .post('/api/dreams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dream',
        description: 'desc',
        emotions: ['joy'],
        tags: ['tag'],
        type: 'adventure',
        lucid: false,
        rating: 3
      });
    
    dreamId = dreamRes.body.data._id;
    expect(dreamId).toBeDefined();

    // Try to delete as other user
    const res = await request(app)
      .delete(`/api/dreams/${dreamId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for dream creation with missing required fields', async () => {
    const res = await request(app)
      .post('/api/dreams')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        title: 'Incomplete Dream',
        type: 'adventure' // type is required
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should handle pagination and select/sort query params', async () => {
    // Create multiple dreams
    const dreams = [];
    for (let i = 0; i < 5; i++) {
      dreams.push({
        title: `Dream${i}`,
        description: 'desc',
        emotions: ['joy'],
        tags: ['tag'],
        type: 'adventure',
        lucid: false,
        rating: 3,
        user: userId
      });
    }
    await Dream.insertMany(dreams);

    const res = await request(app)
      .get('/api/dreams?select=title&sort=title&page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination).toBeDefined();
  });
});