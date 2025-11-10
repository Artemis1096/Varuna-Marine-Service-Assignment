# FuelEU Maritime Compliance Platform

## Overview

The FuelEU Maritime Compliance Platform is a comprehensive full-stack application designed to help maritime operators comply with the European Union's FuelEU Maritime Regulation (EU) 2023/1805. This regulation aims to reduce greenhouse gas (GHG) emissions from the maritime transport sector by setting intensity targets and implementing compliance mechanisms.

## Screenshots

### Routes Page
![Routes Page](assets/img1.png)

The Routes page displays all shipping routes with comprehensive data including vessel types, fuel consumption, distances, and emissions. Users can filter routes by vessel type, fuel type, and year, and set baseline routes for comparison.

### Compare Page
![Compare Page](assets/img2.png)

The Compare page shows GHG intensity comparisons between baseline and other routes. It displays percentage differences, compliance status indicators, and visual charts comparing route intensities.

### Banking Page
![Banking Page](assets/img3.png)

The Banking page implements FuelEU Article 20, allowing users to bank surplus compliance credits and apply them to offset deficits. It displays KPIs including CB (before), Applied amount, and CB (after).

### Pooling Page
![Pooling Page](assets/img4.png)

The Pooling page implements FuelEU Article 21, enabling users to create pooling groups to redistribute compliance balances among multiple routes. It shows adjusted CB values, pool sum indicators, and before/after results.

### About Page
![About Page](assets/img5.png)

The About page provides comprehensive documentation about the platform's functionality, purpose, core formulas, and technical details.

### Key Features

- **Route Management**: Track and manage shipping routes with comprehensive data including vessel types, fuel consumption, distances, and emissions
  - Filter routes by vessel type, fuel type, and year
  - Set baseline routes with loading states and validation
- **Baseline Setting**: Designate reference routes for GHG intensity comparisons
- **GHG Intensity Comparison**: Compare routes against baseline to assess compliance status
  - Calculate percentage difference: `percentDiff = ((comparison / baseline) - 1) × 100`
  - Visual charts showing baseline vs. comparison intensities
  - Compliance status indicators (✅/❌)
- **Compliance Balance (CB) Calculation**: Calculate surplus or deficit positions based on target intensity
  - Adjusted CB calculation (accounts for applied banked surplus)
  - KPI display with automatic formatting (tonnes or grams)
- **Banking (Article 20)**: Bank surplus compliance credits for future use and apply them to offset deficits
  - View CB (before), Applied amount, and CB (after)
  - Validation with machine-readable error codes
  - Button state management (disabled during operations)
- **Pooling (Article 21)**: Create pooling groups to redistribute compliance balances among multiple routes
  - Adjusted CB values for accurate pooling
  - Pool validation rules (sum ≥ 0, deficit/surplus requirements)
  - Visual indicators (green/red pool sum)
  - Greedy allocation algorithm for redistribution
- **User Experience**: 
  - Shared UI components (ErrorBanner, Loading, SuccessBanner)
  - Normalized error handling across all pages
  - Dark mode support with theme persistence
  - Centralized theme system for consistent styling

### Core Formulas

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ
- **Energy in Scope**: Energy (MJ) ≈ fuelConsumption × 41,000 MJ/t
- **Compliance Balance**: CB = (Target − Actual) × Energy in scope
  - Positive CB → Surplus (better than target)
  - Negative CB → Deficit (worse than target)

## Tech Stack

### Backend

- Node.js + TypeScript

- Express

- PostgreSQL + Prisma ORM

- Hexagonal Architecture (Ports & Adapters)

### Frontend

- React + TypeScript
- TailwindCSS (with centralized theme system)
- Recharts (visualization)
- Axios API Adapters
- Shared UI Components (ErrorBanner, Loading, SuccessBanner)
- Dark Mode Support

---

## Architecture Summary

This project follows **Hexagonal Architecture** (also known as Ports & Adapters), which separates business logic from external concerns like databases, web frameworks, and UI. This design pattern ensures that the core business rules remain independent and testable.

### Architecture Structure

```
backend/
  src/
    core/                    # Business rules (pure, no external dependencies)
      domain/                # Domain entities and value objects
      application/            # Use cases and application services
        services/            # Business logic services (e.g., computeGHGIntensity, computeCB)
        ports/               # Inbound ports (interfaces for use cases)
      ports/                 # Outbound ports (repository interfaces)
    adapters/
      inbound/http/          # Express controllers (HTTP entry points)
      outbound/postgres/     # Prisma repositories (database adapters)
    infrastructure/          # Database client, server configuration
    shared/                  # Shared utilities and helpers

frontend/
  src/
    adapters/outbound/api/   # API client adapters (HTTP requests)
    core/ports/              # Port interfaces for frontend services
    pages/                   # React page components
    shared/                  # Shared components, hooks, utilities, and theme
      constants/             # Shared constants (e.g., FuelEU target intensity)
      theme.ts               # Centralized Tailwind CSS classNames
    ui/components/           # Shared UI components (ErrorBanner, Loading, SuccessBanner)
```

### Architecture Benefits

- **Separation of Concerns**: Business logic is isolated from infrastructure details
- **Testability**: Core logic can be tested without databases or HTTP servers
- **Flexibility**: Easy to swap implementations (e.g., change database or API framework)
- **Maintainability**: Clear boundaries make the codebase easier to understand and modify

---

## Setup & Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/fuel_eu_db
   ```
   Replace `user`, `password`, and `fuel_eu_db` with your PostgreSQL credentials.

4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database (optional):**
   ```bash
   npm run prisma
   ```

7. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend API will be available at: **http://localhost:3000**

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend application will be available at: **http://localhost:5173**

### Running Both Services

To run both backend and frontend simultaneously, open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Production Build

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
npm run preview
```

