# HealthCheck AI Workspace

## Overview

A modern AI-powered health assessment application built as a pnpm monorepo using TypeScript. Users can take multi-step health assessments, track vital signs, view their health score dashboard, and browse personalized wellness tips.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Charts**: Recharts (radial, bar, line charts)
- **Animations**: Framer Motion
- **Routing**: Wouter
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Features

- **Landing Page**: Hero with animated stats, feature highlights, CTA
- **Health Assessment**: 5-step wizard (Personal Info → Symptoms → Lifestyle → Medical History → Review)
- **Results Dashboard**: Overall health score (0-100), BMI, risk level, category breakdown charts, AI recommendations
- **Vitals Tracker**: Log and chart heart rate, blood pressure, temperature, SpO2, blood glucose
- **Health Tips**: 16 evidence-based wellness tips across 6 categories
- **Dark Mode**: Full light/dark mode toggle

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── healthcheck-ai/     # React + Vite frontend (previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `assessments` — health assessment submissions with scores, BMI, risk level, category scores, recommendations
- `vitals` — vital signs entries (heart rate, blood pressure, temperature, SpO2, blood glucose)

## API Endpoints

All prefixed with `/api`:

- `GET /healthz` — health check
- `POST /assessments` — submit health assessment → returns scored result
- `GET /assessments` — list all assessments
- `GET /assessments/:id` — get assessment by ID
- `POST /vitals` — log vital signs
- `GET /vitals` — list vitals history
- `GET /tips` — get health tips (static, 16 tips)

## TypeScript & Composite Projects

- `lib/*` packages are composite and emit declarations via `tsc --build`
- Artifact packages are leaf packages checked with `tsc --noEmit`
- Always typecheck from root: `pnpm run typecheck`

## Root Scripts

- `pnpm run build` — runs `typecheck` then recursively builds all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client + Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes
