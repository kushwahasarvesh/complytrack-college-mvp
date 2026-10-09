# College Demonstration Script

1. Introduce the problem: filing dates are easy to miss when they live in spreadsheets and calendars.
2. Explain the architecture: Angular routes call a Spring Boot API, which stores data in PostgreSQL through Flyway.
3. Show the sign-in page on a laptop and point out that the whole page fits without scrolling. Open create-account and show the same layout.
4. Register a user, then sign in.
5. Refresh the browser and explain that the token is kept in memory, so the session ends.
6. Sign in again. Create a business profile.
7. Open Rules and explain the difference between a shared demonstration rule and a deadline owned by the user.
8. Create a rule with the overdue date shortcut and generate its deadline.
9. Open Alerts, add the sample overdue and due-soon items, and show both lists.
10. Mark one deadline complete.
11. Return to the dashboard and show total, upcoming, due soon, overdue and completed.
12. Show the Flyway migrations and the deadline unit tests.
13. Close with the limits: demonstration rules only, no government portal, and no email reminders yet.

## Suggested viva questions
- Why is this a modular monolith instead of microservices?
- What do the two Flyway migrations do?
- How does JWT authentication work, and why does refresh sign the user out?
- Why are passwords hashed with BCrypt?
- How does the API stop one user from reading another user's business?
- What is the difference between a compliance rule and a deadline?
- How is UPCOMING, DUE_SOON and OVERDUE decided?
- How would legal filing dates be verified before real use?
- How would email reminders be added later?
