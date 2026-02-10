# Weather Tracker Application

Full-stack weather tracking application with user authentication, real-time weather data from the National Weather Service, and personalized city tracking.

---

## 🌤️ Overview

Weather Tracker is a modern web application that allows users to:
- **Search** for US cities and view current weather conditions
- **Track** favorite cities on a personalized dashboard
- **View** 7-day weather forecasts with detailed information
- **Authenticate** securely with JWT-based authentication

**Tech Stack:**
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **External APIs:** National Weather Service (NWS), Nominatim (OpenStreetMap)

---

## 📁 Project Structure

```
opg-assessment/
├── frontend/              # Next.js React frontend
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React context providers
│   ├── lib/              # Utility functions and API client
│   └── stories/          # Storybook component stories
│
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Express middleware (auth, etc.)
│   │   ├── db/           # Database models and repositories
│   │   ├── service/      # External API services (NWS, Geocoding)
│   │   └── logger/       # Logging infrastructure
│   └── test/
│       └── postman/      # Postman API test collections
│
├── db/                   # Database setup and migrations
│   ├── init-scripts/     # MongoDB initialization
│   └── tables/           # Legacy SQL (migrated to MongoDB)
│
└── documentation/        # Additional documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose (for database)
- **Git**

### One-Command Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd opg-assessment

# Start database and services with Docker Compose
docker-compose up -d

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Storybook: http://localhost:6006 (run `npm run storybook` in frontend)

### Detailed Setup

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for comprehensive installation instructions, troubleshooting, and configuration options.

---

## 📚 Documentation

### Getting Started
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and installation guide
- **[Frontend README](frontend/README.md)** - Frontend-specific documentation
- **[Backend README](backend/README.md)** - Backend-specific documentation

### API Documentation
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[AUTH_API_DOCUMENTATION.md](backend/AUTH_API_DOCUMENTATION.md)** - Authentication API details
- **[BACKEND_ROUTES_DOCUMENTATION.md](backend/ai_notes/BACKEND_ROUTES_DOCUMENTATION.md)** - Detailed route documentation
- **[NWS-API-DIAGRAM.md](backend/ai_notes/NWS-API-DIAGRAM.md)** - How the NWS API integration works

### Database
- **[Database README](db/README.md)** - Database setup and schema information
- **[MONGOOSE_MIGRATION.md](backend/MONGOOSE_MIGRATION.md)** - PostgreSQL to MongoDB migration notes

### Security & Best Practices
- **[SECURITY_ASSESSMENT.md](SECURITY_ASSESSMENT.md)** - Security analysis and recommendations
- **[Postman Tests](backend/test/postman/README.md)** - API testing guide

### Workflow & Processes
- **[GitWorkflows.md](documentation/GitWorkflows.md)** - Git branching and workflow guidelines
- **[Authentication Summary](AUTHENTICATION_SUMMARY.md)** - Overview of auth implementation
- **[Dashboard Update](DASHBOARD_UPDATE.md)** - Dashboard feature documentation

---

## 🎯 Key Features

### User Features
- ✅ **User Registration & Login** - Secure JWT authentication with httpOnly cookies
- ✅ **City Search** - Search for any US city with autocomplete
- ✅ **Current Weather** - Real-time weather conditions from NWS
- ✅ **7-Day Forecast** - Detailed weather predictions with day/night periods
- ✅ **Tracked Cities** - Save favorite cities to personalized dashboard
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark/Light Theme** - User preference support (planned)

### Technical Features
- ✅ **RESTful API** - Well-documented JSON API
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Input Validation** - Zod schemas for all inputs
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Security Headers** - Helmet middleware protection
- ✅ **CORS Support** - Configurable cross-origin requests
- ✅ **Component Library** - Storybook component documentation
- ✅ **Testing Infrastructure** - Postman collections for API testing
- ✅ **Docker Support** - Containerized deployment ready

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Weather
- `GET /api/weather` - Get weather for coordinates
- `POST /api/weather/multiple` - Get weather for multiple locations
- `GET /api/search` - Search for US cities

### User Cities (Protected)
- `POST /api/user/cities` - Add city to tracked list
- `GET /api/user/cities` - Get all tracked cities
- `DELETE /api/user/cities/:id` - Remove tracked city
- `GET /api/user/cities/weather` - Get weather for all tracked cities

**Full API documentation:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🏗️ Architecture

### Frontend Architecture

```
Next.js App Router
├── App Directory (Pages)
├── React Components (UI)
├── Context Providers (State)
├── API Client (lib/api.ts)
└── Tailwind CSS (Styling)
```

**Key Technologies:**
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Icon library
- **Storybook** - Component development

### Backend Architecture

```
Express.js Application
├── Routes (API Endpoints)
├── Controllers (Business Logic)
├── Middleware (Auth, Validation)
├── Services (External APIs)
├── Repositories (Database Access)
└── Models (Data Schemas)
```

**Key Technologies:**
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Zod** - Schema validation
- **Helmet** - Security headers
- **Bcrypt** - Password hashing
- **Axios** - HTTP client

### External Services

1. **National Weather Service (NWS) API**
   - Weather forecasts and current conditions
   - Official US government data
   - Free, no API key required

2. **Nominatim API (OpenStreetMap)**
   - Geocoding and location search
   - Free, rate-limited to 1 req/sec
   - US locations only

---

## 🔐 Security Features

### Implemented
- ✅ JWT authentication with httpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ Security headers with Helmet
- ✅ CORS protection
- ✅ SameSite cookie protection
- ✅ SQL/NoSQL injection protection
- ✅ XSS protection (React + httpOnly)

### Recommended Enhancements
- ⚠️ Rate limiting (package installed, needs implementation)
- ⚠️ Request size limits
- ⚠️ Enhanced audit logging
- ⚠️ Email verification
- ⚠️ Two-factor authentication

**Full security assessment:** [SECURITY_ASSESSMENT.md](SECURITY_ASSESSMENT.md)

---

## 🧪 Testing

### API Testing (Postman)

```bash
# Import collections from backend/test/postman/
- backend-api-integration-tests.postman_collection.json
- auth-api.postman_collection.json
```

See [Postman Testing Guide](backend/test/postman/README.md)

### Frontend Testing (Storybook)

```bash
cd frontend
npm run storybook
# Open http://localhost:6006
```

### Manual Testing

```bash
# Test backend health
curl http://localhost:4000/health

