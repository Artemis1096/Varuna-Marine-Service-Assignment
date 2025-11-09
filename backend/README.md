# FuelEU Maritime Compliance Platform - Backend

Backend API for the FuelEU Maritime Compliance Platform, built with TypeScript, Express, and following Hexagonal Architecture (Ports & Adapters) pattern.

## Project Structure

```
backend/
├── src/
│   ├── core/
│   │   ├── domain/      # Core business logic (entities, value objects)
│   │   ├── application/ # Application services and use cases
│   │   └── ports/       # Interfaces (repository ports, service ports)
│   ├── adapters/
│   │   ├── ui/          # Express routes and controllers
│   │   └── infrastructure/ # Database adapters (Prisma repositories)
│   ├── shared/          # Shared utilities and helpers
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma   # Prisma schema file
├── dist/                # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/fuel_eu_db
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Test database connection:
```bash
npm run db:test
```

5. Run in development mode:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
npm start
```

## Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters):

- **core/domain**: Pure business logic entities and value objects, no dependencies on external frameworks
- **core/application**: Application services and use cases that orchestrate domain logic
- **core/ports**: Interfaces that define contracts (e.g., `IRouteRepository`)
- **adapters/ui**: Express routes and controllers (HTTP layer)
- **adapters/infrastructure**: Database adapters and external service implementations (e.g., `PrismaRouteRepository`)
- **shared**: Shared utilities, helpers, and common types

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without emitting files
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Run database migrations
- `npm run db:test` - Test database connection

