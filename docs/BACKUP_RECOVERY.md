# Backup, Disaster Recovery & Business Continuity Guide

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** RPO/RTO Objectives, Point-in-Time Recovery & Disaster Runbooks  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Disaster Recovery Objectives (RPO & RTO)](#1-disaster-recovery-objectives-rpo--rto)
- [2. SQLite Database Backup Procedures](#2-sqlite-database-backup-procedures)
- [3. Neon PostgreSQL Backups & Point-in-Time Recovery (PITR)](#3-neon-postgresql-backups--point-in-time-recovery-pitr)
- [4. Media & Uploads Storage Backup](#4-media--uploads-storage-backup)
- [5. Disaster Recovery Runbooks](#5-disaster-recovery-runbooks)
- [6. Verification Drills & Validation Procedures](#6-verification-drills--validation-procedures)
- [7. Universal Reusability Notes](#7-universal-reusability-notes)

---

## 1. Disaster Recovery Objectives (RPO & RTO)

| Metric | Target | Description |
| :--- | :---: | :--- |
| **Recovery Point Objective (RPO)** | **< 1 hour** | Maximum acceptable data loss period in the event of an outage. |
| **Recovery Time Objective (RTO)** | **< 15 minutes** | Maximum allowable downtime before services must be fully operational. |

---

## 2. SQLite Database Backup Procedures

Because SQLite operates as a single file (`backend/portfolio_dev.db`), hot backups must be created using SQLite's online backup API or file copy with write-locks.

### 2.1 Automated PowerShell Backup Script (`backup_sqlite.ps1`)
```powershell
# Navigate to project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
cd $projectRoot

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "$projectRoot\backups\$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$sourceDb = "$projectRoot\backend\portfolio_dev.db"
$destDb = "$backupDir\portfolio_dev_$timestamp.db"

# Copy active database
Copy-Item $sourceDb -Destination $destDb

# Generate SHA256 integrity checksum
$hash = (Get-FileHash $destDb -Algorithm SHA256).Hash
Set-Content "$backupDir\checksum.sha256" -Value "$hash  portfolio_dev_$timestamp.db"

Write-Host "Backup Created: $destDb"
Write-Host "SHA256: $hash"
```

### 2.2 Linux / macOS Bash Backup Script (`backup_sqlite.sh`)
```bash
#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

sqlite3 ./backend/portfolio_dev.db ".backup '${BACKUP_DIR}/portfolio_dev_${TIMESTAMP}.db'"
sha256sum "${BACKUP_DIR}/portfolio_dev_${TIMESTAMP}.db" > "${BACKUP_DIR}/checksum.sha256"

echo "Backup successful: ${BACKUP_DIR}"
```

---

## 3. Neon PostgreSQL Backups & Point-in-Time Recovery (PITR)

When running on **Neon Serverless PostgreSQL**:

1. **Continuous WAL Archival:** Neon continuously streams write-ahead logs (WAL) to resilient S3/NVMe storage tiers.
2. **Point-in-Time Recovery (PITR):** You can restore your database state to any specific timestamp within your retention period (e.g., 7 to 30 days).
3. **Instant Branching:** If you need to recover deleted rows or inspect past data, create a read-only branch in the Neon Console at a prior timestamp without interrupting the live database.

---

## 4. Media & Uploads Storage Backup

User-uploaded project images and avatars in `backend/uploads/` must be archived alongside database records:

```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Compress-Archive -Path ".\backend\uploads\*" -DestinationPath ".\backups\uploads_backup_$timestamp.zip"
```

---

## 5. Disaster Recovery Runbooks

### 5.1 Scenario A: Accidental Table Deletion in SQLite
1. Stop the FastAPI backend:
   ```powershell
   Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
   ```
2. Locate the most recent valid backup in `.\backups\`.
3. Overwrite `backend/portfolio_dev.db` with the backup file:
   ```powershell
   Copy-Item ".\backups\<timestamp>\portfolio_dev_backup.db" ".\backend\portfolio_dev.db" -Force
   ```
4. Restart FastAPI:
   ```powershell
   cd backend; $env:PYTHONPATH="."; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```

### 5.2 Scenario B: Neon PostgreSQL Outage / Cloud Failure
1. Activate the 60-second local SQLite fallback detailed in [DATABASE_MIGRATION_GUIDE.md](file:///c:/Users/Data%20Science/Documents/Project%20Done/my_vscode_portfolio/docs/DATABASE_MIGRATION_GUIDE.md).
2. Edit `backend/.env`:
   ```ini
   DATABASE_URL="sqlite:///./portfolio_dev.db"
   ```
3. Restart FastAPI. The service immediately resumes serving traffic from the local SQLite store.

---

## 6. Verification Drills & Validation Procedures

Execute disaster recovery drills quarterly:
1. Restore a backup copy to a temporary directory.
2. Validate table integrity via SQLite PRAGMA checks:
   ```sql
   PRAGMA integrity_check;
   ```
3. Compare record counts against production to verify zero missing rows.

---

## 7. Universal Reusability Notes

To reuse this disaster recovery guide:
1. Adjust RPO and RTO metrics in Section 1 to align with your organization's business contracts.
2. Update Section 3 if using AWS RDS (automated daily snapshots) or GCP Cloud SQL.
3. Maintain the automated backup script templates and restoration runbooks.
