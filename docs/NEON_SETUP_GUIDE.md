# Neon Serverless PostgreSQL Setup Guide

**Document Version:** 1.0.0  
**Date:** November 7, 2026  
**Audience:** Developers, DevOps Engineers, and System Administrators  
**Platform:** Windows 10/11 & Google Antigravity IDE  

---

## Table of Contents

- [Overview](#overview)
- [Step 1: Create a Neon Account](#step-1-create-a-neon-account)
- [Step 2: Create a Neon PostgreSQL Project](#step-2-create-a-neon-postgresql-project)
- [Step 3: Obtain Database Connection Strings](#step-3-obtain-database-connection-strings)
- [Step 4: Configure Neon MCP Server in Antigravity](#step-4-configure-neon-mcp-server-in-antigravity)
- [Step 5: Configure Neon Agent Skills](#step-5-configure-neon-agent-skills)
- [Step 6: Configure Environment Variables (`DATABASE_URL`)](#step-6-configure-environment-variables-database_url)
- [Step 7: Connect FastAPI to Neon](#step-7-connect-fastapi-to-neon)
- [Step 8: Verify Database Connection](#step-8-verify-database-connection)
- [Step 9: Verify Database Tables](#step-9-verify-database-tables)
- [Step 10: Test CRUD Operations](#step-10-test-crud-operations)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Overview

This guide provides step-by-step instructions for provisioning a **Neon Serverless PostgreSQL** database and integrating it with the **FastAPI Backend** and the **Google Antigravity IDE**.

> [!CAUTION]
> **Credential Security:** Never commit `.env` files or hardcode passwords in source code. Keep your `DATABASE_URL` and `NEON_API_KEY` private and secure at all times.

---

## Step 1: Create a Neon Account

1. Open your web browser and navigate to the Neon Console: [https://console.neon.tech/signup](https://console.neon.tech/signup)
2. Sign up using **GitHub**, **Google**, or your email address.
3. Confirm your email address if signing up via email to activate the account.

---

## Step 2: Create a Neon PostgreSQL Project

1. In the Neon Console, click **"New Project"**.
2. Configure the project parameters:
   * **Project Name:** `portfolio-cms` (or your preferred identifier).
   * **Postgres Version:** Select `PostgreSQL 16` (fully compatible with SQLAlchemy 2.0 and `psycopg2`).
   * **Region:** Choose the region geographically closest to your target audience (e.g., `AWS ap-southeast-1` Singapore or `AWS us-east-2` Ohio).
3. Click **"Create Project"**.

---

## Step 3: Obtain Database Connection Strings

Once created, Neon displays the **Connection Details** modal.

1. Ensure the database name is set to `neondb` (default) or create a dedicated database named `portfolio_db`.
2. Locate the dropdown labeled **Connection String** and select **SQLAlchemy**:
   ```text
   postgresql+psycopg2://[user]:[password]@[ep-xyz].neon.tech/neondb?sslmode=require
   ```
3. Notice that Neon provides two types of endpoints:
   * **Pooled Connection (`-pooler` in hostname):** Recommended for web frameworks like FastAPI to maintain persistent PgBouncer connection reuse.
   * **Direct Connection:** Ideal for long-running batch migrations or DDL migrations.

> [!NOTE]
> Make sure `?sslmode=require` is present at the end of the connection URL. Neon enforces TLS encryption on all inbound network traffic.

---

## Step 4: Configure Neon MCP Server in Antigravity

Antigravity supports the Model Context Protocol (MCP) to give coding agents database management abilities.

### 4.1 Obtain a Neon API Key
1. In the Neon Console, click on your profile icon in the bottom-left corner.
2. Select **Account Settings** → **API Keys**.
3. Click **"Generate new API key"**, name it `antigravity-neon-mcp`, and copy the token (`neon_api_...`).

### 4.2 Update `mcp_config.json`
Open PowerShell and configure the global MCP configuration file:

```powershell
# Create config directory if not exists
New-Item -ItemType Directory -Force -Path "$HOME\.gemini\config"

# Create or overwrite mcp_config.json
$mcpConfig = @{
    mcpServers = @{
        neon = @{
            command = "npx"
            args = @(
                "-y"
                "@neondatabase/mcp-server-neon"
                "start"
                "YOUR_NEON_API_KEY_HERE"
            )
        }
    }
} | ConvertTo-Json -Depth 5

Set-Content -Path "$HOME\.gemini\config\mcp_config.json" -Value $mcpConfig
```

Replace `YOUR_NEON_API_KEY_HERE` with your generated Neon API token.

---

## Step 5: Configure Neon Agent Skills

While official marketplace plugins may not yet be available, you can add custom database operations directly to your Antigravity skills directory:

```powershell
# Verify available skills in Antigravity
Get-ChildItem "C:\Users\Data Science\.gemini\antigravity\builtin\skills"
```

Once the MCP server is configured in Step 4, Antigravity will automatically surface Neon tools (`neon_run_sql`, `neon_list_branches`, `neon_create_branch`) in your agent tool palette.

---

## Step 6: Configure Environment Variables (`DATABASE_URL`)

Update the backend configuration file located at `backend/.env`.

### 6.1 Edit `backend/.env`
Open `backend/.env` and update the `DATABASE_URL` line:

```ini
PROJECT_NAME="Portfolio Admin Backend"
API_V1_STR="/api/v1"
SECRET_KEY="dev-secret-key-super-secure-change-in-production-123456789"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Neon PostgreSQL Database Connection
DATABASE_URL="postgresql+psycopg2://alex:AbCdEf123456@ep-cool-cloud-123456-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# CORS Origins
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","http://127.0.0.1:3000","http://127.0.0.1:3001"]
```

> [!WARNING]
> Ensure the driver prefix is `postgresql+psycopg2://` and NOT bare `postgresql://` (SQLAlchemy 2.0 defaults to psycopg3 if not explicitly specified).

---

## Step 7: Connect FastAPI to Neon

FastAPI already includes `psycopg2-binary>=2.9.9` in its dependencies.

### 7.1 Verify Python Driver Installation
Run this in PowerShell to ensure the PostgreSQL binary driver is available:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
& "C:\Program Files\Python313\python.exe" -c "import psycopg2; print('psycopg2 version:', psycopg2.__version__)"
```

### 7.2 Launch FastAPI Dev Server
Start the backend server to test the connection handshake:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI will initialize its database engine in `app/db/session.py`. If successful, `Base.metadata.create_all(bind=engine)` in `lifespan` will automatically create all tables in your Neon database.

---

## Step 8: Verify Database Connection

Run a non-destructive Python test script from PowerShell to verify that the active SQLAlchemy session can execute queries against Neon:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" -c "
from app.db.session import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text('SELECT version();')).fetchone()
        print('SUCCESS: Connected to Neon!')
        print('PostgreSQL Version:', result[0])
except Exception as e:
    print('CONNECTION FAILED:', e)
"
```

Expected output:
```text
SUCCESS: Connected to Neon!
PostgreSQL Version: PostgreSQL 16.x on x86_64-pc-linux-gnu ...
```

---

## Step 9: Verify Database Tables

Confirm that all 11 application tables have been created on the Neon instance:

```powershell
cd "c:\Users\Data Science\Documents\Project Done\my_vscode_portfolio\backend"
$env:PYTHONPATH = "."
& "C:\Program Files\Python313\python.exe" -c "
from app.db.session import engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()
print(f'Total tables found: {len(tables)}')
for t in sorted(tables):
    print(f'  [TABLE] {t}')
"
```

Expected output:
```text
Total tables found: 11
  [TABLE] certificates
  [TABLE] contact_infos
  [TABLE] educations
  [TABLE] experiences
  [TABLE] messages
  [TABLE] metrics
  [TABLE] profiles
  [TABLE] projects
  [TABLE] skills
  [TABLE] social_links
  [TABLE] users
```

---

## Step 10: Test CRUD Operations

Test API communication from your local development servers:

1. Open your browser and navigate to the interactive Swagger documentation:  
   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
2. Test read-only public endpoints:
   ```powershell
   # Test Projects GET endpoint
   Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/projects" -Method GET
   
   # Test Skills GET endpoint
   Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/skills" -Method GET
   ```
3. Open the Admin Dashboard: [http://127.0.0.1:3001](http://127.0.0.1:3001)
4. Sign in and create a new project or update a profile bio. Confirm that updates persist directly in Neon PostgreSQL.

---

## Troubleshooting & FAQ

### Q1: `psycopg2.OperationalError: SSL SYSCALL error: EOF detected`
* **Cause:** Neon paused the serverless compute due to inactivity (scale-to-zero).
* **Fix:** `backend/app/db/session.py` has `pool_pre_ping=True` enabled. If running external scripts, ensure `create_engine` includes `pool_pre_ping=True` so dropped connections are refreshed automatically.

### Q2: `FATAL: password authentication failed for user`
* **Cause:** Special characters in the password are not properly URL-encoded.
* **Fix:** If your Neon password contains `#`, `@`, or `%`, URL-encode them (e.g. `@` becomes `%40`, `#` becomes `%23`).

### Q3: `no pg_hba.conf entry for host ... no encryption`
* **Cause:** The connection string is missing `sslmode=require`.
* **Fix:** Append `?sslmode=require` to the end of `DATABASE_URL`.
