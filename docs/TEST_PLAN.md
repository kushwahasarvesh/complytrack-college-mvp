# Test Plan

## Unit tests
Implemented in `DeadlineServiceTest`:
- Deadline generation copies the rule due date and links the caller's business and rule.
- Generation rejects a business the caller does not own.
- Completing a deadline sets status to COMPLETED and records a completion time.
- An open deadline reports OVERDUE, DUE_SOON or UPCOMING from its due date.

Still recommended, not yet automated:
- Registration rejects a duplicate email.
- Passwords are stored as BCrypt hashes, not plaintext.
- JWT validation rejects a malformed or expired token.
- Dashboard counts match repository data.

## Integration tests
Recommended against PostgreSQL. Not automated in this MVP:
- Flyway V1 and V2 start cleanly.
- Register and login return a token.
- A protected API without a token returns 401.
- One user cannot read another user's business or deadline.
- Generate and complete persist the expected rows.
- Sample deadlines are created once per business and rule.

## Manual test checklist
1. Register a user with a valid email and a password of at least 8 characters.
2. Register the same email again and expect 409.
3. Sign in and confirm the dashboard loads.
4. Refresh the browser and confirm the sign-in page returns with the refresh notice.
5. Call a protected API without a token and expect 401.
6. Create a business.
7. List compliance rules, including the overdue and due-soon demonstration rules.
8. Create a rule from `/rules/new` with a past date and generate its deadline.
9. On Alerts, add sample overdue and due-soon deadlines. Run it again and confirm it does not duplicate them.
10. Mark a deadline complete and confirm the dashboard completed count increases.
11. On a laptop-sized window, confirm sign-in and create-account fit without page scrolling.
12. Narrow the window and confirm the header becomes a menu and the auth page stacks.
13. Restart the backend and confirm businesses, rules and deadlines remain in PostgreSQL.

## Security checks
- A missing or invalid JWT is rejected with 401.
- Invalid request bodies, including a bad frequency or day of month, are rejected.
- User A cannot read or modify User B's business or deadline.
- Refreshing the browser drops the in-memory token.
- Document upload checks are required before any evidence-file feature is enabled.
