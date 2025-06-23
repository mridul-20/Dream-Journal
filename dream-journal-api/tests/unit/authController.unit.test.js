process.env.JWT_SECRET = '4a0c52d0c7375d8d92a5d1072b0c9dba53ff094efbba5dc0274716c7018329eaa2dd3d3d8bf336cd5372dd25df4d145771ccdfa6744a35153cd3a534ec1e50ba';

const {
  register,
  login,
  logout,
  getMe,
  authorize 
} = require('../../controllers/authController');

const { protect, authorize: authz } = require('../../middlewares/auth'); // alias to avoid duplicate names

const User = require('../../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  res.cookie = jest.fn();
  return res;
};

const mockNext = jest.fn();

describe('AuthController - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Logout
  test('logout should clear token cookie', async () => {
    const req = {};
    const res = mockRes();
    await logout(req, res);
    expect(res.cookie).toHaveBeenCalledWith('token', 'none', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
  });

  // Protect Middleware
  test('protect should allow access if token valid', async () => {
    const req = { headers: { authorization: 'Bearer token123' } };
    const res = mockRes();
    const user = { id: 'u123' };
    jwt.verify.mockReturnValue({ id: 'u123' });
    User.findById.mockResolvedValue(user);

    await protect(req, res, mockNext);

    expect(req.user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
  });

  test('protect should extract token from cookies', async () => {
    const req = { headers: {}, cookies: { token: 'cookieToken123' } };
    const res = mockRes();
    const user = { id: 'u456' };
    jwt.verify.mockReturnValue({ id: 'u456' });
    User.findById.mockResolvedValue(user);

    await protect(req, res, mockNext);

    expect(req.user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
  });

  test('protect should return error if no token', async () => {
    const req = { headers: {}, cookies: {} };
    const res = mockRes();

    await protect(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  test('protect should throw error if token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalidToken' }, cookies: {} };
    const res = mockRes();
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await protect(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  // Authorize Middleware
  test('authorize should allow roles', () => {
    const req = { user: { role: 'admin' } };
    const res = mockRes();
    const next = jest.fn();
    const middleware = authz('admin', 'user');
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('authorize should block disallowed roles', () => {
    const req = { user: { role: 'guest' } };
    const res = mockRes();
    const next = jest.fn();
    const middleware = authz('admin', 'user');
    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  // Register
  test('register should return error if user already exists', async () => {
    const req = {
      body: { username: 'user1', email: 'user@example.com', password: 'pass123' }
    };
    const res = mockRes();
    const next = jest.fn();
    User.findOne.mockResolvedValue({ email: 'user@example.com' });

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('register should register user successfully', async () => {
    const req = {
      body: { username: 'newuser', email: 'new@example.com', password: 'password123' }
    };
    const res = mockRes();
    const next = jest.fn();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: '123',
      username: 'newuser',
      email: 'new@example.com',
      password: undefined
    });

    jwt.sign.mockReturnValue('mocked.jwt.token');

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: 'mocked.jwt.token',
      user: {
        id: '123',
        username: 'newuser',
        email: 'new@example.com'
      }
    });
  });

  // Login
  test('login should return error if email or password missing', async () => {
    const req = { body: { email: '', password: '' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('login should return error if user not found', async () => {
    const req = { body: { email: 'unknown@example.com', password: '123456' } };
    const res = mockRes();
    const next = jest.fn();
    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('login should return error if password does not match', async () => {
    const req = { body: { email: 'user@example.com', password: 'wrongpass' } };
    const res = mockRes();
    const next = jest.fn();

    const matchPassword = jest.fn().mockResolvedValue(false);

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        matchPassword,
        _id: 'userId',
        username: 'user1',
        email: 'user@example.com'
      })
    });

    await login(req, res, next);

    expect(matchPassword).toHaveBeenCalledWith('wrongpass');
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('login should login user successfully', async () => {
    const req = { body: { email: 'user@example.com', password: 'correctpass' } };
    const res = mockRes();
    const next = jest.fn();

    const matchPassword = jest.fn().mockResolvedValue(true);

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        matchPassword,
        _id: 'userId',
        username: 'user1',
        email: 'user@example.com'
      })
    });

    jwt.sign.mockReturnValue('valid.jwt.token');

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: 'valid.jwt.token',
      user: {
        id: 'userId',
        username: 'user1',
        email: 'user@example.com'
      }
    });
  });
});
