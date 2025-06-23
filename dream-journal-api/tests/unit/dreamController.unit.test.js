const {
    createDream,
    getDream,
    getDreams,
    updateDream,
    deleteDream
  } = require('../../controllers/dreamController');
  
  const Dream = require('../../models/Dream');
  jest.mock('../../models/Dream');
  
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
  };
  
  const mockNext = jest.fn();
  
  describe('DreamController - Unit Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('createDream should save dream and return it', async () => {
      const req = {
        user: { id: 'u123' },
        body: { title: 'Dream 1', description: 'Flying in sky', emotions: ['joy'] }
      };
      const res = mockRes();
  
      Dream.create.mockResolvedValue({ ...req.body, user: 'u123' });
  
      await createDream(req, res, mockNext);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ title: 'Dream 1' })
      }));
    });
  
    test('getDream should return dream for ID', async () => {
      const req = {
        params: { id: 'dream1' },
        user: { id: 'u123' }
      };
      const res = mockRes();
  
      const mockWhere = jest.fn().mockReturnValue({
        _id: 'dream1',
        title: 'Dream 1',
        user: 'u123'
      });
  
      Dream.findById.mockReturnValue({ where: mockWhere });
  
      await getDream(req, res, mockNext);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ title: 'Dream 1' })
      }));
    });
  
    test('getDream should return 404 if dream not found', async () => {
      const req = {
        params: { id: 'nonexistent' },
        user: { id: 'u123' }
      };
      const res = mockRes();
  
      Dream.findById.mockReturnValue({ where: jest.fn().mockReturnValue(null) });
  
      await getDream(req, res, mockNext);
  
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  
    test('getDreams should return user\'s dreams', async () => {
      const mockDreams = [{ title: 'Dream 1', user: 'u123' }];
      const req = {
        user: { id: 'u123' },
        query: {}
      };
      const res = mockRes();
  
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue(Promise.resolve(mockDreams))
      };
  
      Dream.find.mockReturnValue(mockQuery);
      Dream.countDocuments.mockReturnValue({
        where: jest.fn().mockResolvedValue(mockDreams.length)
      });
  
      await getDreams(req, res, mockNext);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        count: mockDreams.length,
        data: mockDreams,
        pagination: expect.any(Object)
      }));
    });
  
    test('updateDream should update a dream and return it', async () => {
      const req = {
        params: { id: 'dream1' },
        user: { id: 'u123' },
        body: {
          title: 'Updated Dream',
          description: 'Updated description',
          emotions: ['joy'],
          tags: ['tag1'],
          type: 'lucid',
          lucid: true,
          rating: 5
        }
      };
      const res = mockRes();
  
      Dream.findById.mockResolvedValue({ user: { toString: () => 'u123' } });
  
      Dream.findByIdAndUpdate.mockResolvedValue({
        ...req.body,
        user: 'u123'
      });
  
      await updateDream(req, res, mockNext);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          title: 'Updated Dream',
          description: 'Updated description'
        })
      }));
    });
  
    test('updateDream should return 401 if user is not authorized', async () => {
      const req = {
        params: { id: 'dream1' },
        user: { id: 'u123' },
        body: {}
      };
      const res = mockRes();
  
      Dream.findById.mockResolvedValue({ user: { toString: () => 'otherUser' } });
  
      await updateDream(req, res, mockNext);
  
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  
    test('deleteDream should delete the dream', async () => {
      const req = {
        params: { id: 'dream1' },
        user: { id: 'u123' }
      };
      const res = mockRes();
  
      const deleteMock = jest.fn();
      Dream.findById.mockResolvedValue({
        user: { toString: () => 'u123' },
        deleteOne: deleteMock
      });
  
      await deleteDream(req, res, mockNext);
  
      expect(deleteMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {}
      });
    });
  
    test('deleteDream should return 404 if dream not found', async () => {
      const req = {
        params: { id: 'dream999' },
        user: { id: 'u123' }
      };
      const res = mockRes();
  
      Dream.findById.mockResolvedValue(null);
  
      await deleteDream(req, res, mockNext);
  
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  
    test('deleteDream should return 401 if user not authorized', async () => {
      const req = {
        params: { id: 'dream999' },
        user: { id: 'u123' }
      };
      const res = mockRes();
  
      Dream.findById.mockResolvedValue({
        user: { toString: () => 'unauthorized' }
      });
  
      await deleteDream(req, res, mockNext);
  
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  