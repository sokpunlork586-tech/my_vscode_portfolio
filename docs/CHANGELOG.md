# Project Changelog & Release History

All notable changes to the **Portfolio CMS & VS Code Web Platform** are documented in this file following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Neon Serverless PostgreSQL cloud migration.
- Automated GitHub Actions CI/CD deployment pipeline.
- Production SSL reverse proxy setup.

---

## [2.0.0] - 2026-11-07

### Added
- **Universal Technical Documentation System:** 17 comprehensive technical architecture, deployment, security, and maintenance documents added under `docs/`.
- **Neon Database Migration Framework:** Created zero-data-loss ETL script (`migrate_sqlite_to_neon.py`), setup guides, and technical audit reports.
- **Failover Engine:** Integrated 3-second connection timeout circuit breaker falling back from PostgreSQL to SQLite.

### Changed
- Refactored `DashboardLayout.tsx` and `StatusBar/styles.ts` from `100vw` to `100%` and `max-w-full` to eliminate Windows horizontal scrollbar jitter.
- Standardized modal forms across all CMS modules with responsive `max-h-[90vh]`, `overflow-y-auto`, and touch-friendly mobile stacking (`grid-cols-1 sm:grid-cols-2`).

### Fixed
- **SSR Hydration Mismatch:** Replaced sequential rule counter in `frontend/src/components/JssRegistry/index.tsx` with deterministic DJB2 content hashing, eliminating `Prop className did not match` errors.
- **Next.js Dev Server Caching:** Added automated `clean` and `predev` hooks in `admin-dashboard/package.json` to purge corrupted `.next` webpack artifacts on boot.

### Security
- **Seed Credential Scrub:** Completely removed all hardcoded administrative seed credentials (`admin@portfolio.com` / `Admin1234!`) from the login form and client workbench.
- Sanitized database connection logging in simulated Integrated Terminal.

---

## [1.1.0] - 2026-11-05

### Added
- **Admin CMS CRUD Modules:** Completed 10 full-featured management modules:
  - Projects CRUD with multi-tag support
  - Skills CRUD with live proficiency sliders
  - Education history management
  - Professional work experience milestones
  - Industry certifications & credential verification
  - Contact information and social links manager
  - Profile greeter copy and typewriter sentence editor
- **Telemetry & Dashboard Analytics:** Recharts telemetry charting for page views and contact inquiries.

### Fixed
- Resolved 500 error on `/favicon.ico` by configuring static route handling in Next.js.
- Fixed layout token parsing syntax errors in admin dashboard.

---

## [1.0.0] - 2026-11-03

### Added
- Initial release of the VS Code-styled developer portfolio website.
- Next.js 14 App Router public frontend with interactive editor tabs, file explorer, and pseudo-terminal.
- FastAPI backend with initial SQLite database and SQLAlchemy ORM models.
- JWT authentication services and role-based access control models.
