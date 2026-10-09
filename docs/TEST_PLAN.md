# Test Plan

## Unit tests
- Registration rejects duplicate email.
- Passwords are stored hashed, not as plaintext.
- JWT validation rejects malformed/expired tokens.
- Deadline generator copies due date and links rule/business.
- Completing a deadline changes its status.
- Dashboard counts reflect repository data.

## Integration tests
- Flyway migration starts against PostgreSQL.
- Register/login API returns expected status and token.
- Unauthenticated access to protected APIs returns 401.
- Business API does not expose another user's records.
- Generate deadline API persists a deadline.
- Complete deadline API returns updated status.

## Manual test checklist
1. Register a user with a valid email and password.
2. Try registering the same email again; expect a conflict.
3. Log in and copy the access token.
4. Call a protected API without a token; expect 401.
5. Create a business using the token.
6. List compliance rules.
7. Generate a deadline for the created business and a rule.
8. Complete the deadline.
9. Confirm dashboard completed count increments.
10. Restart the backend and verify records remain in PostgreSQL.

## Security checks
- Invalid JWT rejected.
- Invalid request bodies rejected.
- User A cannot read or modify User B's business/deadline.
- Upload limits and file type checks must be added before enabling real document uploads.
