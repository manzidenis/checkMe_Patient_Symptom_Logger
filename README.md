# Patient Symptom Logger

A full-stack clinical symptom tracking application for logging, monitoring, and analyzing patient symptoms with severity trend detection and alert capabilities.

## Project Overview

The Patient Symptom Logger enables clinicians to register patients, log symptom entries (type, severity, date, notes), and view auto-generated clinical insights such as severity trends, top symptoms, and worsening alerts. The system supports role-based access control with JWT authentication, server-side pagination, sorting, and filtering.

### Key Features

- **Patient Management** — Register, update, and delete patients with demographic data.
- **Symptom Logging** — Log entries with symptom type (Breast Pain, Lump Detected, Skin Changes, etc...), severity (1–5), date, and notes(optional).
- **Clinical Insights** — Auto-generated per-patient: severity trend (worsening/improving/stable), top symptom (30-days), and alert detection.
- **Symptom Log History** — View all symptom entries for a patient.
- **Server-Side Pagination** — Paginated, sortable, and filterable patient list and symptom history.
- **Authentication** — JWT-based auth with role-based access (Clinician / Patient)
- **Dockerized** — Single-command deployment via Docker Compose

## Tech Stack

| Layer                | Technology                               |
| -------------------- | ---------------------------------------- |
| **Frontend**         | React + TypeScript + Vite + Tailwind CSS |
| **Backend**          | NestJS (Node.js) + Prisma                |
| **Database**         | PostgreSQL                               |
| **Auth**             | Passport JWT                             |
| **API Docs**         | Swagger (OpenAPI)                        |
| **Containerization** | Docker + Docker Compose                  |

## Screenshots & Demo

### Login Page

![Login Page](docs/screenshots/login.png "Login Page")

### Clinician Dashboard

![Clinician Dashboard](docs/screenshots/clinician_dashboard.png "Clinician Dashboard")

### Patient Dashboard

![Patient Dashboard](docs/screenshots/patients_dashboard.png "Patient Dashboard")

### Symptom Logging

![Symptom Logging](docs/screenshots/symptom_logging.png "Symptom Logging")

### Insights Panel

![Insights Panel](docs/screenshots/clinician_dashboard_2%28insights_symptom_history%29.png "Insights Panel")

### Patient Symptom History

![Patient Symptom History](docs/screenshots/clinician_dashboard_1%28patient_symptom_history%29.png "Patient Symptom History")

### Swagger UI

![Swagger UI](docs/screenshots/swagger.png "Swagger UI")

### Demo Video

[Watch demo video](docs/DEMO_video.mp4)

## Database Choice: PostgreSQL over MongoDB

I chose to use PostgreSQL because the application involves structured relational data with strong consistency requirements and frequent aggregation queries for analytics(insights). PostgreSQL provides better transactional integrity and query capabilities.

## Project Structure

```
patient_symptom_logger/
├── backend/                  # NestJS API
│   ├── prisma/               # Schema, migrations, seed data
│   ├── src/
│   │   ├── common/           # Guards, filters, decorators
│   │   ├── database/         # Prisma module & service
│   │   └── modules/
│   │       ├── auth/         # JWT auth, login, guards
│   │       ├── health/       # Health check endpoint
│   │       ├── patients/     # CRUD + paginated listing
│   │       └── symptoms/     # CRUD + insights engine
│   ├── Dockerfile
│   └── docker-entrypoint.sh
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # UI, forms, charts, insights
│   │   ├── pages/            # Patient list, dashboard, login
│   │   ├── hooks/            # React Query hooks
│   │   ├── services/         # Axios API clients
│   │   ├── context/          # Auth & UI context providers
│   │   └── types/            # TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml        # Full-stack orchestration
├── .env                      # Environment variables
└── .gitignore
```

## Setup & Run Instructions

### 1) Get the project files

#### Option A: Clone with Git

```bash
git clone https://github.com/manzidenis/checkMe_Patient_Symptom_Logger.git
cd checkMe_Patient_Symptom_Logger
```

#### Option B: Download ZIP from GitHub

1. Open `https://github.com/manzidenis/checkMe_Patient_Symptom_Logger`
2. Click **Code** -> **Download ZIP**
3. Extract the ZIP
4. Open a terminal in the extracted root folder (the folder containing `docker-compose.yml`)

### 2) Install prerequisites and verify versions

#### Install links

