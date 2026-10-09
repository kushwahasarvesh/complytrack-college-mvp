# ComplyTrack — College Project MVP

Compliance Deadline Management System built with Java 21, Spring Boot, PostgreSQL, Flyway, Angular, JWT, JUnit 5 and Mockito.

## MVP scope
- User registration and login with JWT
- Business profile management
- Compliance rule listing and creation
- Deadline listing, generation from rules, and completion
- Dashboard counts
- Flyway-managed schema
- Angular starter application
- SRS, architecture, database model, test plan and demo script

> Educational demo only. Seeded compliance rules are examples, not legal advice. Verify actual filing deadlines against authoritative sources before any real-world use.

## Prerequisites
- JDK 21
- Maven 3.9+
- Node.js 20 LTS and npm
- PostgreSQL 15+
- Angular CLI compatible with the installed Angular version (optional)

## Run the backend
1. Create a PostgreSQL database named `complytrack`.
2. Set environment variables if needed:
   - `DB_URL=jdbc:postgresql://localhost:5432/complytrack`
   - `DB_USERNAME=postgres`
   - `DB_PASSWORD=postgres`
   - `JWT_SECRET=change-this-secret-to-a-long-random-value-at-least-32-bytes`
3. From `backend/` run: `mvn spring-boot:run`
4. API base URL: `http://localhost:8080/api/v1`

Flyway creates the schema at startup.

## Run the frontend
The Angular frontend is a source starter. From `frontend/` run:
```bash
npm install
npm start
```
If dependencies are not installed yet, create an Angular workspace with Angular CLI and copy `src/app` into it, or run `npx -y @angular/cli@18 new complytrack-ui --standalone --routing --style=css` and replace its `src/app` with this starter. Configure the API URL in `src/app/api.service.ts`.

## Initial API routes
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/businesses`
- `POST /api/v1/businesses`
- `GET /api/v1/rules`
- `POST /api/v1/rules`
- `GET /api/v1/deadlines`
- `POST /api/v1/deadlines/generate?businessId={uuid}&ruleId={uuid}`
- `PATCH /api/v1/deadlines/{id}/complete`
- `GET /api/v1/dashboard`

Register first, then use the returned bearer token for protected endpoints.

## Security and production gaps
This is a starter MVP, not a production compliance product. Before production: add email delivery provider, robust refresh-token rotation, rate limiting, malware scanning, object storage, tenant/business isolation tests, audit coverage, backup/restore, observability, privacy review, and verified compliance rules.
