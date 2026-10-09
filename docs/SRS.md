# Software Requirements Specification (SRS)
## ComplyTrack — Compliance Deadline Management System

### 1. Introduction
ComplyTrack is a web application for small businesses to organize compliance rules, upcoming deadlines and completion status.

### 2. Problem statement
Manual tracking in spreadsheets and calendars can result in missed filings and expired licenses. The application centralizes rules, deadlines and status for the businesses a user owns.

### 3. Objectives
- Provide authenticated access to compliance tracking.
- Allow a user to register and manage business profiles.
- Maintain a library of demonstration compliance rules, including rules the user creates.
- Generate deadlines and track their lifecycle.
- Show upcoming, due soon, overdue and completed items on a dashboard and an alerts page.
- Present sign-in, registration and the signed-in workspace on screens that adapt from phone to desktop.

### 4. User roles
- **Business User:** manages their own business profiles, rules, deadlines and completion status.
- **Administrator (future enhancement):** maintains centrally verified compliance rules.

### 5. Functional requirements
FR-01: Users can register with name, email and password.
FR-02: Users can log in and receive a JWT.
FR-03: Authenticated users can create and view business profiles.
FR-04: Users can view compliance rules and create demonstration rules with a frequency and next due date.
FR-05: A deadline can be generated for a selected business and rule. Creating a rule can also create that deadline immediately.
FR-06: An open deadline status is computed from the due date: UPCOMING, DUE_SOON (due within seven days, including today) or OVERDUE. COMPLETED is stored when the user marks the item done.
FR-07: Users can mark a deadline completed.
FR-08: The dashboard displays total, upcoming, due soon, overdue and completed counts.
FR-09: Flyway migrations version the database schema and seed demonstration rules, including one overdue rule and one due-soon rule.
FR-10: The system validates inputs and returns problem-detail errors.
FR-11: A user can add the seeded overdue and due-soon deadlines for a chosen business.
FR-12: The sign-in token lives only in memory. Refreshing the browser ends the session and returns the user to sign-in.
FR-13: Sign-in and create-account fit one viewport on a laptop or desktop. Narrower screens stack the same content and scroll only as needed.

### 6. Non-functional requirements
- Java 21 and Spring Boot backend.
- Angular 18 web client.
- PostgreSQL relational persistence.
- Passwords stored as BCrypt hashes.
- Protected APIs require JWT authentication and return 401 when the token is missing or invalid.
- Business-owned records must be isolated by the authenticated email.
- Core deadline logic should have automated unit tests.
- The application should be installable locally using the README.
- The client layout must remain usable on phone, tablet, laptop and desktop widths.

### 7. Out of scope for the MVP
- Legal guarantees or automatic legal interpretation.
- Live government portal integrations.
- Payment subscriptions.
- A native mobile application.
- Multi-country rule coverage.
- Production-grade SMS, email or push notifications.
- Evidence document upload.

### 8. Acceptance criteria
- A user can register and log in.
- Refreshing the browser after login returns the user to the sign-in page.
- The token can access protected endpoints, and a missing token returns 401.
- A business can be created and retrieved by its owner.
- A user can create a compliance rule and generate a deadline from it.
- Sample overdue and due-soon deadlines can be added for a business.
- A deadline can be marked completed.
- Dashboard and Alerts counts reflect the computed status.
- The database schema is created by Flyway.
- Sign-in and create-account do not require scrolling on a laptop-sized window.
- Build and automated tests pass in the configured environment.
