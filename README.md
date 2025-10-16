# Ease Minder Apartment Management SaaS

This repository contains a full-stack SaaS platform for managing apartment portfolios.
The stack uses **React** for the front-end, **Node.js/Express** for the API layer, and
**PostgreSQL** for persistence.

## Features

- Building & unit directory management
- Lease and tenant management with rent tracking
- Payment posting and finance reporting
- Role-based access control for property managers, accountants, and maintenance staff
- Dashboard summarizing KPIs such as occupancy, rent due, and outstanding balances

## Project layout

```
.
├── backend      # Node.js REST API & database migrations
└── frontend     # React dashboard client built with Vite
```

## Getting started

1. Install dependencies:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configure the environment variables for the backend by copying `.env.example`
   to `.env` and filling out the Postgres connection details.

3. Run database migrations:

   ```bash
   cd backend
   npm run migrate
   ```

4. Start the development servers:

   ```bash
   # Terminal 1 - backend API
   cd backend
   npm run dev

   # Terminal 2 - frontend client
   cd frontend
   npm run dev
   ```

The frontend development server will proxy API requests to the backend during development.

## Scripts

### Backend

- `npm run dev`: Start the Express API with hot reload via `ts-node-dev`.
- `npm run build`: Compile TypeScript to JavaScript in `dist`.
- `npm run start`: Run the compiled server from `dist`.
- `npm run migrate`: Apply SQL migrations in `db/migrations` using `node-pg-migrate`.
- `npm run lint`: Run ESLint checks.

### Frontend

- `npm run dev`: Launch Vite dev server.
- `npm run build`: Build production assets.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint for the React app.

## License

MIT
