# Football Management App - Backend

Express.js API server with JWT authentication for the Football Management App.

## Features

- JWT Authentication (register/login)
- Player CRUD operations
- MongoDB with Mongoose
- CORS enabled
- Password hashing with bcrypt

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
MONGODB_URI=mongodb://localhost:27017/football_app
PORT=5000
```

3. Start MongoDB locally or update MONGODB_URI for your database

4. Run the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Players (Protected Routes)
- `GET /api/players` - Get all players for authenticated user
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

## Authentication

All player routes require JWT token in Authorization header:
```
Authorization: <jwt_token>
```

## Data Models

### User
- name: String (required)
- email: String (required, unique)
- password: String (hashed, required)
- role: String (Manager/Player, default: Manager)

### Player
- name: String (required)
- position: String (default: 'Position TBD')
- status: String (Available/Injured/Absent, default: Available)
- userId: ObjectId (references User, required)