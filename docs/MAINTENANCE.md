# Maintenance & Operations — Tutors Link

Implements SRS §23.8–§23.14.

## Monitoring (§23.8)

- **Edge / server-fn logs:** Lovable Cloud → Logs.
- **DB health:** `supabase--db_health`, `supabase--slow_queries`.
- **Client errors:** captured by `src/lib/error-capture.ts` + Lovable error
  reporting.
- **Health check:** `GET /api/public/health` returns
  `{ ok: true, ts, version }`.

## Logging (§23.9)

Use `src/lib/logger.ts` (`log.info` / `log.warn` / `log.error`). Never log:
- Passwords, tokens, session JSON
- Full PII (email OK for auth events; redact elsewhere)
- Service-role keys or any `SUPABASE_SERVICE_ROLE_KEY`-derived values

## Routine Maintenance (§23.10) — cadence

| Task                          | Cadence      | Owner            |
| ----------------------------- | ------------ | ---------------- |
| Dependency updates (patch)    | Monthly      | Website Manager  |
| Dependency updates (major)    | Quarterly    | Website Manager  |
| Security scan                 | Every deploy | Website Manager  |
| Credential rotation           | Semi-annual  | Owner            |
| Permission / role review      | Quarterly    | Owner            |
| Backup restore drill          | Quarterly    | Owner            |
| Slow-query review             | Monthly      | Website Manager  |
| Audit-log spot check          | Monthly      | Owner            |

## Backups (§23.11)

Lovable Cloud performs automated database backups. Retention follows the
active Cloud plan. Manual export: **Cloud → Advanced → Export data**.

## Security Maintenance (§23.14)

- Rotate: `LOVABLE_API_KEY` via `lovable_api_key--rotate_lovable_api_key`.
- Rotate: user-provided secrets via `update_secret`.
- Review: `user_roles` table for unexpected grants after each major release.
- Review: RLS policies whenever a new table is added.

## Performance Optimization (§23.13)

- Add DB indexes for every filter/join used on hot paths.
- Prefer `select('col1,col2')` over `select('*')` on large tables.
- Paginate any list expected to exceed 100 rows.
- Cache read-only public data with TanStack Query `staleTime`.
