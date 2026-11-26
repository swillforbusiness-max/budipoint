# budipoint

**Budipoint** is a modular, API-first Digital Services and Fintech Platform built with a React + TypeScript + Vite frontend and a Laravel REST API backend backed by PostgreSQL.

## Architecture Overview

- **`frontend/`**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, selective GSAP animations, pure custom SVG icon system, and centralized Axios API client (`src/api/`, `src/services/`, `src/hooks/`, `src/types/`).
- **`backend/`**: Laravel RESTful API (`/api/v1`), Laravel Sanctum authentication, role-based access control (`customer` and `admin`), Form Requests, API Resources, Service classes (`DB::transaction()` with row locking), and PostgreSQL `DECIMAL(15, 2)` financial migrations.
