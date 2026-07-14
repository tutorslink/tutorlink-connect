# Deployment Guide — Tutors Link

Implements SRS §23 (Deployment & Maintenance).

## 1. Environments

| Env         | Purpose                         | URL pattern                                  |
| ----------- | ------------------------------- | -------------------------------------------- |
| Development | Local + Lovable preview sandbox | `id-preview--<project>.lovable.app`          |
| Preview     | Latest committed build          | `project--<project-id>-dev.lovable.app`      |
| Production  | Published release               | `project--<project-id>.lovable.app` + custom |

Configuration is fully isolated per environment. Secrets are stored via Lovable
Cloud (Supabase secrets) — never in source code, never in the frontend bundle.

## 2. Deployment Principles (§23.2)

Reliability, repeatability, security, minimal downtime, rollback capability,
automation, environment consistency, scalability.

## 3. Deployment Workflow (§23.5)

1. **Validate** — typecheck + build must pass (`bun run build`).
2. **Automated checks** — security scan (`security--run_security_scan`) with
   zero unresolved critical findings.
3. **Backend deploys automatically** — DB migrations under
   `supabase/migrations/` and server functions apply on commit.
4. **Frontend deploy** — click **Publish** in Lovable (or `preview_ui--publish`).
5. **Smoke test** — sign-in, dashboard load, role-gated route, health check
   (`/api/public/health`).
6. **Monitor** — watch edge logs and error reports for 15 min post-deploy.

Every deploy is traceable (Lovable version history) and reversible.

## 4. Version Management (§23.6)

Each production release records: version, date, summary, responsible admin,
notable changes, migration list. Recorded in Lovable's version history plus
`CHANGELOG.md` (add entries per release).

## 5. Rollback (§23.7)

- **Frontend:** open Lovable version history → _Restore_ previous version →
  re-publish. Preserves user data (DB is not reverted).
- **Backend / DB:** never mutate a shipped migration. Author a forward
  compensating migration that reverses the change; test locally first.
- **Emergency:** disable the failing feature via feature flag before rolling
  back code.

Rollback drills should run at least quarterly.

## 6. Post-Deploy Verification

- Auth flow (email + Google)
- Role-gated route (`/dashboard` under `_authenticated`)
- Health endpoint returns `200 { ok: true }`
- No new error spikes in edge logs

## 7. Custom Domain

Connect via **Project Settings → Domains** after first publish. SSL is
provisioned automatically.

## 8. Documentation (§23.16)

Keep this file, `ENVIRONMENT.md`, `MAINTENANCE.md`, and `DISASTER_RECOVERY.md`
current with any architectural change.