- Git: https://git-scm.com/downloads
- Docker Desktop (Docker Engine + Compose): https://docs.docker.com/get-started/get-docker/
- Docker Compose docs: https://docs.docker.com/compose/install/
- Node.js: https://nodejs.org/en/download
- PostgreSQL: https://www.postgresql.org/download/

#### Verify installed versions

```bash
git --version
docker --version
docker compose version
node -v
npm -v
```

If running locally without Docker, also verify PostgreSQL:

```bash
psql --version
```

### 3) Option 1: Docker Compose (Recommended)

#### Step 1: Confirm Docker engine is running

```bash
docker info
```

If this fails, start Docker Desktop and try again.

#### Step 2: Build and start all services

```bash
docker compose up --build -d
```

#### Step 3: Verify services

```bash
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
docker compose logs --tail=100 db
```

Expected:

- `backend` status is `Up`
- `frontend` status is `Up`
- `db` status is `Up (healthy)`
- backend logs show startup on port `3000`

#### Step 4: Verify endpoints

| Service        | URL                          |
| -------------- | ---------------------------- |
| Frontend       | http://localhost:5173        |
| Backend Health | http://localhost:3000/health |
| Swagger Docs   | http://localhost:3000/api    |

Optional terminal check:

```bash
curl http://localhost:3000/health
```

#### Step 5: Stop services

```bash
docker compose down
```

Reset the database volume (fresh data on next run):

```bash
docker compose down -v
```

#### Quick Docker troubleshooting

```bash
# Inspect recent backend errors
docker compose logs --tail=200 backend

# Full clean restart
docker compose down -v --remove-orphans
docker compose up --build -d
```

### 4) Option 2: Local development (without Docker)

#### Step 1: Ensure PostgreSQL is running locally

Use your system service manager to start PostgreSQL first.

#### Step 2: Configure backend env

```bash
cd backend
```

Create or edit `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
PORT=3000
JWT_SECRET=symptom-logger-jwt-secret
```

Adjust username/password/database to match your local PostgreSQL instance.

#### Step 3: Install backend dependencies and prepare DB

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

#### Step 4: Start backend

```bash
npm run start:dev
```

Verify backend:

- http://localhost:3000/health
- http://localhost:3000/api

#### Step 5: Start frontend

Open a new terminal in project root:

```bash
cd frontend
npm install
npm run dev
```

Verify frontend:

- http://localhost:5173

Note: in local dev, frontend proxies `/api` to `http://localhost:3000`.

### Demo Credentials

Check on Sign-In page

## API Endpoints

| Method   | Endpoint                          | Description                           |
| -------- | --------------------------------- | ------------------------------------- |
| `POST`   | `/auth/login`                     | Authenticate and get JWT token        |
| `GET`    | `/patients`                       | List patients (paginated, filterable) |
| `POST`   | `/patients`                       | Register a new patient                |
| `GET`    | `/patients/:id`                   | Get patient details                   |
| `PATCH`  | `/patients/:id`                   | Update patient details                |
| `DELETE` | `/patients/:id`                   | Delete patient and related data       |
| `GET`    | `/patients/:id/symptoms`          | List symptom entries (paginated)      |
| `POST`   | `/patients/:id/symptoms`          | Log a symptom entry(s)                |
| `PATCH`  | `/patients/:id/symptoms/:sid`     | Update a symptom entry(s)             |
| `DELETE` | `/patients/:id/symptoms/:sid`     | Delete a symptom entry(s)             |
| `GET`    | `/patients/:id/symptoms/insights` | Get clinical insights                 |
| `GET`    | `/health`                         | API health check                      |

Full interactive docs available at `/api` (Swagger UI).

## Assumptions & Design Decisions

1. **Insights are computed on-the-fly** — Severity trends, top symptoms, and alerts are calculated per-request from the last 30 days of data rather than being pre-computed. This keeps the schema simple and ensures insights are always current.

2. **Alert logic** — A patient is flagged with an "Alert" status if their average severity over the last 7 days exceeds or equal to 4.0 (on a 1–5 scale) or shows significant worsening compared to the previous 7 days. I hardcoded the threshold for simplicity.

3. **Authentication (simplified)** — JWT tokens are stored in localStorage with a hardcoded secret. In a production system, httpOnly cookies, refresh tokens, and environment based secrets would be used.

4. **Seed data** — 18 patients with 130+ symptom entries for testing all cases including edge cases.
