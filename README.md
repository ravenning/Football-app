# Football-app
A casual app where users can be coaches and players and pick among themselves, register thier team and book matches with other registered teams, plan formations and the likes with the tools available

# Football Management App

A comprehensive football team management application with modern UI, real-time analytics, and secure authentication.

## Features

### Frontend (React + TypeScript + Vite)
- **Professional Dashboard**: Real-time team analytics and availability tracking
- **WhatsApp-Style Chat**: Integrated messaging system between coaches and players
- **Persistent Data**: Local storage for offline functionality
- **Responsive Design**: Modern UI with dark theme and green accents
- **Player Management**: Add, update, and track player information

### Backend (Node.js + Express + MongoDB)
- **JWT Authentication**: Secure user registration and login
- **RESTful API**: Complete CRUD operations for players
- **Data Security**: Password hashing and protected routes
- **User Isolation**: Each user can only access their own data

## Project Structure

```
football-project/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── store/             # Zustand state management
│   └── ...
├── backend/               # Backend API server
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   └── server.js         # Express server
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
MONGODB_URI=mongodb://localhost:27017/football_app
PORT=5000
```

4. Start MongoDB service

5. Run the backend server:
```bash
npm run dev  # Development mode
npm start    # Production mode
```

### Frontend Setup

1. Navigate to root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## API Documentation


### Authentication Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Player Endpoints (Protected)
- `GET /api/players` - Get all players for authenticated user
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Technologies Used

### Frontend
- React 19
- TypeScript
- Vite
- Zustand (State Management)
- Tailwind CSS (Styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- bcryptjs (Password Hashing)
- CORS

## Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- User data isolation
- CORS configuration

## Production Deployment

### Backend Deployment

1. **Environment Setup**:
```bash
cd backend
cp .env.production .env
```

2. **Update Production Environment Variables**:
Edit `.env` with your production values:
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_make_it_very_long_and_random
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/football_app
PORT=5000
NODE_ENV=production
```

3. **Install Dependencies**:
```bash
npm install --production
```

4. **Start Production Server**:
```bash
npm start
```

### Frontend Deployment

1. **Environment Setup**:
```bash
cp .env.production .env
```

2. **Update API URL**:
Edit `.env` with your production API URL:
```env
VITE_API_URL=https://your-api-domain.com/api
```

3. **Build for Production**:
```bash
npm run build
```

4. **Deploy the `dist` folder** to your web server (Netlify, Vercel, etc.)

### Deployment Platforms

#### Vercel (Frontend)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set environment variables
3. Database URL should point to MongoDB Atlas
4. Deploy automatically

#### MongoDB Atlas
1. Create a cluster
2. Set up database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string for `MONGODB_URI`

### Security Checklist

- [ ] Change JWT_SECRET to a long, random string
- [ ] Use HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting (optional)
- [ ] Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

