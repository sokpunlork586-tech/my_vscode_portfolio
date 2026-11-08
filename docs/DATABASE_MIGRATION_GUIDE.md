# SQLite to Neon PostgreSQL Database Migration Guide

**Document Version:** 1.0.0  
**Date:** November 7, 2026  
**Auditor & Specialist:** Senior Database Engineer  
**Source Database:** SQLite 3 (`backend/portfolio_dev.db`)  
**Target Database:** Neon Serverless PostgreSQL (`PostgreSQL 16`)  

---

## Table of Contents

- [1. Executive Migration Overview](#1-executive-migration-overview)
- [2. Critical Note on `backend/seed.py`](#2-critical-note-on-backendseedpy)
- [3. Pre-Migration Data Audit](#3-pre-migration-data-audit)
- [4. Step 1: Backup the Existing SQLite Database](#step-1-backup-the-existing-sqlite-database)
- [5. Step 2: Inspect SQLAlchemy Models & DDL Constraints](#step-2-inspect-sqlalchemy-models--ddl-constraints)
- [6. Step 3: Configure PostgreSQL Driver & Dialect](#step-3-configure-postgresql-driver--dialect)
- [7. Step 4: Provision Schema on Neon PostgreSQL](#step-4-provision-schema-on-neon-postgresql)
- [8. Step 5: Execute Automated Data Migration (ETL Script)](#step-5-execute-automated-data-migration-etl-script)
- [9. Step 6: Verify Row Counts & Schema Concordance](#step-6-verify-row-counts--schema-concordance)
- [10. Step 7: Verify Relationships, Sequence Counters & Constraints](#step-7-verify-relationships-sequence-counters--constraints)
- [11. Step 8: Test API & CMS CRUD Operations](#step-8-test-api--cms-crud-operations)
- [12. Step 9: Validate Data Integrity & Field Encoding](#step-9-validate-data-integrity--field-encoding)
- [13. Step 10: Failover & Rollback Strategy](#step-10-failover--rollback-strategy)

---

## 1. Executive Migration Overview

The purpose of this guide is to execute a **zero-data-loss migration** transitioning the Portfolio platform from local SQLite (`backend/portfolio_dev.db`) to cloud-hosted **Neon Serverless PostgreSQL**.

```mermaid
flowchart LR
    subgraph Phase 1: Preparation
        BKP[1. Timestamped SQLite Backup]
        AUDIT[2. Source Row Audit: 23 records]
    end

    subgraph Phase 2: Schema DDL
        NEON_INIT[3. Base.metadata.create_all on Neon]
        TABLES[4. 11 PostgreSQL Tables Created]
    end

    subgraph Phase 3: Data Migration
        EXTRACT[5. Read Rows from SQLite]
        TRANSFORM[6. Type Sanitization & JSON Parsing]
        LOAD[7. Bulk Insert with PK Preservation]
    end

    subgraph Phase 4: Validation
        COUNT[8. Row Count Verification]
        SEQ[9. Postgres Sequence Synchronization]
        TEST[10. Admin CMS CRUD Validation]
    end

    Phase 1 --> Phase 2
    Phase 2 --> Phase 3
    Phase 3 --> Phase 4
```

---

## 2. Critical Note on `backend/seed.py`

> [!WARNING]
> **Do not rely on `backend/seed.py` for database migration.**  
> Code inspection of `backend/seed.py` demonstrates that:
> 1. It only executes `Base.metadata.create_all(bind=engine)` and checks `if db.query(Model).count() == 0:`.
> 2. It inserts **hardcoded static sample data** rather than transferring existing database rows.
> 3. It **omits** the `Profile` model (`profiles` table) entirely.
> 4. Running `seed.py` against a blank database will overwrite all your custom content with factory mock data.

A custom, deterministic Python ETL migration script (provided in [Step 5](#step-5-execute-automated-data-migration-etl-script)) must be used to preserve custom database records.

---

## 3. Pre-Migration Data Audit

Prior to beginning migration, confirm the record counts in the source SQLite database (`backend/portfolio_dev.db`):

| Model Name | Table Name | SQLite Row Count | Target Neon Table |
| :--- | :--- | :---: | :--- |
| `User` | `users` | **2** | `users` |
| `Profile` | `profiles` | **1** | `profiles` |
| `Project` | `projects` | **4** | `projects` |
| `Skill` | `skills` | **7** | `skills` |
| `Education` | `educations` | **2** | `educations` |
| `Experience` | `experiences` | **2** | `experiences` |
| `Certificate` | `certificates` | **3** | `certificates` |
| `ContactInfo` | `contact_infos` | **1** | `contact_infos` |
| `SocialLink` | `social_links` | **3** | `social_links` |
| `Message` | `messages` | **3** | `messages` |
| `Metric` | `metrics` | **0** | `metrics` |
| **Total Records** | | **23** | |

---

## Step 1: Backup the Existing SQLite Database

Always create an immutable timestamped backup of the production SQLite database before performing operations.

Run the following command in Windows PowerShell:

```powershell
# Navigate to the project root
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio"

# Generate timestamped backup folder
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".\backups\$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir

# Copy the primary active SQLite database
Copy-Item ".\backend\portfolio_dev.db" -Destination "$backupDir\portfolio_dev_backup.db"

# Verify backup integrity
$sourceSize = (Get-Item ".\backend\portfolio_dev.db").Length
$backupSize = (Get-Item "$backupDir\portfolio_dev_backup.db").Length

Write-Host "Backup Created Successfully at: $backupDir\portfolio_dev_backup.db"
Write-Host "Source Size: $sourceSize bytes | Backup Size: $backupSize bytes"
```

---

## Step 2: Inspect SQLAlchemy Models & DDL Constraints

Review model definitions in `backend/app/models/` to understand constraint mapping between SQLite and PostgreSQL:

1. **Auto-increment IDs:** SQLite uses `INTEGER PRIMARY KEY AUTOINCREMENT`, whereas PostgreSQL uses `SERIAL` sequences (`nextval('table_id_seq')`).
2. **Boolean Types:** SQLite stores booleans as integer flags (`0` and `1`). PostgreSQL uses native `BOOLEAN` (`true` and `false`).
3. **Enum Mapping:** In `backend/app/models/user.py`, the `UserRole` enum specifies `native_enum=False`. It is stored as a `VARCHAR(50)` constraint, ensuring portable insertion without creating separate PostgreSQL enum types.
4. **JSON / Text Fields:** Fields like `typed_lines` and `quick_navigation` are stored as `Text` strings containing JSON arrays.

---

## Step 3: Configure PostgreSQL Driver & Dialect

Ensure `psycopg2-binary` is installed and registered in your Python virtual environment.

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
& "C:\Program Files\Python313\python.exe" -m pip install "psycopg2-binary>=2.9.9"
```

In `backend/.env`, set the target Neon connection string:

```ini
DATABASE_URL="postgresql+psycopg2://<user>:<password>@<endpoint-id>.neon.tech/<dbname>?sslmode=require"
```

---

## Step 4: Provision Schema on Neon PostgreSQL

Execute SQLAlchemy's schema generator against Neon to create all tables and indexes cleanly:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" -c "
from app.db.session import engine
from app.db.base import Base
import app.models

print('Creating database tables in Neon...')
Base.metadata.create_all(bind=engine)
print('All 11 tables successfully created in Neon PostgreSQL!')
"
```

---

## Step 5: Execute Automated Data Migration (ETL Script)

Save the following migration script as `backend/migrate_sqlite_to_neon.py` to transfer all 23 records safely:

```python
"""
migrate_sqlite_to_neon.py
Automated ETL migration script transferring records from SQLite to Neon PostgreSQL.
"""
import sys
import sqlite3
from pathlib import Path
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.models.user import User
from app.models.profile import Profile
from app.models.project import Project
from app.models.skill import Skill
from app.models.education import Education
from app.models.experience import Experience
from app.models.certificate import Certificate
from app.models.contact import ContactInfo, SocialLink
from app.models.message import Message
from app.models.analytics import Metric

# Paths & Connections
BACKEND_DIR = Path(__file__).resolve().parent
SQLITE_PATH = BACKEND_DIR / "portfolio_dev.db"

if not SQLITE_PATH.exists():
    print(f"Error: Source SQLite database not found at {SQLITE_PATH}")
    sys.exit(1)

pg_engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
PgSession = sessionmaker(bind=pg_engine)

MODELS = [
    User,
    Profile,
    Project,
    Skill,
    Education,
    Experience,
    Certificate,
    ContactInfo,
    SocialLink,
    Message,
    Metric,
]


def migrate():
    print(f"Connecting to source SQLite: {SQLITE_PATH}")
    sqlite_engine = create_engine(f"sqlite:///{SQLITE_PATH.as_posix()}")
    SqliteSession = sessionmaker(bind=sqlite_engine)

    sqlite_db = SqliteSession()
    pg_db = PgSession()

    try:
        print("Ensuring Neon schema exists...")
        Base.metadata.create_all(bind=pg_engine)

        for model in MODELS:
            table_name = model.__tablename__
            rows = sqlite_db.query(model).all()
            print(f"Migrating {len(rows)} records from table '{table_name}'...")

            for item in rows:
                data = {c.name: getattr(item, c.name) for c in model.__table__.columns}
                # Check for existing primary key
                pk_val = data.get("id")
                existing = pg_db.query(model).filter(model.id == pk_val).first() if pk_val else None

                if not existing:
                    new_obj = model(**data)
                    pg_db.add(new_obj)

            pg_db.commit()
            print(f"  [OK] '{table_name}' migrated.")

        # Synchronize PostgreSQL auto-increment sequences
        print("Synchronizing PostgreSQL ID sequence counters...")
        with pg_engine.connect() as conn:
            for model in MODELS:
                t_name = model.__tablename__
                query = text(f"""
                    SELECT setval(
                        pg_get_serial_sequence('{t_name}', 'id'),
                        COALESCE((SELECT MAX(id) FROM {t_name}), 1),
                        (SELECT MAX(id) IS NOT NULL FROM {t_name})
                    );
                """)
                try:
                    conn.execute(query)
                    conn.commit()
                except Exception as seq_err:
                    print(f"  [WARN] Sequence sync skipped for {t_name}: {seq_err}")

        print("\nSUCCESS: All data successfully migrated to Neon PostgreSQL!")

    except Exception as e:
        pg_db.rollback()
        print(f"Migration Failed: {e}")
        sys.exit(1)
    finally:
        sqlite_db.close()
        pg_db.close()


if __name__ == "__main__":
    migrate()
```

Run the script from PowerShell:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" migrate_sqlite_to_neon.py
```

---

## Step 6: Verify Row Counts & Schema Concordance

Verify that the row counts in Neon match the source SQLite counts exactly:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" -c "
from app.db.session import engine
from sqlalchemy import text

tables = ['users', 'profiles', 'projects', 'skills', 'educations', 'experiences', 'certificates', 'contact_infos', 'social_links', 'messages', 'metrics']

with engine.connect() as conn:
    print('=== Neon Database Record Counts ===')
    total = 0
    for t in tables:
        count = conn.execute(text(f'SELECT count(*) FROM {t};')).fetchone()[0]
        total += count
        print(f'  {t:15}: {count} rows')
    print(f'Total Migrated Records: {total}')
"
```

Expected output:
```text
=== Neon Database Record Counts ===
  users          : 2 rows
  profiles       : 1 rows
  projects       : 4 rows
  skills         : 7 rows
  educations     : 2 rows
  experiences    : 2 rows
  certificates   : 3 rows
  contact_infos  : 1 rows
  social_links   : 3 rows
  messages       : 3 rows
  metrics        : 0 rows
Total Migrated Records: 23
```

---

## Step 7: Verify Relationships, Sequence Counters & Constraints

Confirm that inserting a new row after migration assigns an `id` greater than existing records:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" -c "
from app.db.session import SessionLocal
from app.models.skill import Skill

db = SessionLocal()
try:
    test_skill = Skill(name='Neon Verification Test', category='Database', proficiency=99, order=99)
    db.add(test_skill)
    db.commit()
    db.refresh(test_skill)
    print(f'Successfully inserted test row with ID: {test_skill.id} (Should be > 7)')
    
    # Clean up test row
    db.delete(test_skill)
    db.commit()
    print('Test row cleaned up successfully.')
finally:
    db.close()
"
```

---

## Step 8: Test API & CMS CRUD Operations

1. Start the FastAPI backend and test API health:
   ```powershell
   cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
   $env:PYTHONPATH = "."
   & "C:\Program Files\Python313\python.exe" -m uvicorn app.main:app --port 8000
   ```
2. In a separate terminal, test the public endpoints:
   ```powershell
   Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/projects"
   Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/profile"
   ```
3. Sign in to the Admin Dashboard ([http://127.0.0.1:3001](http://127.0.0.1:3001)) and perform test edits in the Education and Certificates modules.

---

## Step 9: Validate Data Integrity & Field Encoding

Verify that special Unicode characters, punctuation, and multi-line text strings are preserved without corruption:

* **Bio and Description fields:** Check for intact formatting and newline (`\n`) characters in `experiences.description` and `educations.description`.
* **JSON Array integrity:** Confirm `profiles.typed_lines` and `profiles.quick_navigation` parse cleanly with `json.loads()`.
* **Password hash validity:** Authenticate the admin account using the standard login endpoint to verify that `bcrypt` hashes remained intact.

---

## Step 10: Failover & Rollback Strategy

If an unexpected network issue or latency problem occurs with Neon PostgreSQL, you can roll back to SQLite in under 60 seconds:

### Instant Rollback Procedure:
1. Open `backend/.env`.
2. Comment out the Neon `DATABASE_URL` and uncomment the SQLite configuration:
   ```ini
   DATABASE_URL="sqlite:///./portfolio_dev.db"
   # DATABASE_URL="postgresql+psycopg2://...neon.tech..."
   ```
3. Restart the FastAPI service:
   ```powershell
   Get-Process -Name "python" | Stop-Process -Force
   & "C:\Program Files\Python313\python.exe" -m uvicorn app.main:app --port 8000 --reload
   ```
4. Verify that the application continues serving traffic from the local SQLite database.
