# SEF Admin Panel Server

[![NestJS](https://img.shields.io/badge/NestJS-9.0.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-blue.svg)](https://www.typescriptlang.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.20-green.svg)](https://typeorm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.11.3-blue.svg)](https://www.postgresql.org/)
[![Jest](https://img.shields.io/badge/Jest-29.5.0-yellow.svg)](https://jestjs.io/)

A comprehensive NestJS-based backend server for the SEF (Student Excellence Foundation) Admin Panel, providing robust APIs for managing student applications, programs, cycles, and administrative operations.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Database Management](#database-management)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

The SEF Admin Panel Server is a robust backend application built with NestJS that provides comprehensive APIs for managing student applications, programs, cycles, and administrative operations. It features a modular architecture with proper separation of concerns, comprehensive testing, and production-ready deployment configurations.

## ✨ Features

### Core Functionality
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Student Applications Management**: Complete CRUD operations for student applications
- **Program Management**: Manage educational programs and their configurations
- **Cycle Management**: Handle application cycles and deadlines
- **User Management**: Admin and user account management
- **Reporting System**: Generate comprehensive reports and analytics
- **Statistics Dashboard**: Real-time statistics and analytics
- **Email Notifications**: Automated email system for notifications
- **Data Migration**: Tools for data migration and management
- **Health Monitoring**: Application health checks and monitoring

### Technical Features
- **Modular Architecture**: Clean separation of concerns with domain-driven design
- **TypeORM Integration**: Advanced database operations with PostgreSQL
- **Comprehensive Testing**: Unit tests, integration tests, and e2e tests
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Performance Monitoring**: Built-in performance interceptors and monitoring
- **CORS Support**: Configured for cross-origin requests
- **Environment Management**: Multi-environment configuration support
- **Docker Support**: Containerized deployment with Docker and Docker Compose

## 🏗️ Architecture

### Project Structure
```
src/
├── core/                    # Core application configuration
│   ├── config/             # Database, server, and environment configs
│   ├── data/              # Database entities, types, and helpers
│   ├── helpers/           # Utility functions and helpers
│   ├── interceptors/      # Global interceptors
│   ├── settings/          # Base classes and settings
│   └── types/             # TypeScript type definitions
├── domain/                # Business logic modules
│   ├── admins/            # Admin management
│   ├── applications/      # Student applications
│   ├── auth/             # Authentication and authorization
│   ├── cycles/            # Application cycles
│   ├── decisionDates/     # Decision date management
│   ├── healthCheck/       # Health monitoring
│   ├── information/       # Information management
│   ├── mail/             # Email services
│   ├── microcamp/         # Microcamp management
│   ├── microcampApplications/ # Microcamp applications
│   ├── performance/      # Performance monitoring
│   ├── programs/         # Program management
│   ├── reports/          # Reporting system
│   ├── sections/         # Section management
│   ├── statistics/       # Statistics and analytics
│   ├── thresholds/       # Threshold management
│   └── users/            # User management
├── app.controller.ts     # Main application controller
├── app.module.ts         # Root application module
├── app.service.ts        # Main application service
└── main.ts              # Application entry point
```

### Module Architecture
Each domain module follows a consistent pattern:
- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **Repository**: Manages data access
- **Mediator**: Orchestrates complex operations
- **DTOs**: Data transfer objects for validation
- **Entities**: TypeORM database entities

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Docker** (optional, for containerized deployment)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sef-admin-panel-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb sef_admin_panel
   
   # Run migrations
   npm run migration:run
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
SERVER_PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=sef_admin_panel

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration (if using email features)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_password

# CORS Configuration
ALLOWED_ORIGINS=https://sef-admin-panel.vercel.app,http://localhost:3000
```

### Database Configuration

The application uses TypeORM with PostgreSQL. Database configuration is handled in `src/core/config/db/db.data.source.ts`.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start in development mode with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker compose up --build

# Or build and run individually
docker build -t sef-admin-panel .
docker run -p 3000:3000 sef-admin-panel
```

## 🧪 Testing

The application includes comprehensive testing with Jest:

### Running Tests
```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Test Structure
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Test Coverage
The application maintains high test coverage across all modules:
- Controllers: HTTP request/response handling
- Services: Business logic
- Repositories: Data access layer
- Mediators: Complex operation orchestration

## 🗄️ Database Management

### Migrations
```bash
# Generate a new migration
npm run migration:generate

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Database Schema
The application uses TypeORM entities for database schema management. Key entities include:
- **Users**: User accounts and profiles
- **Applications**: Student applications
- **Programs**: Educational programs
- **Cycles**: Application cycles
- **Thresholds**: Application thresholds
- **Sections**: Program sections

## 📚 API Documentation

### Swagger Documentation
Once the application is running, access the auto-generated API documentation at:
```
http://localhost:3000/api-docs
```

### API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

#### Applications
- `GET /applications` - List applications
- `POST /applications` - Create application
- `GET /applications/:id` - Get application details
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application

#### Programs
- `GET /programs` - List programs
- `POST /programs` - Create program
- `GET /programs/:id` - Get program details
- `PUT /programs/:id` - Update program

#### Reports
- `POST /reports/generate` - Generate reports
- `GET /reports/:type` - Get specific report types

#### Statistics
- `GET /statistics` - Get application statistics
- `GET /statistics/dashboard` - Get dashboard statistics

## 🚀 Deployment

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Docker Deployment
```bash
# Build Docker image
docker build -t sef-admin-panel .

# Run container
docker run -d -p 3000:3000 --name sef-admin-panel sef-admin-panel
```

### Systemd Service (Linux)
```bash
# Create service file
sudo nano /etc/systemd/system/admin-prod.service

# Enable and start service
sudo systemctl enable admin-prod.service
sudo systemctl start admin-prod.service
```

### Redeployment Scripts
```bash
# Redeploy production
npm run redeploy

# Redeploy development
npm run redeploy:dev
```

## 👨‍💻 Development

### Code Style
The project uses ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Adding New Features
1. Create a new module in `src/domain/`
2. Follow the established pattern (Controller, Service, Repository, Mediator)
3. Add comprehensive tests
4. Update API documentation
5. Add database migrations if needed

### Module Development Pattern
```typescript
// Example module structure
src/domain/example/
├── example.controller.ts
├── example.service.ts
├── example.repository.ts
├── example.mediator.ts
├── example.module.ts
├── dtos/
│   └── create-example.dto.ts
├── entities/
│   └── example.entity.ts
└── __tests__/
    ├── example.controller.spec.ts
    ├── example.service.spec.ts
    ├── example.repository.spec.ts
    ├── example.mediator.spec.ts
    └── __mocks__/
        └── example.factory.ts
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Use proper error handling
- Follow NestJS conventions
- Document new APIs


---

**Built with ❤️ using NestJS**