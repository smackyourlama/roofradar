# Roofradar - System Architecture (Phase 1)

## 1. Overview
Roofradar is a platform designed to process property addresses, retrieve satellite/aerial imagery, analyze roof characteristics (area, pitch, complexity), and generate estimates or actionable data.

## 2. Folder Structure
The application follows a modular monolith approach, built with Node.js and TypeScript.

```text
roofradar/
├── src/
│   ├── api/            # Express controllers, routes, and middleware
│   ├── services/       # Core business logic
│   ├── db/             # Database connection, schemas, migrations (ORM)
│   ├── jobs/           # Background job processors and queue definitions
│   ├── utils/          # Shared utilities and helpers
│   ├── config/         # Environment variables and configuration
│   └── index.ts        # Application entry point
├── docs/               # Technical documentation and architecture maps
├── package.json
└── tsconfig.json
```

## 3. Services Architecture
- **AuthService**: Manages user authentication, sessions, and permissions.
- **GeocodingService**: Converts raw addresses into standardized coordinates.
- **ImageryService**: Integrates with external APIs (e.g., Google Earth, Nearmap) to fetch high-resolution satellite imagery.
- **AnalysisService**: Analyzes imagery to extract roof polygons, calculate surface area, and detect obstacles (chimneys, skylights).
- **QuotingService**: Generates cost estimates based on analysis data, selected materials, and regional pricing rules.

## 4. API Routes
All routes are prefixed with `/api/v1`.

### Authentication
- `POST /auth/register` - Create a new user account.
- `POST /auth/login` - Authenticate and receive a token.

### Projects
- `POST /projects` - Submit a new address to start a roof analysis project.
- `GET /projects` - List all projects for the current user.
- `GET /projects/:id` - Get detailed status and results for a specific project.
- `POST /projects/:id/analyze` - Trigger/re-trigger the background analysis pipeline.

### Quotes
- `GET /projects/:id/quote` - Retrieve the generated quote.
- `PUT /projects/:id/quote` - Update quote parameters (e.g., change material).

## 5. Database Schema
Assuming PostgreSQL.

- **Users**
  - `id` (UUID, PK)
  - `email` (String, Unique)
  - `password_hash` (String)
  - `created_at` (Timestamp)

- **Projects**
  - `id` (UUID, PK)
  - `user_id` (UUID, FK -> Users)
  - `address` (String)
  - `latitude` (Float)
  - `longitude` (Float)
  - `status` (Enum: PENDING, PROCESSING, COMPLETED, FAILED)
  - `created_at` (Timestamp)

- **RoofAnalysis**
  - `id` (UUID, PK)
  - `project_id` (UUID, FK -> Projects)
  - `total_area_sqft` (Float)
  - `pitch_degrees` (Float)
  - `complexity_score` (Integer)
  - `image_url` (String)

- **Quotes**
  - `id` (UUID, PK)
  - `project_id` (UUID, FK -> Projects)
  - `material_type` (String)
  - `estimated_cost` (Decimal)
  - `created_at` (Timestamp)

## 6. Job Processing System
Background processing is handled via **Redis + BullMQ**. Due to the latency of image retrieval and ML analysis, these tasks are strictly asynchronous.

### Queues
1. **`imagery-queue`**: Fetches and stores satellite images based on coordinates.
2. **`analysis-queue`**: Runs computer vision/ML models on fetched images to determine roof metrics.
3. **`webhook-queue`**: Dispatches HTTP callbacks to external integrations once analysis is complete.

### Workflow
1. User calls `POST /projects`.
2. API synchronously creates a `Project` (status `PENDING`) and enqueues a job to `imagery-queue`.
3. Worker picks up `imagery-queue` job, fetches images, updates `RoofAnalysis.image_url`, and chains a job to `analysis-queue`.
4. Worker processes `analysis-queue`, runs extraction logic, updates metrics, and sets `Project` status to `COMPLETED`.
