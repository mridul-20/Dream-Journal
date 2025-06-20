# Dream Journal API

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
- [Running the Frontend (Optional)](#running-the-frontend-optional)
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

### **Interpretations**
- **GET /api/interpretations/random** — Get a random or keyword-based dream interpretation
- **GET /api/interpretations** — (Admin only) Get all interpretations
- **POST /api/interpretations** — (Admin only) Create a new interpretation

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

### **Get a Random Interpretation**
```bash
curl http://localhost:5000/api/interpretations/random
```

---

## Notes
- All protected routes require a valid JWT token in the `Authorization` header: `Bearer <JWT_TOKEN>`
- Make sure MongoDB is running and accessible from your connection string.
- For more endpoints and details, see the route files in the `routes/` directory. 
