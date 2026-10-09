# Backend tests

`deadline/DeadlineServiceTest.java` covers generation, ownership rejection, completion, and computed open status with JUnit 5 and Mockito.

Further service tests should follow `docs/TEST_PLAN.md`. Use PostgreSQL for Flyway and repository checks. H2 does not fully verify the PostgreSQL migrations.
