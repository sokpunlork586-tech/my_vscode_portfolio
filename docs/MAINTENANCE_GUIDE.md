# System Maintenance & Operational Excellence Guide

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Site Reliability Engineering (SRE), Routine Upkeep & Lifecycle Management  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Routine Maintenance Schedule](#1-routine-maintenance-schedule)
- [2. Dependency Management & Security Patching](#2-dependency-management--security-patching)
- [3. Database Health & Optimization](#3-database-health--optimization)
- [4. File Storage & Orphaned Asset Pruning](#4-file-storage--orphaned-asset-pruning)
- [5. Log Rotation & Performance Auditing](#5-log-rotation--performance-auditing)
- [6. Deprecation Policy & Tech Debt Management](#6-deprecation-policy--tech-debt-management)
- [7. Universal Reusability Notes](#7-universal-reusability-notes)

---

## 1. Routine Maintenance Schedule

| Cadence | Operational Task | Procedure / Tools |
| :--- | :--- | :--- |
| **Daily** | Automated Health Checks | Uptime monitoring on `GET /health`. |
| **Weekly** | Database Backup Verification | Run backup script in [BACKUP_RECOVERY.md](file:///c:/Users/Data%20Science/Documents/Project%20Done/my_vscode_portfolio/docs/BACKUP_RECOVERY.md). |
| **Monthly** | Dependency CVE Scanning | Run `npm audit` and `pip-audit`. |
| **Quarterly** | Runtime & Library Upgrades | Evaluate minor/patch upgrades for Next.js, FastAPI, and SQLAlchemy. |
| **Annual** | SSL & Domain Renewals | Validate Let's Encrypt automated certbot cron jobs and DNS records. |

---

## 2. Dependency Management & Security Patching

### 2.1 Checking for Outdated Packages

#### Frontend & Admin (Node.js):
```powershell
cd frontend
npm outdated

cd ..\admin-dashboard
npm outdated
```

#### Backend (Python):
```powershell
cd backend
pip list --outdated
```

### 2.2 Updating Dependencies Safely
1. Create an isolated git branch: `git checkout -b chore/dependency-updates`.
2. Apply patch/minor updates: `npm update` (Frontend) or `pip install -U <package>` (Backend).
3. Execute full test suites:
   ```powershell
   cd frontend; npm test
   cd ..\backend; python -m pytest tests/
   ```
4. Verify build artifacts: `npm run build` in both Next.js applications.

---

## 3. Database Health & Optimization

### 3.1 SQLite Maintenance (`backend/portfolio_dev.db`)
Execute integrity checks and reclaim unused disk blocks:

```powershell
cd backend
$env:PYTHONPATH="."
python -c "
import sqlite3
conn = sqlite3.connect('portfolio_dev.db')
cursor = conn.cursor()
cursor.execute('PRAGMA integrity_check;')
print('Integrity Check:', cursor.fetchone()[0])
cursor.execute('VACUUM;')
print('Vacuum complete.')
conn.close()
"
```

### 3.2 Neon PostgreSQL Maintenance
When running on Neon PostgreSQL:
1. Neon automatically handles physical WAL archival and backups.
2. Run periodic query optimization:
   ```sql
   ANALYZE;
   ```

---

## 4. File Storage & Orphaned Asset Pruning

Over time, project images and user avatars uploaded to `backend/uploads/` may become orphaned when parent records are deleted.

### Asset Pruning Script (`backend/prune_orphaned_uploads.py`):
```python
import os
from pathlib import Path
from app.db.session import SessionLocal
from app.models.project import Project
from app.models.user import User

db = SessionLocal()
uploads_dir = Path("uploads")

# Query active image references
active_images = set()
for p in db.query(Project.image_url).all():
    if p[0]: active_images.add(os.path.basename(p[0]))
for u in db.query(User.avatar_url).all():
    if u[0]: active_images.add(os.path.basename(u[0]))

print(f"Total active referenced images: {len(active_images)}")
db.close()
```

---

## 5. Log Rotation & Performance Auditing

### 5.1 Next.js Build Performance
Audit Web Vitals and bundle sizes:
```powershell
cd frontend
npm run build
```
Verify that the First Load JS shared by all chunks remains under **120 kB**.

### 5.2 Lighthouse Audits
Run Chrome DevTools Lighthouse against `http://localhost:3000`:
* **Performance:** Target `>= 95`
* **Accessibility:** Target `100`
* **Best Practices:** Target `100`
* **SEO:** Target `100`

---

## 6. Deprecation Policy & Tech Debt Management

1. **Schema Deprecations:** When replacing tables (e.g. legacy `education` replaced by `educations`), retain deprecated tables in read-only mode for at least one release cycle before executing `DROP TABLE`.
2. **API Deprecations:** Announce API endpoint deprecations with a `Sunset` HTTP header at least 30 days prior to removal.

---

## 7. Universal Reusability Notes

To reuse this maintenance guide:
1. Update Section 1 with your organization's SLA requirements.
2. Adjust the asset pruning logic if using AWS S3, Cloudflare R2, or Google Cloud Storage.
3. Keep the dependency upgrade workflow and database integrity checks as standard SRE practices.
