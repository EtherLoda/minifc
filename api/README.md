# Mini-FC API

Backend RESTful API for the Mini-FC football manager web game.

## Description

This project provides the backend services for Mini-FC, built with NestJS.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **API Documentation**: Swagger
- **Authentication**: JWT
- **Testing**: Jest (Unit & E2E)

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Running the app

```bash
# development
pnpm start

# watch mode
pnpm start:dev

# production mode
pnpm start:prod
```

## Documentation

- [API Documentation](docs/README.md)
