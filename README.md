# Dream Journal API

![CI](https://github.com/mridul-20/Dream-Journal/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-91%25-brightgreen)

A RESTful API for recording, analyzing, and interpreting dreams. Built with Node.js, Express, and MongoDB.

---

## Tech Stack Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), Cookies
- **Frontend:** React (in `dream-journal-frontend`)
- **Other:** Swagger (API docs), CORS, dotenv

---

## Table of Contents
- [Features & APIs](#features--apis)
- [Database](#database)
- [Setup & Running the Server](#setup--running-the-server)
- [CI/CD & Test Report](#cicd--test-report)
- [Running the Frontend](#running-the-frontend-optional)
- [API Usage & Sample Requests](#api-usage--sample-requests)

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
4. **Start the server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

## CI/CD & Test Report

This project uses **GitHub Actions** for continuous integration and automated testing. Every push and pull request to the `main` branch triggers the following workflow:

- Install dependencies
- Run all tests with coverage
- Upload a detailed coverage report as an artifact

**Latest Coverage Summary:**
- **Statements:** 96% (192/200)
- **Branches:** 89.55% (43/60)
- **Functions:** 92% (23/25)
- **Lines:** 96.74% (189/196)

**Manual Test Report Screenshot:**
<!-- Add your test report screenshot below -->

![Screenshot 2025-06-24 011958](https://github.com/user-attachments/assets/b8cc99c7-b035-49fd-8960-867851b499d2)

**Automated Test Report Screenshot:**

![Screenshot 2025-06-27 195649](https://github.com/user-attachments/assets/e4b6e0b5-c6bf-4add-9751-d98babfe5b60)


---

## Running the Frontend 
If you have a frontend in `dream-journal-frontend`, follow its README or run:
```bash
cd dream-journal-frontend
npm install
npm start
```
The frontend will typically run on `http://localhost:3000`.

![Screenshot 2025-06-20 235415](https://github.com/user-attachments/assets/ce16c4a5-963e-40ef-bc5f-c0989fbdb78f)

![Screenshot 2025-06-20 235435](https://github.com/user-attachments/assets/a773f42d-027b-4a99-b264-e5da3d46dcfb)

![Screenshot 2025-06-20 235755](https://github.com/user-attachments/assets/2c259292-f31f-4969-b878-2743de139b65)

---

## API Usage & Sample Requests

### **Register a User**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "username": "dreamer1",
  "email": "dreamer@example.com",
  "password": "password123"
}' http://localhost:5000/api/auth/register
```
**Response:**
```json
{
  "success": true,
  "token": "<JWT_TOKEN>"
}
```

### **Login**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "dreamer@example.com",
  "password": "password123"
}' http://localhost:5000/api/auth/login
```
**Response:**
```json
{
  "success": true,
  "token": "<JWT_TOKEN>"
}
```

### **Create a Dream**
```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>" -d '{
  "title": "Flying over mountains",
  "description": "I was flying over snowy mountains...",
  "emotions": ["joy", "excitement"],
  "tags": ["flying", "mountains"],
  "type": "adventure",
  "lucid": true,
  "rating": 4
}' http://localhost:5000/api/dreams
```

### **Get All Dreams**
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/api/dreams
```

### **Get Dream Stats**
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/api/dreams/stats
```
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

---

## API Usage & Sample Requests

See the route files in the `routes/` directory for more endpoints and details.

---



## Notes
- All protected routes require a valid JWT token in the `Authorization` header: `Bearer <JWT_TOKEN>`
- Make sure MongoDB is running and accessible from your connection string.
- For more endpoints and details, see the route files in the `routes/` directory. 
