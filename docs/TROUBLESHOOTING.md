# Troubleshooting & Issue Resolution Handbook

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Failure Diagnosis, Runtime Recovery & Incident Playbooks  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Diagnostic Methodology](#1-diagnostic-methodology)
- [2. Frontend Hydration & Rendering Issues](#2-frontend-hydration--rendering-issues)
- [3. Next.js Build Cache & EPERM Errors](#3-nextjs-build-cache--eperm-errors)
- [4. Backend Runtime & Python Module Errors](#4-backend-runtime--python-module-errors)
- [5. Database Handshake & Connection Errors](#5-database-handshake--connection-errors)
- [6. Port Conflicts & Process Management](#6-port-conflicts--process-management)
- [7. Git & Filesystem Permissions (Windows)](#7-git--filesystem-permissions-windows)
- [8. Rapid Diagnostic Command Cheatsheet](#8-rapid-diagnostic-command-cheatsheet)
- [9. Universal Reusability Notes](#9-universal-reusability-notes)

---

## 1. Diagnostic Methodology

When troubleshooting an unexpected behavior, investigate in sequence:
1. **Browser Console & Network Tab (`F12`):** Inspect HTTP request URLs, response status codes, and JavaScript runtime errors.
2. **Terminal Logs:** Review active Uvicorn and Next.js development server output.
3. **Database Connectivity:** Verify that the database file exists or the cloud endpoint is reachable.

---

## 2. Frontend Hydration & Rendering Issues

### 2.1 `Warning: Prop className did not match. Server: "heading-96" Client: "heading-74"`
* **Root Cause:** A non-deterministic global integer counter was used in `createDeterministicGenerateId()` in React-JSS. Multiple server streaming passes incremented the counter out of sync with client-side hydration.
* **Resolution:** Replaced the sequential counter with a deterministic content-based DJB2 hash in `frontend/src/components/JssRegistry/index.tsx`:
  ```typescript
  const styleHash = rule?.style ? hashString(safeSerialize(rule.style)) : '0';
  const cleanKey = (rule?.key || 'rule').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${prefix ? prefix + '-' : ''}${cleanKey}-${styleHash}`;
  ```

### 2.2 Horizontal Scrollbar Jitter on Windows (100vw vs 100%)
* **Root Cause:** Windows browsers include the vertical scrollbar gutter in `100vw` calculations, creating a 15–17px horizontal overflow.
* **Resolution:** Replaced all occurrences of `width: 100vw` with `width: 100%` and `max-w-full` in `StatusBar/styles.ts` and `DashboardLayout.tsx`.

---

## 3. Next.js Build Cache & EPERM Errors

### 3.1 `Error: Cannot find module './381.js'` or `lucide-react.js ENOENT`
* **Root Cause:** Next.js build cache in `.next` was corrupted when a previous development server was killed abruptly.
* **Resolution:** Purge `.next` cache and restart:
  ```powershell
  npm run clean
  npm run dev
  ```
  *(Note: A `predev` lifecycle hook has been configured in `package.json` to automatically clean `.next` if necessary).*

### 3.2 `Error: EPERM: operation not permitted, mkdir '.next\server...'`
* **Root Cause:** Transient Windows file lock by an active Node.js worker or terminal sandbox process.
* **Resolution:** Stop all node processes and restart:
  ```powershell
  Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
  npm run dev
  ```

---

## 4. Backend Runtime & Python Module Errors

### 4.1 `ModuleNotFoundError: No module named 'app'`
* **Root Cause:** Python is executing from the repository root without the `backend/` directory in its package path.
* **Resolution:** Set `PYTHONPATH` explicitly before running Uvicorn:
  ```powershell
  # Windows PowerShell
  cd backend
  $env:PYTHONPATH="."
  python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
  ```
  ```bash
  # Linux / macOS
  cd backend
  PYTHONPATH=. uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
  ```

### 4.2 `CORS error: Origin http://localhost:3000 not allowed`
* **Root Cause:** Request originated from a hostname not matched by the CORS regex.
* **Resolution:** Verify `BACKEND_CORS_ORIGINS` in `backend/.env` or check `allow_origin_regex` in `backend/app/main.py`.

---

## 5. Database Handshake & Connection Errors

### 5.1 `psycopg2.OperationalError: SSL SYSCALL error: EOF detected` (Neon)
* **Root Cause:** Neon's serverless compute suspended after an idle period (scale-to-zero).
* **Resolution:** Ensure `pool_pre_ping=True` is enabled in `backend/app/db/session.py`. This ensures SQLAlchemy emits a test ping and automatically establishes a fresh connection upon serverless wake-up.

### 5.2 `FATAL: password authentication failed for user`
* **Root Cause:** Special characters in database passwords (`#`, `@`, `%`) not URL-encoded.
* **Resolution:** URL-encode the password in `DATABASE_URL` (e.g. replace `@` with `%40`, `#` with `%23`).

---

## 6. Port Conflicts & Process Management

If a port (`3000`, `3001`, or `8000`) is already bound by a zombie process:

### Windows PowerShell:
```powershell
# Identify process listening on port 8000
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess, State

# Terminate process by PID
Stop-Process -Id <PID> -Force
```

### Linux / macOS:
```bash
# Identify and terminate process on port 8000
lsof -i :8000
kill -9 <PID>
```

---

## 7. Git & Filesystem Permissions (Windows)

### `fatal: Unable to create '.git/index.lock': Permission denied`
* **Root Cause:** A background git extension or terminal sandbox lock prevented writing to `.git/index.lock`.
* **Resolution:**
  ```powershell
  # Remove stale lock if present
  Remove-Item ".git\index.lock" -Force -ErrorAction SilentlyContinue
  ```

---

## 8. Rapid Diagnostic Command Cheatsheet

```powershell
# 1. Check API Health
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health"

# 2. Check Database Row Counts
cd backend; $env:PYTHONPATH="."; python -c "from app.db.session import engine; from sqlalchemy import inspect; print(inspect(engine).get_table_names())"

# 3. Clean Next.js Caches
cd frontend; npm run clean; cd ..\admin-dashboard; npm run clean
```

---

## 9. Universal Reusability Notes

To reuse this troubleshooting handbook:
1. Preserve Section 1 (Diagnostic Methodology) and Section 6 (Port Conflicts) as universal standards.
2. Add project-specific issue signatures as bugs are diagnosed and resolved during development.
