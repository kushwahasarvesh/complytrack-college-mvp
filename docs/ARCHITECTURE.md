# Architecture and Design

## Architecture style
Modular monolith: one Spring Boot deployable with clear packages. This reduces deployment complexity while retaining separation of concerns.

## Components
- Angular presentation layer
- REST controllers
- Application services / business logic
- Spring Data JPA repositories
- PostgreSQL
- Flyway migrations
- Spring Security JWT filter
- Scheduled reminder extension point (email delivery is a follow-up task)

## Package structure
`com.trovexis.complytrack`
- `auth`: registration and login
- `business`: business profiles
- `rule`: compliance rules
- `deadline`: deadline generation and status
- `dashboard`: aggregate counts
- `config`: security and JWT configuration
- `common`: shared API error handling

## Data model
- users 1—N businesses (ownership)
- businesses 1—N deadlines
- compliance_rules 1—N deadlines
- deadlines 1—N documents (planned extension)

## Deadline lifecycle
UPCOMING → DUE_SOON → OVERDUE → COMPLETED
Status is computed from the current date for open deadlines; completion is persisted.

## Security principles
- BCrypt password hashing
- JWT bearer authentication
- Stateless API sessions
- Validate ownership on every business-owned resource
- Never trust a client-supplied owner ID
- Keep secrets in environment variables