---

## How to Execute Tests

### Backend Tests

The backend uses Jest as the testing framework with TypeScript support.

**Run all tests:**
```bash
cd backend
npm test
```

**Run tests in watch mode (for development):**
```bash
cd backend
npm run test:watch
```

**Run tests with coverage report:**
```bash
cd backend
npm run test:coverage
```

**Test structure:**
- Test files are located in `backend/tests/` directory
- Test files follow the naming pattern: `*.test.ts` or `*.spec.ts`
- Example: `backend/tests/computeGHGIntensity.test.ts`

### Frontend Tests

Currently, the frontend does not have a test suite configured. To add testing:

1. Install a testing framework (e.g., Vitest, Jest, or React Testing Library)
2. Create test files in a `tests` or `__tests__` directory
3. Add test scripts to `frontend/package.json`

### Database Connection Test

To verify database connectivity:
```bash
cd backend
npm run db:test
```

## API Endpoints (Key)

| Endpoint | Method | Description | Query Parameters |
|---------|--------|-------------|------------------|
| `/routes` | GET | List all routes | `vesselType`, `fuelType`, `year` |
| `/routes/:code/baseline` | POST | Set baseline route | - |
| `/routes/comparison` | GET | Compare GHG intensities | - |
| `/compliance/cb` | GET | Compute CB for route/year | `shipId`, `year` |
| `/compliance/adjusted-cb` | GET | Get adjusted CB per ship | `year` |
| `/banking/bank` | POST | Bank positive CB | - |
| `/banking/apply` | POST | Apply banked CB to deficit | - |
| `/pools` | POST | Create pooling group and redistribute CB | - |

### API Response Format

All API endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `MISSING_PARAMS`: Required parameters are missing
- `CB_NOT_POSITIVE`: Cannot bank deficit or zero balance
- `INVALID_AMOUNT`: Amount must be greater than zero
- `AMOUNT_EXCEEDS_AVAILABLE`: Amount exceeds available CB or banked surplus
- `NO_BANKED_SURPLUS`: No banked surplus available to apply
- `POOL_SUM_NEGATIVE`: Pool sum must be non-negative
- `DEFICIT_SHIP_WORSE`: Deficit ship cannot end up worse after pooling
- `SURPLUS_SHIP_NEGATIVE`: Surplus ship cannot end up negative after pooling

## User Interface Features

### Shared Components

The platform uses consistent, reusable UI components across all pages:

- **ErrorBanner**: Displays API errors with error codes and dismissible functionality
- **Loading**: Shows loading states during async operations
- **SuccessBanner**: Provides feedback for successful operations

### Theme System

The platform uses a centralized theme system (`frontend/src/shared/theme.ts`) with shared Tailwind CSS classNames for:

- Layout containers (`pageContainer`, `sectionSpacing`)
- Headings (`pageTitle`, `sectionTitle`, `cardTitle`)
- Cards (`cardContent`, `kpiCard`, `chartCard`)
- Tables (`tableContainer`, `table`, `tableRow`, `tableCell`)
- Buttons (`btnPrimary`, `btnSecondary`, `btnDanger`, `btnSuccess`)
- Inputs (`inputBase`, `inputError`)
- Badges (`badgeSuccess`, `badgeDanger`, `badgeInfo`)

### Error Handling

All API errors are handled consistently with machine-readable error codes. Errors are displayed in user-friendly banners with the ability to dismiss them. Field-level validation errors are shown directly under input fields for immediate feedback.

### Button State Management

All action buttons automatically show loading states during operations and are disabled to prevent duplicate submissions. Buttons are also intelligently disabled based on business rules (e.g., cannot bank if CB ≤ 0, cannot apply if no deficit).

### Dark Mode

The entire platform supports dark mode with smooth transitions. The theme preference is persisted in localStorage and automatically applied on page load. All components are designed with dark mode-friendly colors.

## Additional Resources

- **Prisma Studio**: Visual database browser
  ```bash
  cd backend
  npm run prisma:studio
  ```

- **Database Migrations**: Create and apply schema changes
  ```bash
  cd backend
  npm run prisma:migrate
  ```

- **Type Checking**: Verify TypeScript types without building
  ```bash
  cd backend
  npm run type-check
  ```

- **Linting**: Check code quality
  ```bash
  cd backend
  npm run lint
  ```

## Development Notes

### Constants

The platform uses a single source of truth for the FuelEU target intensity:
- **Backend**: `backend/src/shared/constants/fuelEU.ts`
- **Frontend**: `frontend/src/shared/constants/fuelEU.ts`

Both export: `FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ = 89.3368`

### Filtering

The Routes page supports filtering by:
- **Vessel Type**: Case-insensitive matching
- **Fuel Type**: Case-insensitive matching
- **Year**: Exact integer match

Filters are applied via query parameters: `/routes?vesselType=Container&year=2024`

### Validation Rules

**Banking:**
- Can only bank if CB > 0
- Amount must be > 0 and ≤ available positive CB
- Can only apply if CB < 0 (deficit) and banked surplus is available

**Pooling:**
- Pool sum (sum of all CB values) must be ≥ 0
- At least one deficit ship and one surplus ship must be selected
- No deficit ship can end up worse after pooling
- No surplus ship can end up negative after pooling

### Testing

The backend includes comprehensive unit and integration tests:
- Unit tests for core services (computeGHGIntensity, computeCB, createPool)
- Integration tests for API endpoints (routes, banking, pooling)
- Tests verify error handling and validation rules

Run tests:
```bash
cd backend
npm test
```

