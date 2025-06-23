const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should require username and password', async () => {
    try {
      await User.create({ email: 'test@fail.com' });
    } catch (err) {
      expect(err.errors.username).toBeDefined();
      expect(err.errors.password).toBeDefined();
    }
  });

}); 