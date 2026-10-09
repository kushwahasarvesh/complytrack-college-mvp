# ComplyTrack Angular client

Angular 18 standalone application. The API base URL is `http://localhost:8080/api/v1` in `src/app/api.service.ts`.

## Run
```bash
npm install
npm start
```

The dev server listens on `http://127.0.0.1:4200/`.

## Screens
| Route | Purpose |
| --- | --- |
| `/login` | Sign in. Fits one viewport on laptop and desktop. |
| `/register` | Create an account. Same layout as sign in. |
| `/dashboard` | Counts and open deadlines. |
| `/businesses` | Add and list business profiles. |
| `/rules` | List rules and generate a deadline for a selected business. |
| `/rules/new` | Create a rule. Date shortcuts set an overdue, due-soon or upcoming date. |
| `/attention` | Overdue and due-soon deadlines, including sample data. |
| `/deadlines` | All deadlines, with status filters and completion. |

The header and footer are shared after sign-in. On a narrow screen the header links move into a menu.

## Session
The JWT is stored in memory only. Moving between pages keeps the session. Refreshing the browser signs the user out and shows a notice on the sign-in page.
