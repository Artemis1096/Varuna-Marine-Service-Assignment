# FuelEU Maritime Compliance Platform — Development Plan

## Tech Stack
- Frontend: React + TypeScript + TailwindCSS
- Backend: Node.js + TypeScript + PostgreSQL
- Architecture: Hexagonal (Ports & Adapters)

## Backend Tasks
1. Initialize backend project (TypeScript + Express).
2. Setup Prisma + PostgreSQL connection.
3. Create database schema (routes, ship_compliance, bank_entries, pools, pool_members).
4. Seed initial 5 routes.
5. Implement core domain logic (ComputeCB, comparison, banking, pooling).
6. Implement repository ports and adapters.
7. Create HTTP endpoints:
   - GET /routes
   - POST /routes/:id/baseline
   - GET /routes/comparison
   - GET /compliance/cb
   - GET /compliance/adjusted-cb
   - POST /banking/bank
   - POST /banking/apply
   - POST /pools
8. Unit tests + integration tests.

## Frontend Tasks
1. Setup React + Tailwind project (Vite recommended).
2. Create routes layout with tabs: Routes, Compare, Banking, Pooling.
3. Implement API client adapters.
4. Routes Tab: Table + Filters + Set Baseline button.
5. Compare Tab: Table + Chart + Compliance indicators.
6. Banking Tab: Display CB, bank/apply actions with validation.
7. Pooling Tab: Select members, validate rules, preview cb_after results.

## Documentation
- AGENT_WORKFLOW.md (record prompts & corrections).
- README.md (architecture, setup, usage).
- REFLECTION.md (lessons learned).
