# Architecture and Design

## Architecture style
Modular monolith: one Spring Boot deployable with clear packages. The Angular client is a separate dev server during local use and calls the API over HTTP.

## Components
- Angular 18 presentation layer with routed pages
- REST controllers
- Application services
- Spring Data JPA repositories
- PostgreSQL
- Flyway migrations `V1__initial_schema.sql` and `V2__overdue_and_due_soon_rules.sql`
- Spring Security JWT filter
- Shared problem-detail validation errors

Email reminders are a follow-up. There is no scheduler in this MVP.

## Frontend structure
`frontend/src/app`
- `pages/auth.page.ts` — `/login` and `/register`
- `pages/dashboard.page.ts` — counts and open work
- `pages/businesses.page.ts` — business profiles
- `pages/rules.page.ts` and `pages/create-rule.page.ts` — rule library and creation
- `pages/attention.page.ts` — overdue and due soon
- `pages/deadlines.page.ts` — full deadline list
- `shell.component.ts` — header, navigation and footer after sign-in
- `session.service.ts` — in-memory JWT
- `api.service.ts` — HTTP client

On a laptop or desktop the auth layout is locked to the viewport height. Below that width the same sections stack.

## Package structure
`com.trovexis.complytrack`
- `auth`: registration and login
- `business`: business profiles
- `rule`: compliance rules
- `deadline`: deadline generation, samples and completion
- `dashboard`: aggregate counts
- `config`: security and JWT
- `common`: validation error responses

## Data model
- `users` 1—N `businesses`, linked by `owner_email`
- `businesses` 1—N `deadlines`
- `compliance_rules` 1—N `deadlines`
- Rules are a shared demonstration library. Deadlines are private to the owning user.

Tables created by Flyway:
- `users` — id, email, full name, BCrypt password hash, role, created time
- `businesses` — id, owner email, name, type, state, optional registration number
- `compliance_rules` — id, name, filing type, frequency, jurisdiction, optional day of month, next due date, active flag
- `deadlines` — id, business, rule, owner email, title, due date, stored status, completed time

Seeded rules include monthly GST, quarterly TDS and yearly license examples, plus an overdue GST example and a due-soon TDS example.

## Deadline lifecycle
Open status is calculated when the deadline is read. It is not rewritten on every list call.

- Due after seven days: `UPCOMING`
- Due today through seven days ahead: `DUE_SOON`
- Due before today: `OVERDUE`
- User action: `COMPLETED`, with `completed_at` stored

`POST /api/v1/deadlines/samples` creates the overdue and due-soon seeded deadlines for one owned business, and skips a pair that already exists.

## Security principles
- BCrypt password hashing
- JWT bearer authentication, stateless API sessions
- The browser keeps the token in memory only. Refresh clears it.
- Unauthenticated requests receive 401. Anonymous authentication is disabled.
- Ownership checks use the email from the token, never a client-supplied owner id
- CORS allows the local Angular origins `http://localhost:4200` and `http://127.0.0.1:4200`
- Secrets stay in environment variables
- The process time zone is `Asia/Kolkata`, because PostgreSQL rejects the legacy Windows id `Asia/Calcutta`
