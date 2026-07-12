# Environment Configuration — Tutors Link

Implements SRS §23.4.

## Categories

| Category         | Where it lives                          | Exposed to browser?     |
| ---------------- | --------------------------------------- | ----------------------- |
| Public config    | `VITE_*` in `.env` / Lovable Cloud      | Yes (build-time inline) |
| Server secrets   | Lovable Cloud → Backend → Secrets       | No (server only)        |
| Feature flags    | `src/lib/config.ts` (+ optional env)    | Depends on prefix       |
| DB / auth config | Managed by Lovable Cloud                | No                      |

## Rules

1. Never place a secret in any file that ships to the browser.
2. Only `VITE_`-prefixed vars are inlined into the client bundle.
3. Server code reads secrets via `process.env.*` **inside** handler bodies —
   never at module scope of files the client imports.
4. Add new secrets via the `add_secret` tool (never edit `.env` in production).
5. Rotate credentials on a schedule and after any suspected exposure (§23.14).

## Current Variables

See `.env.example` for the canonical list. Present today:

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `SUPABASE_DB_URL`, `LOVABLE_API_KEY` (server)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
  `VITE_SUPABASE_PROJECT_ID` (client)

## Adding a New Integration

1. Design the surface (server function or `/api/public/*` route).
2. Register the secret via `add_secret`.
3. Read it inside `.handler()`; never at module scope.
4. Update `.env.example` with a **blank** placeholder and a comment.
5. Document rotation ownership in `MAINTENANCE.md`.
