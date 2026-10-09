# College Demonstration Script

1. Introduce the problem: compliance dates and evidence are often tracked manually.
2. Explain the architecture: Angular → Spring Boot REST API → PostgreSQL.
3. Register a user and sign in.
4. Create a demo business profile.
5. View sample compliance rules.
6. Generate a deadline and explain the rule-to-deadline relationship.
7. Mark the deadline completed.
8. Show dashboard metrics.
9. Show Flyway migrations and automated test output.
10. Explain limitations: demonstration rules, no government integrations, and email provider integration as future scope.

## Suggested viva questions
- Why did you choose a modular monolith instead of microservices?
- What does Flyway do?
- How does JWT authentication work?
- Why should passwords be hashed?
- How do you prevent users from accessing other businesses' records?
- What is the difference between a compliance rule and a deadline?
- How would you scale notifications?
- How would you verify legal filing dates?
