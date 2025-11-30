# GoalXI API

Backend RESTful API for the GoalXI football manager web game.

## Description

GoalXI is a pixel-art football manager game where you can create, manage, and customize your own team of players. This API provides the backend services for player management, authentication, and game data.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL 16 with [TypeORM](https://typeorm.io/)
- **Cache/Queue**: Redis
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: JWT with refresh tokens
- **Validation**: class-validator & class-transformer
- **Testing**: Jest (Unit & E2E)
- **Package Manager**: pnpm

## Features

- 🎮 **Player Management**: Full CRUD operations for football players
- 🎨 **Player Customization**: Customize appearance (skin tone, hair, jersey, accessories)
- 📊 **Player Stats**: Speed, Power, and Skill attributes
- 🔐 **Authentication**: JWT-based auth with refresh tokens
- 👥 **User Management**: User registration and profile management
- 🎲 **Random Player Generator**: Generate random players with realistic names and stats
- 📝 **API Documentation**: Interactive Swagger UI

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v9+)
- Docker & Docker Compose (for local development)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Running with Docker (Recommended)

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d db redis

# Run database migrations
pnpm migration:up

# Start the API in development mode
pnpm start:dev
```

The API will be available at `http://localhost:3000`

### Running without Docker

If you prefer to run PostgreSQL and Redis locally:

1. Update `.env` with your local database credentials:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=goalxi
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

2. Create the database:
   ```bash
   pnpm db:create
   ```

3. Run migrations:
   ```bash
   pnpm migration:up
   ```

4. Start the API:
   ```bash
   pnpm start:dev
   ```

## API Documentation

Once the API is running, access the interactive Swagger documentation at:

**http://localhost:3000/api-docs**

### Available Endpoints

#### Players
- `POST /api/players` - Create a new player
- `GET /api/players` - List all players (with pagination)
- `GET /api/players/:id` - Get a specific player
- `PATCH /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player
- `POST /api/players/generate` - Generate random players

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

#### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile

## Development

### Available Scripts

```bash
# Development
pnpm start:dev          # Start in watch mode
pnpm start:debug        # Start in debug mode

# Building
pnpm build              # Build for production

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage
pnpm test:e2e           # Run end-to-end tests

# Database
pnpm migration:generate # Generate a new migration
pnpm migration:up       # Run migrations
pnpm migration:down     # Revert last migration
pnpm db:create          # Create database
pnpm db:drop            # Drop database
pnpm seed:run           # Run database seeds

# Code Quality
pnpm lint               # Lint code
pnpm format             # Format code with Prettier
```

### Project Structure

```
src/
├── api/                 # API modules
│   ├── auth/           # Authentication module
│   ├── player/         # Player CRUD module
│   └── user/           # User management module
├── common/             # Shared DTOs and utilities
├── config/             # Configuration files
├── database/           # Database entities and migrations
├── decorators/         # Custom decorators
├── filters/            # Exception filters
├── guards/             # Auth guards
├── utils/              # Utility functions
└── main.ts             # Application entry point
```

## Environment Variables

Key environment variables (see `.env.example` for full list):

```env
# Application
NODE_ENV=development
APP_PORT=3000
API_PREFIX=api

# Database
DATABASE_HOST=localhost
DATABASE_PORT=25432
DATABASE_NAME=goalxi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispass

# JWT
AUTH_JWT_SECRET=your-secret-key
AUTH_JWT_TOKEN_EXPIRES_IN=1d
```

## Docker Services

The `docker-compose.yml` includes:

- **PostgreSQL 16**: Database (port 25432)
- **Redis Stack**: Cache and queue management (port 6379)
- **pgAdmin**: Database management UI (port 18080)

Access pgAdmin at `http://localhost:18080` with:
- Email: `admin@example.com`
- Password: `12345678`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