# Test authentication
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'
```

---

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run typecheck    # Check TypeScript types
```

**Environment Variables:**
```env
NODE_ENV=development
PORT=4000
MONGODB_URL=mongodb://admin:admin123@localhost:27017/weather_tracker
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### Frontend Development

```bash
cd frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook
```

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure production CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB with SSL/TLS
- [ ] Enable rate limiting
- [ ] Setup monitoring and logging
- [ ] Review security settings

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  trackedCities: [
    {
      id: String,
      name: String,
      lat: Number,
      lon: Number,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

See [Database README](db/README.md) for more details.

---

## 🤝 Contributing

### Git Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create pull request to `develop`

See [GitWorkflows.md](documentation/GitWorkflows.md) for detailed guidelines.

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Run `npm run lint` before committing
- **Prettier** - (if configured) Auto-format on save
- **Conventional Commits** - Use clear commit messages

---

## 📝 Environment Setup

### Development Environment

1. **Copy environment files:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Start database:**
   ```bash
   docker-compose up -d mongodb
   ```

3. **Start backend:**
   ```bash
   cd backend && npm run dev
   ```

4. **Start frontend:**
   ```bash
   cd frontend && npm run dev
   ```

### Production Environment

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for production deployment instructions.

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 4000 (backend)
npx kill-port 4000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

**MongoDB connection failed:**
```bash
# Check if MongoDB is running
docker ps

# Restart MongoDB
docker-compose restart mongodb
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting tips.

---

## 📖 Additional Resources

### External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
- [Nominatim API](https://nominatim.org/release-docs/latest/api/Overview/)

### Learning Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Introduction](https://jwt.io/introduction)

---

## 📄 License

[Add your license information here]

---

## 👥 Team

[Add team/contributor information here]

---

## 📞 Support

For issues and questions:
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for setup issues
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API questions
- See [SECURITY_ASSESSMENT.md](SECURITY_ASSESSMENT.md) for security concerns

---

**Last Updated:** February 2026
**Version:** 1.0.0
