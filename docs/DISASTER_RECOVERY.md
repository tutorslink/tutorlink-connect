# Disaster Recovery — Tutors Link

Implements SRS §23.12.

## Recovery Priorities

1. Data integrity
2. Authentication availability
3. Read-path availability (browsing tutors, viewing profile)
4. Write-path availability (booking, applications)
5. Non-essential features (AI, Discord sync)

## Scenarios

### A. Bad frontend deploy
- **Detect:** publish smoke test fails, or error-rate spike.
- **Act:** Lovable version history → restore previous → re-publish.
- **RTO:** < 5 min. **RPO:** 0 (no data touched).

### B. Bad migration
- **Detect:** deploy log, failing queries.
- **Act:** author a forward compensating migration; do NOT edit shipped SQL.
- **RTO:** < 30 min. **RPO:** 0 if compensating; restore from backup if data lost.

### C. Data corruption / accidental mass delete
- **Act:** restore latest Lovable Cloud backup to a new project → export
  affected tables → re-import via migration.
- **RTO:** hours. **RPO:** up to last backup interval.

### D. Third-party outage (Google OAuth, AI Gateway, Discord)
- **Act:** feature flag off the affected integration; email/password auth
  remains available; core booking flows continue.
- **RTO:** immediate degradation, restored when provider recovers.

### E. Cloud platform outage
- **Act:** post status update; wait for platform recovery. No local failover
  in v1 (see §27.13 risks).

## Communication

- Internal: Owner + Website Manager notified immediately.
- External: status message on landing page (feature-flag driven banner).

## Drill Cadence

Quarterly rollback drill (scenario A) and semi-annual backup restore drill
(scenario C). Record outcomes in `CHANGELOG.md`.
