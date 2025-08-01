# Dream Journal API

A RESTful API for recording, analyzing, and interpreting dreams. Built with Node.js, Express, and MongoDB.

---

## Table of Contents
- [Features & APIs](#features--apis)
- [Database](#database)
- [Setup & Running the Server](#setup--running-the-server)
- [Running the Frontend (Optional)](#running-the-frontend-optional)
- [API Usage & Sample Requests](#api-usage--sample-requests)
- [Testing & Coverage](#testing--coverage)

---

## Features & APIs

### **Authentication**
- **POST /api/auth/register** — Register a new user
- **POST /api/auth/login** — Login and receive a JWT token

### **Dreams** (Protected)
- **GET /api/dreams** — Get all dreams for the logged-in user
- **POST /api/dreams** — Create a new dream
- **GET /api/dreams/:id** — Get a single dream by ID
- **PUT /api/dreams/:id** — Update a dream (only your own)
- **DELETE /api/dreams/:id** — Delete a dream (only your own)
- **GET /api/dreams/stats** — Get statistics about your dreams

---

## Database
- **MongoDB** is used for data storage.
- Integration is handled via [Mongoose](https://mongoosejs.com/).
- Connection string is set in the `.env` file as `MONGO_URI`.

---

## Setup & Running the Server

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in `dream-journal-api/` with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   NODE_ENV=development
   PORT=5000
   ```
4. **Seed the database with sample interpretations (optional):**
   ```bash
   node seedInterpretations.js
   ```
5. **Start the server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

## Testing & Coverage

### Running Tests

- To run all tests:
  ```bash
  npm test
  ```
- To run with coverage:
  ```bash
  npm run test:coverage
  ```

### Test Structure & Best Practices
- **Unique emails** are used for each test to avoid duplicate user errors.
- **User cleanup**: All users are deleted before each test to ensure a clean state.
- **Defensive checks**: Tests check for the existence of response data before accessing properties.
- **Error handling**: The API now returns proper status codes for validation errors (400), not found (404), and unauthorized access (401).
- **Coverage**: The test suite is designed to achieve at least 70% coverage, with most files at or above 80%.

### Interpreting Coverage Results
- After running with coverage, a summary will be printed in the terminal and a detailed HTML report will be available in the `coverage/` directory.
- Focus on improving coverage for controllers and error branches if needed.

---

## API Usage & Sample Requests

See the route files in the `routes/` directory for more endpoints and details.

---

## Notes
- All protected routes require a valid JWT token in the `Authorization` header: `Bearer <JWT_TOKEN>`
- Make sure MongoDB is running and accessible from your connection string.
