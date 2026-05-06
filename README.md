# Fantasy Football Frontend

React 19 application for the fantasy soccer platform — the user-facing UI for the [`fantasy-football-api`](https://github.com/PatrickalKhouri/fantasy-football-api) backend.

## Tech Stack

- React 19.0.0 + TypeScript 4.9.5
- Material UI (MUI) 7.0.0 + Tailwind CSS
- React Query (TanStack) 5.71.5
- React Router DOM 7.4.1
- Axios 1.8.4
- date-fns / dayjs

## Commands

```bash
npm start       # Dev server on http://localhost:3000
npm test        # Jest watch mode
npm run build   # Production build to ./build
```

## Project Structure

```
src/
├── api/           # API client: queries, mutations, axios config
├── components/    # Reusable React components
├── context/       # React Context (AuthContext)
├── pages/         # Page components, one per route
├── utils/         # Utility functions
├── App.tsx        # Top-level routing
└── index.tsx      # Entry point
```

## Key Patterns

### API calls

All backend communication lives under `src/api/`. We use React Query for caching, retry, and stale-while-revalidate behavior.

- **Queries:** `use*Queries.ts` — e.g., `useFantasyLeagueQueries.ts`, `usePlayerQueries.ts`.
- **Mutations:** `use*Mutations.ts` — invalidate the relevant query keys on success.

```typescript
// Query
const { data, isLoading } = useQuery({
  queryKey: ['leagues'],
  queryFn: fetchLeagues,
});

// Mutation
const mutation = useMutation({
  mutationFn: createLeague,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leagues'] }),
});
```

### Authentication

- `AuthContext` provides `user`, `login`, `logout`.
- JWT token stored in `localStorage`.
- `ProtectedLayout` wraps authenticated routes; unauthenticated users are redirected to login.
- `PublicRoute` redirects already-logged-in users away from login/signup pages.

### API configuration

The backend URL is read from `REACT_APP_BACKEND_URL` (see [Environment Variables](#environment-variables)) and lives in `src/api/config.ts`:

```typescript
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
```

## Component Conventions

- **Pages** live in `src/pages/` and correspond 1:1 to routes.
- **Modals** are separate components (e.g., `CreateLeagueModal`, `AddPlayerModal`) — not inlined into pages.
- **Forms** use MUI components with controlled inputs.

## Environment Variables

Create `.env` in the repo root:

```
REACT_APP_BACKEND_URL=http://localhost:4000
```

## Testing

- Jest + React Testing Library.
- Test files: `*.test.tsx`, colocated with the component they test.
- Setup in `src/setupTests.ts`.

## Related

- **API:** [`fantasy-football-api`](https://github.com/PatrickalKhouri/fantasy-football-api) — backend this UI talks to.
- **Cross-repo docs:** [`caneta-fantasy/fantasy-docs`](https://github.com/caneta-fantasy/fantasy-docs) — vision, architecture, glossary, conventions, ADRs.
