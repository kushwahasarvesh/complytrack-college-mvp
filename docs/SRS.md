# Software Requirements Specification (SRS)
## ComplyTrack — Compliance Deadline Management System

### 1. Introduction
ComplyTrack is a web application for small businesses to organize compliance rules, upcoming deadlines, completion status and evidence documents.

### 2. Problem statement
Manual tracking in spreadsheets and calendars can result in missed filings, expired licenses and scattered evidence. The application centralizes tracking and reminders.

### 3. Objectives
- Provide authenticated access to compliance tracking.
- Allow a user to register and manage business profiles.
- Maintain a configurable library of compliance rules.
- Generate deadlines and track their lifecycle.
- Show upcoming, overdue and completed items on a dashboard.
- Associate supporting evidence with compliance work.

### 4. User roles
- **Business User:** manages their own business profiles, deadlines and evidence.
- **Administrator (future enhancement):** maintains centrally verified compliance rules.

### 5. Functional requirements
FR-01: Users can register with name, email and password.
FR-02: Users can log in and receive a JWT.
FR-03: Authenticated users can create and view business profiles.
FR-04: Users can view compliance rules and create demonstration rules.
FR-05: A deadline can be generated for a selected business and rule.
FR-06: A deadline has a due date and status: UPCOMING, DUE_SOON, OVERDUE or COMPLETED.
FR-07: Users can mark a deadline completed.
FR-08: Dashboard displays total, upcoming, overdue and completed counts.
FR-09: Flyway migrations version the database schema.
FR-10: The system validates inputs and returns consistent HTTP errors.

### 6. Non-functional requirements
- Java 21 and Spring Boot backend.
- Angular web client.
- PostgreSQL relational persistence.
- Passwords stored as BCrypt hashes.
- Protected APIs require JWT authentication.
- Business-owned records must be isolated by authorization checks.
- Core service logic should have automated unit tests.
- The application should be installable locally using the README.

### 7. Out of scope for one-week MVP
- Legal guarantees or automatic legal interpretation.
- Live government portal integrations.
- Payment subscriptions.
- Native mobile application.
- Multi-country rule coverage.
- Production-grade SMS/push notifications.

### 8. Acceptance criteria
- A user can register and log in.
- The token can access protected endpoints.
- A business can be created and retrieved by its owner.
- A compliance rule can generate a deadline.
- The deadline can be marked completed.
- Dashboard counts reflect persisted records.
- Database schema is created by Flyway.
- Build and automated tests pass in the configured environment.
