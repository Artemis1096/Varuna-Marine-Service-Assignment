# FuelEU Maritime Compliance Platform

Full-stack implementation of the FuelEU Maritime compliance module, covering:

- Route baseline setting

- GHG intensity comparison

- Compliance balance (CB) calculation

- Banking surplus and applying surplus to deficits (Article 20)

- Pooling of ships/routes to redistribute CB (Article 21)

## Tech Stack

### Backend

- Node.js + TypeScript

- Express

- PostgreSQL + Prisma ORM

- Hexagonal Architecture (Ports & Adapters)

### Frontend

- React + TypeScript

- TailwindCSS

- Recharts (visualization)

- Axios API Adapters

---

## Architecture Overview (Hexagonal)

```
backend/
  src/
    core/              # business rules (pure)
      domain/
      application/     # use-cases (services)
      ports/           # abstract interfaces
    adapters/
      inbound/http/    # Express controllers (entrypoints)
      outbound/postgres/  # Prisma Repositories
    infrastructure/    # db client, server config

frontend/
  src/
    core/ports/        # UI-side inbound ports
    adapters/outbound/api  # API client adapters
    pages/              # React Screens
    adapters/ui/        # (optional UI helpers)
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Backend runs on:
```
http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## API Endpoints (Key)

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/routes` | GET | List all routes |
| `/routes/:code/baseline` | POST | Set baseline route |
| `/routes/comparison` | GET | Compare GHG intensities |
| `/compliance/cb` | GET | Compute CB for route/year |
| `/banking/bank` | POST | Bank positive CB |
| `/banking/apply` | POST | Apply banked CB to deficit |
| `/pools` | POST | Create pooling group and redistribute CB |

