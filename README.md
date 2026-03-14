## 🛠️ Tech Stack
### Frontend
- **React 18** + **TypeScript**
- **Vite** — lightning-fast dev server and build tool
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible, composable UI components
- **Recharts** — interactive health charts (radial, bar, line)
- **Framer Motion** — smooth page transitions and animations
- **Wouter** — lightweight client-side routing
- **TanStack React Query** — server state management
### Backend
- **Node.js** + **Express 5**
- **PostgreSQL** — relational database
- **Drizzle ORM** — type-safe database queries
- **Zod** — runtime schema validation
- **Orval** — OpenAPI code generation
### Infrastructure
- **pnpm Workspaces** — monorepo package management
- **Replit** — hosting, deployment, and database
## 📊 Health Score Algorithm
Scores are calculated across 5 weighted categories using a realistic baseline model (not starting from 100):
| Category | Weight | Key Factors |
|---|---|---|
| 🏃 Physical | 30% | BMI, age, symptoms, medical conditions |
| 🧠 Mental | 20% | Stress level (1–10), mood symptoms, depression |
| 🥗 Nutrition | 20% | Diet type (Mediterranean, vegan, keto, omnivore, etc.) |
| 😴 Sleep | 15% | Hours per night (optimal: 7–9 hrs) |
| 🚴 Lifestyle | 15% | Exercise frequency, smoking status, alcohol consumption |
**Score Ranges:**
| Score | Risk Level | What it means |
|---|---|---|
| 73–100 | 🟢 Low | Good health — keep it up! |
| 58–72 | 🟡 Moderate | Some areas need attention |
| 40–57 | 🟠 High | Significant health concerns present |
| 0–39 | 🔴 Critical | Immediate lifestyle changes recommended |
---
## 🛠️ Complete Tech Stack
### 🎨 Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI library |
| **TypeScript** | 5.9 | Type safety |
| **Vite** | 7 | Build tool & dev server |
| **Tailwind CSS** | v4 | Utility-first styling |
| **shadcn/ui** | Latest | Accessible UI component library |
| **Radix UI** | Latest | Headless accessible primitives (Dialog, Select, Tooltip, etc.) |
| **Recharts** | Latest | Health score & vitals charts (RadialBar, Bar, Line) |
| **Framer Motion** | Latest | Page transitions & animations |
| **Wouter** | Latest | Lightweight client-side routing |
| **TanStack React Query** | Latest | Server state & data fetching |
| **React Hook Form** | Latest | Form state management |
| **Zod** | v4 | Frontend form validation |
| **date-fns** | Latest | Date formatting for vitals history |
| **clsx** | Latest | Conditional className utility |
| **tailwind-merge** | Latest | Safe Tailwind class merging |
| **Lucide React** | Latest | Icon library |
| **tw-animate-css** | Latest | CSS animation utilities |
### ⚙️ Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 24 | JavaScript runtime |
| **TypeScript** | 5.9 | Type safety |
| **Express** | 5 | HTTP web framework |
| **Drizzle ORM** | Latest | Type-safe database query builder |
| **PostgreSQL** | Latest | Relational database |
| **pg** | Latest | PostgreSQL Node.js driver |
| **Zod** | v4 | Request/response validation |
| **drizzle-zod** | Latest | Auto-generate Zod schemas from Drizzle tables |
| **tsx** | Latest | TypeScript execution for development |
| **esbuild** | Latest | Production bundler (outputs CJS) |
| **cookie-parser** | Latest | Cookie middleware |
| **cors** | Latest | Cross-origin resource sharing |
### 🔧 Tooling & Infrastructure
| Technology | Purpose |
|---|---|
| **pnpm Workspaces** | Monorepo package management |
| **Orval** | OpenAPI 3.1 → React Query hooks + Zod schema codegen |
| **Drizzle Kit** | Database schema migrations & push |
| **Prettier** | Code formatting |
| **Replit** | Cloud hosting, deployment & managed database |
---
-11
+44
```
healthcheck-ai/
├── artifacts/
│   ├── api-server/          # Express API server
│   │   └── src/routes/      # assessments, vitals, tips endpoints
│   └── healthcheck-ai/      # React + Vite frontend
│   ├── api-server/                  # Express API server
│   │   └── src/
│   │       └── routes/
│   │           ├── assessments.ts   # Health assessment logic + scoring
│   │           ├── vitals.ts        # Vital signs CRUD
│   │           ├── tips.ts          # Static health tips
│   │           └── health.ts        # Server health check
│   └── healthcheck-ai/              # React + Vite frontend
│       └── src/
│           ├── pages/       # Home, Assessment, Dashboard, Vitals, Tips
│           ├── components/  # Navbar, UI components
│           └── hooks/       # API mutation hooks
│           ├── pages/
│           │   ├── Home.tsx         # Landing page
│           │   ├── Assessment.tsx   # 5-step assessment wizard
│           │   ├── Dashboard.tsx    # Health score results & charts
│           │   ├── Vitals.tsx       # Vitals tracker & history
│           │   └── Tips.tsx         # Wellness library
│           ├── components/
│           │   ├── layout/Navbar.tsx
│           │   └── ui/              # shadcn/ui components
│           └── hooks/
│               └── use-app-mutations.ts
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 specification
│   ├── api-client-react/    # Auto-generated React Query hooks
│   ├── api-zod/             # Auto-generated Zod validation schemas
│   └── db/                  # Drizzle ORM schema & DB connection
└── scripts/                 # Utility scripts
│   ├── api-spec/
│   │   └── openapi.yaml             # OpenAPI 3.1 source of truth
│   ├── api-client-react/            # Auto-generated React Query hooks
│   ├── api-zod/                     # Auto-generated Zod validation schemas
│   └── db/
│       └── src/schema/
│           ├── assessments.ts       # Assessments table definition
│           └── vitals.ts            # Vitals table definition
└── scripts/                         # Utility scripts
```
---
## 🔌 API Endpoints
All endpoints are prefixed with `/api`
| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/healthz` | Server health check | — |
| `POST` | `/assessments` | Submit a health assessment | `CreateAssessmentRequest` |
| `GET` | `/assessments` | List all past assessments | — |
| `GET` | `/assessments/:id` | Get a specific assessment result | — |
| `POST` | `/vitals` | Log a new vitals entry | `CreateVitalsRequest` |
| `GET` | `/vitals` | Get vitals history | — |
| `GET` | `/tips` | Get all health tips | — |
---
-38
+17
git clone https://github.com/Viresh/health-check-ai.git
cd health-check-ai
# Install dependencies
# Install all dependencies
pnpm install
# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL to .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/healthcheck" > .env
# Push database schema
pnpm --filter @workspace/db run push
# Run API codegen (generates React Query hooks & Zod schemas from OpenAPI spec)
pnpm --filter @workspace/api-spec run codegen
# Start development servers
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/healthcheck-ai run dev
pnpm --filter @workspace/api-server run dev    # API: http://localhost:8080/api
pnpm --filter @workspace/healthcheck-ai run dev  # Frontend: http://localhost:5173
```
---
## 🔌 API Endpoints
All endpoints are prefixed with `/api`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/healthz` | Server health check |
| `POST` | `/assessments` | Submit a health assessment |
| `GET` | `/assessments` | List all past assessments |
| `GET` | `/assessments/:id` | Get a specific assessment result |
| `POST` | `/vitals` | Log a new vitals entry |
| `GET` | `/vitals` | Get vitals history |
| `GET` | `/tips` | Get all health tips |
---
## 📊 Health Score Algorithm
The health score (0–100) is calculated across 5 weighted categories:
| Category | Weight | Factors |
|---|---|---|
| Physical | 30% | BMI, symptoms, medical history |
| Mental | 20% | Stress level, mood symptoms |
| Nutrition | 20% | Diet type, eating habits |
| Sleep | 15% | Sleep hours per night |
| Lifestyle | 15% | Exercise, smoking, alcohol |
Risk levels: **Low** (75–100) · **Moderate** (60–74) · **High** (40–59) · **Critical** (0–39)
### Available Scripts
| Command | Description |
|---|---|
| `pnpm run typecheck` | Full TypeScript check across all packages |
| `pnpm run build` | Production build for all packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API client from OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push DB schema changes to PostgreSQL |
---
## 📸 Screenshots
### Home Page
![HealthCheck AI Home](public/images/hero-bg.png)
![HealthCheck AI Home](artifacts/healthcheck-ai/public/images/hero-bg.png)
---
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
Contributions are welcome!
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
