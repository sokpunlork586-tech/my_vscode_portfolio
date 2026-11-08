# Installation & Local Setup Guide

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Step-by-Step Setup Guide across Native OS and Docker Containers  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Quick Start (TL;DR)](#1-quick-start-tldr)
- [2. Prerequisites Verification](#2-prerequisites-verification)
- [3. Repository Clone & Setup](#3-repository-clone--setup)
- [4. Backend Installation (FastAPI)](#4-backend-installation-fastapi)
- [5. Frontend Installation (Portfolio)](#5-frontend-installation-portfolio)
- [6. Admin Dashboard Installation (CMS)](#6-admin-dashboard-installation-cms)
- [7. Running All Services Simultaneously](#7-running-all-services-simultaneously)
- [8. Docker Compose Setup (Alternative)](#8-docker-compose-setup-alternative)
- [9. Post-Installation Verification Checklist](#9-post-installation-verification-checklist)
- [10. Common Installation Issues](#10-common-installation-issues)
- [11. Universal Reusability Notes](#11-universal-reusability-notes)

---

## 1. Quick Start (TL;DR)

```powershell
# 1. Clone the project
git clone https://github.com/sokpunlork586-tech/my_vscode_portfolio.git
cd my_vscode_portfolio

# 2. Setup Backend & start API (:8000)
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:PYTHONPATH="."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 3. Setup Frontend (:3000) - in new terminal
cd ..\frontend
npm install
npm run dev

# 4. Setup Admin Dashboard (:3001) - in new terminal
cd ..\admin-dashboard
npm install
npm run dev
```

---

## 2. Prerequisites Verification

Ensure your machine meets the minimum versions outlined in [REQUIREMENTS.md](file:///c:/Users/Data%20Science/Documents/Project%20Done/my_vscode_portfolio/docs/REQUIREMENTS.md):

```bash
# Verify Node.js (>= 18.18.0) and npm (>= 9.0.0)
node -v
npm -v

# Verify Python (>= 3.10.0)
python --version   # Windows
python3 --version  # Linux / macOS
```

---

## 3. Repository Clone & Setup

```bash
git clone https://github.com/sokpunlork586-tech/my_vscode_portfolio.git
cd my_vscode_portfolio
```

Initialize root environment configuration:
```powershell
# Windows PowerShell
Copy-Item .env.example .env
```
```bash
# Linux / macOS
cp .env.example .env
```

---

## 4. Backend Installation (FastAPI)

Navigate to the `backend/` directory:

```bash
cd backend
```

### 4.1 Create Python Virtual Environment
```powershell
# Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 4.2 Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4.3 Configure Backend Environment (`backend/.env`)
Ensure `backend/.env` exists and contains:
```ini
PROJECT_NAME="Portfolio Admin Backend"
API_V1_STR="/api/v1"
SECRET_KEY="dev-secret-key-super-secure-change-in-production-123456789"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database Configuration (Default to local SQLite for instant local dev)
DATABASE_URL="sqlite:///./portfolio_dev.db"

# CORS Origins
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","http://127.0.0.1:3000","http://127.0.0.1:3001"]
```

### 4.4 Start the FastAPI Server
```powershell
# Windows PowerShell
$env:PYTHONPATH="."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
```bash
# Linux / macOS
PYTHONPATH=. uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* API Root: `http://127.0.0.1:8000/`
* Swagger UI: `http://127.0.0.1:8000/docs`

---

## 5. Frontend Installation (Portfolio)

Open a new terminal session and navigate to `frontend/`:

```bash
cd frontend
npm install
```

### 5.1 Start Frontend Dev Server
```bash
npm run dev
```
* Dev Server running at: `http://127.0.0.1:3000`

---

## 6. Admin Dashboard Installation (CMS)

Open a third terminal session and navigate to `admin-dashboard/`:

```bash
cd admin-dashboard
npm install
```

### 6.1 Configure Admin Environment (`admin-dashboard/.env.local`)
Create or verify `admin-dashboard/.env.local`:
```ini
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 6.2 Start Admin Dev Server
```bash
npm run dev
```
* Admin CMS running at: `http://127.0.0.1:3001`
* Sign in with your configured admin credentials.

---

## 7. Running All Services Simultaneously

For convenience on Windows, you can start all three applications simultaneously using a PowerShell runner script:

```powershell
# In project root: run_all.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; $env:PYTHONPATH='.'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd admin-dashboard; npm run dev"
```

---

## 8. Docker Compose Setup (Alternative)

If you prefer running a local PostgreSQL container alongside the services, use the included Docker Compose configuration:

```bash
cd backend
docker compose up -d
```
This spins up a containerized PostgreSQL 16 database at `127.0.0.1:5432`. To connect FastAPI to this container, update `backend/.env`:
```ini
DATABASE_URL="postgresql+psycopg2://postgres:postgrespassword@localhost:5432/portfolio_db"
```

---

## 9. Post-Installation Verification Checklist

| Service | Target URL | Expected Response | Status |
| :--- | :--- | :--- | :---: |
| **Backend Health** | `http://127.0.0.1:8000/health` | `{"status": "healthy"}` | 🟢 |
| **API Swagger Docs**| `http://127.0.0.1:8000/docs` | Interactive API documentation | 🟢 |
| **Portfolio Frontend**| `http://127.0.0.1:3000` | VS Code styled interactive portfolio | 🟢 |
| **Admin Dashboard** | `http://127.0.0.1:3001` | VS Code styled Admin Workbench | 🟢 |

---

## 10. Common Installation Issues

### Issue 1: `ModuleNotFoundError: No module named 'app'`
* **Cause:** Python cannot resolve the application root package.
* **Fix:** Set `$env:PYTHONPATH="."` (PowerShell) or `export PYTHONPATH=.` (Bash) inside the `backend` directory before starting uvicorn.

### Issue 2: `Error: Cannot find module './xxx.js'` in Next.js
* **Cause:** Stale `.next` build cache after an interrupted process.
* **Fix:** Run `npm run clean` in either `frontend` or `admin-dashboard` to purge `.next`, then rerun `npm run dev`.

---

## 11. Universal Reusability Notes

To adapt this installation guide for any project:
1. Update Section 4 to reflect your backend framework (e.g. Django, Spring Boot, Express, NestJS, Go Fiber).
2. Update Section 5 & 6 if you use a single frontend or monorepo workspace tool (e.g. Turborepo, Nx).
3. Preserve the multi-terminal runner script pattern and verification checklist.
