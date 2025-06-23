const errorHandler = require('../../middlewares/errorHandler');

describe('Error Handler Middleware', () => {
  let res, req, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('handles Mongoose CastError', () => {
    const err = { name: 'CastError', value: 'badid', stack: '' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('handles Mongoose duplicate key error', () => {
    const err = { code: 11000, stack: '' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('handles Mongoose validation error', () => {
    const err = { name: 'ValidationError', errors: { field: { message: 'Invalid' } }, stack: '' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('handles generic error', () => {
    const err = { message: 'Something went wrong', stack: '' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
}); 