# Configuration Management & Environment Reference

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** 12-Factor App Configuration & Environment Variables  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Configuration Principles & Precedence](#1-configuration-principles--precedence)
- [2. Master Environment Variables Matrix](#2-master-environment-variables-matrix)
- [3. Backend Configuration Specification](#3-backend-configuration-specification)
- [4. Frontend & Admin Dashboard Configurations](#4-frontend--admin-dashboard-configurations)
- [5. CORS & Origin Access Policies](#5-cors--origin-access-policies)
- [6. Database Connection String Specifications](#6-database-connection-string-specifications)
- [7. Secrets Management & Rotation Guidelines](#7-secrets-management--rotation-guidelines)
- [8. Universal Reusability Notes](#8-universal-reusability-notes)

---

## 1. Configuration Principles & Precedence

The application follows the **Twelve-Factor App** methodology, strictly separating code from configuration. Settings are injected dynamically via environment variables without requiring code re-compilation.

### Configuration Loading Hierarchy:
1. **Operating System Environment Variables** (Highest precedence - e.g., Docker environment, system env).
2. **Local Application `.env` File** (e.g. `backend/.env`, `admin-dashboard/.env.local`).
3. **Pydantic Model Defaults** (Lowest precedence - defined in `app/core/config.py`).

---

## 2. Master Environment Variables Matrix

| Variable Name | Service | Default Value | Required? | Purpose & Description |
| :--- | :---: | :--- | :---: | :--- |
| `PROJECT_NAME` | Backend | `"Portfolio Admin Backend"` | No | Human-readable service name displayed in `/docs` and logs. |
| `API_V1_STR` | Backend | `"/api/v1"` | No | API versioning prefix path. |
| `SECRET_KEY` | Backend | `"dev-secret-key-..."` | **Yes (Prod)** | Cryptographic salt used for signing HS256 JWT tokens. |
| `ALGORITHM` | Backend | `"HS256"` | No | JWT signature algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| Backend | `1440` (24h) | No | JWT lifespan in minutes before re-authentication is required. |
| `DATABASE_URL` | Backend | `sqlite:///./portfolio_dev.db` | **Yes** | Connection string for active database engine. |
| `BACKEND_CORS_ORIGINS` | Backend | `["http://localhost:3000", ...]`| No | Allowed origins array or JSON string. |
| `NEXT_PUBLIC_API_BASE_URL` | Admin | `http://127.0.0.1:8000/api/v1` | **Yes** | Public HTTP base URL targeting FastAPI. |
| `NEXT_PUBLIC_SITE_URL` | Frontend | `http://localhost:3000` | No | Base canonical URL for social graph metadata. |

---

## 3. Backend Configuration Specification

Backend settings are parsed via `pydantic-settings` in [`backend/app/core/config.py`](file:///c:/Users/Data%20Science/Documents/Project%20Done/my_vscode_portfolio/backend/app/core/config.py):

```python
class Settings(BaseSettings):
    PROJECT_NAME: str = "Portfolio Admin Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "dev-secret-key-super-secure-change-in-production-123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    DATABASE_URL: str = "sqlite:///./portfolio_dev.db"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")
```

---

## 4. Frontend & Admin Dashboard Configurations

### 4.1 Admin CMS (`admin-dashboard/.env.local`)
```ini
# Specifies where the Next.js client-side services issue REST queries
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 4.2 Production Admin CMS (`admin-dashboard/.env.production`)
```ini
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
```

---

## 5. CORS & Origin Access Policies

FastAPI implements dynamic CORS matching via `CORSMiddleware` in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

* **Development:** Accepts requests from any port running on `localhost` or `127.0.0.1`.
* **Production:** In production, replace `allow_origin_regex` with an explicit domain whitelist:
  ```python
  allow_origins=["https://punlork.dev", "https://admin.punlork.dev"]
  ```

---

## 6. Database Connection String Specifications

### 6.1 SQLite (Local Development)
```ini
DATABASE_URL="sqlite:///./portfolio_dev.db"
```

### 6.2 Local PostgreSQL (Docker Container)
```ini
DATABASE_URL="postgresql+psycopg2://postgres:postgrespassword@localhost:5432/portfolio_db"
```

### 6.3 Neon Serverless PostgreSQL (Production)
```ini
DATABASE_URL="postgresql+psycopg2://[USER]:[PASSWORD]@[ENDPOINT_ID]-pooler.[REGION].aws.neon.tech/[DATABASE]?sslmode=require"
```

> [!IMPORTANT]
> When using Neon with SQLAlchemy, always use the prefix `postgresql+psycopg2://` and append `?sslmode=require`.

---

## 7. Secrets Management & Rotation Guidelines

1. **Never Commit Secrets:** `.gitignore` includes all `.env*` files except `.env.example`.
2. **Generating Secure Production Secrets:**
   ```powershell
   # PowerShell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
   ```
   ```bash
   # Linux / macOS
   openssl rand -hex 32
   ```
3. **Secret Rotation Procedure:**
   * Generate new `SECRET_KEY`.
   * Deploy new environment variable.
   * Note: Changing `SECRET_KEY` will invalidate existing active JWT tokens, prompting administrators to re-authenticate cleanly.

---

## 8. Universal Reusability Notes

To reuse this configuration guide:
1. Update Section 2 to add all environment variables relevant to your specific services (e.g. AWS S3 keys, Stripe keys, SendGrid tokens).
2. Adjust the CORS policy section to reflect production hostnames.
3. Keep the secret generation commands and precedence hierarchy as standard engineering policy.
