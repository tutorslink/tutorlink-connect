# Non-Functional Requirements — Alvey

Implements SRS §26. This document maps each quality attribute to concrete
technical practices enforced in the codebase.

## Performance (§26.2)

- Route-level code splitting via TanStack Start file-based routing.
- Data reads use TanStack Query (`ensureQueryData` in loader,
  `useSuspenseQuery` in components); no `useEffect + fetch` for initial reads.
- DB queries use indexed columns; add explicit indexes for any new hot path.
- Images: prefer `.jpg` for photos, `.png` only for transparency; lazy-load
  below the fold.
- AI calls run server-side and stream where practical.

## Availability (§26.3)

- Frontend served from Lovable's global edge.
- Database + auth on Lovable Cloud (managed HA).
- Graceful degradation: non-essential features (AI assistant, Discord sync)
  fail closed without blocking core booking flows.

## Reliability (§26.4)

- All writes go through server functions or migrations with validated input
  (Zod on server-fn `.inputValidator()`).
- RLS enforces per-user data boundaries; every public table has explicit GRANTs.
- Idempotent writes where feasible (unique constraints, upserts).

## Scalability (§26.5)

- Stateless server functions (Cloudflare Worker runtime).
- DB access via connection pooler (Supabase).
- New features integrate via existing patterns — no bespoke architectures.
- Instance size can be upgraded in Cloud → Overview → Advanced settings.

## Maintainability (§26.6)

- Modular routes under `src/routes/`, shared UI in `src/components/`,
  hooks in `src/hooks/`, server logic in `*.functions.ts` / `*.server.ts`.
- Design tokens live in `src/styles.css`; no hardcoded colors in components.
- Types generated from DB schema (`src/integrations/supabase/types.ts`).
- Coding conventions enforced by ESLint + Prettier + TypeScript strict.

## Security (§26.7)

- Supabase Auth (email/password + Google OAuth).
- RBAC via `user_roles` table + `has_role` / `is_staff` / `is_manager`
  security-definer functions. Roles are **never** stored on `profiles`.
- All backend calls require `requireSupabaseAuth` middleware unless
  intentionally public (`/api/public/*` with signature verification).
- Secrets in Lovable Cloud only; nothing sensitive in the frontend bundle.
- HTTPS enforced; publishable keys are safe to expose, service-role is not.
- Regular `security--run_security_scan` before every publish.

## Usability (§26.8) & Accessibility (§26.9)

- shadcn/ui components (accessible primitives).
- Semantic HTML, single `<h1>` per page, form labels linked to inputs.
- Responsive layouts (Tailwind breakpoints); tested on mobile widths.
- Keyboard navigable; focus rings preserved.

## Compatibility (§26.10)

- Latest 2 versions of Chrome, Edge, Firefox, Safari.
- Responsive from 320 px up.

## Data Integrity (§26.11)

- Foreign keys with appropriate `ON DELETE` semantics.
- Server-side Zod validation on every mutation.
- Audit trail via `audit_log` table.

## Privacy (§26.12)

- Collect only fields required for platform function.
- PII limited to `profiles`; access gated by RLS.
- No PII in client logs, error reports, or analytics events.

## Auditability (§26.13)

- `audit_log` records authentication, admin actions, approvals,
  scheduling changes, permission changes. Table is append-only via RLS.

## Extensibility (§26.14)

- New features follow: migration → server fn (with auth middleware) →
  loader/component with TanStack Query. Feature flags in `src/lib/config.ts`.
