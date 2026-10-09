# ComplyTrack — College Project MVP

Compliance Deadline Management System built with Java 21, Spring Boot, PostgreSQL, Flyway, Angular 18, JWT, JUnit 5 and Mockito.

## MVP scope
- User registration and login with JWT
- Sign-in is kept in memory, so a browser refresh signs the user out
- Business profile management
- Compliance rule listing and creation, including overdue and due-soon dates
- Deadline listing, generation from rules, sample overdue/due-soon items, and completion
- Dashboard counts and an Alerts page for due soon and overdue items
- Flyway-managed schema
- Responsive Angular application
- SRS, architecture, test plan and demo script

> Educational demo only. Seeded compliance rules are examples, not legal advice. Verify actual filing deadlines against authoritative sources before any real-world use.

## Prerequisites
- JDK 21
- Maven 3.9+
- Node.js 20 LTS and npm
- PostgreSQL 15+ (or Docker, see below)

Use JDK 21 for Maven. If a newer JDK is first on `PATH`, set `JAVA_HOME` to the JDK 21 installation before running Maven.

## Run the backend
1. Create a PostgreSQL database named `complytrack`.
2. Set environment variables if the defaults do not match the local server:
   - `DB_URL=jdbc:postgresql://localhost:5432/complytrack`
   - `DB_USERNAME=postgres`
   - `DB_PASSWORD=postgres`
   - `JWT_SECRET=change-this-secret-to-a-long-random-value-at-least-32-bytes`
3. From `backend/` run: `mvn spring-boot:run`
4. API base URL: `http://localhost:8080/api/v1`

Flyway applies `V1__initial_schema.sql` and `V2__overdue_and_due_soon_rules.sql` at startup.

On Windows the JVM may report the legacy zone id `Asia/Calcutta`, which current PostgreSQL rejects. The application sets the default zone to `Asia/Kolkata` before it connects.

### Docker database
If the installed PostgreSQL service does not accept the default password, start a project database on port 5433:

```bash
docker run -d --name complytrack-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=complytrack -p 5433:5432 postgres:16
```

Then start the API with `DB_URL=jdbc:postgresql://localhost:5433/complytrack`.

## Run the frontend
From `frontend/`:

```bash
npm install
npm start
```

Open `http://127.0.0.1:4200/`. The API client uses `http://localhost:8080/api/v1`.

## Screens
- `/login` and `/register` — one-screen layout on laptop and desktop
- `/dashboard` — total, upcoming, due soon, overdue and completed
- `/businesses` — create and list business profiles
- `/rules` — demonstration rules and deadline generation
- `/rules/new` — create a rule and optionally a deadline
- `/attention` — overdue and due-soon lists, plus sample data
- `/deadlines` — filter and complete deadlines

## API routes
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/businesses`
- `POST /api/v1/businesses`
- `GET /api/v1/businesses/{id}`
- `GET /api/v1/rules`
- `POST /api/v1/rules`
- `GET /api/v1/deadlines`
- `POST /api/v1/deadlines/generate?businessId={uuid}&ruleId={uuid}`
- `POST /api/v1/deadlines/samples?businessId={uuid}`
- `PATCH /api/v1/deadlines/{id}/complete`
- `GET /api/v1/dashboard`

Register or log in first, then send `Authorization: Bearer {token}` on protected routes. A missing or invalid token returns 401.

`POST /api/v1/rules` accepts `name`, `filingType`, `frequency` (`MONTHLY`, `QUARTERLY` or `YEARLY`), `jurisdiction`, optional `dayOfMonth` (1–31) and `nextDueDate`. A past date is reported as overdue. A date within seven days, including today, is reported as due soon.

## Security and production gaps
This is a college MVP, not a production compliance product. Before production: add email delivery, refresh-token rotation, rate limiting, document upload checks, object storage, tenant isolation tests, audit coverage, backup/restore, observability, a privacy review, and verified compliance rules.
