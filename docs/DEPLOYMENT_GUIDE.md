# Production Deployment & Cloud Infrastructure Guide

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Cloud Hosting, Containerization, Reverse Proxy & CI/CD  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Deployment Architecture Overview](#1-deployment-architecture-overview)
- [2. Frontend & Admin Deployment (Vercel / Netlify)](#2-frontend--admin-deployment-vercel--netlify)
- [3. Backend Deployment (Docker / VPS / PaaS)](#3-backend-deployment-docker--vps--paas)
- [4. Containerization with Docker & Docker Compose](#4-containerization-with-docker--docker-compose)
- [5. Reverse Proxy & SSL Configuration (Nginx & Caddy)](#5-reverse-proxy--ssl-configuration-nginx--caddy)
- [6. Continuous Integration & Continuous Deployment (CI/CD)](#6-continuous-integration--continuous-deployment-cicd)
- [7. Zero-Downtime Rollout & Health Checks](#7-zero-downtime-rollout--health-checks)
- [8. Universal Reusability Notes](#8-universal-reusability-notes)

---

## 1. Deployment Architecture Overview

The platform uses a split-tier production deployment:

```mermaid
flowchart TD
    subgraph Global Edge Network
        DNS[Cloudflare / Custom Domain DNS]
        CDN[Vercel Edge Network]
    end

    subgraph Client Applications
        FE[Portfolio Frontend<br/>https://punlork.dev]
        ADM[Admin CMS<br/>https://admin.punlork.dev]
    end

    subgraph Cloud Container Services
        NGINX[Nginx / Caddy TLS Reverse Proxy]
        API[FastAPI Container<br/>https://api.punlork.dev]
    end

    subgraph Database Cloud
        NEON[(Neon Serverless PostgreSQL<br/>Pooled Port 5432 / 6543)]
    end

    DNS --> CDN
    CDN --> FE
    CDN --> ADM
    DNS --> NGINX
    NGINX --> API
    FE -->|Public REST API| API
    ADM -->|CMS CRUD + JWT| API
    API --> NEON
```

---

## 2. Frontend & Admin Deployment (Vercel / Netlify)

Next.js 14 App Router applications deploy natively to **Vercel**:

### 2.1 Deploying the Public Portfolio (`frontend/`)
1. In the Vercel Dashboard, import the `my_vscode_portfolio` repository.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Next.js`.
4. Configure Environment Variables:
   * `NEXT_PUBLIC_API_BASE_URL` = `https://api.yourdomain.com/api/v1`
5. Click **Deploy**.

### 2.2 Deploying the Admin Dashboard (`admin-dashboard/`)
1. Create a second project on Vercel from the same repository.
2. Set **Root Directory** to `admin-dashboard`.
3. Configure Environment Variables:
   * `NEXT_PUBLIC_API_BASE_URL` = `https://api.yourdomain.com/api/v1`
4. Click **Deploy**.

---

## 3. Backend Deployment (Docker / VPS / PaaS)

The FastAPI application can be deployed to **Railway**, **Render**, **Fly.io**, or any standard Linux VPS (Ubuntu/Debian) via Systemd.

### 3.1 Linux VPS Systemd Service (`/etc/systemd/system/portfolio-api.service`)
```ini
[Unit]
Description=Portfolio FastAPI Service
After=network.target

[Service]
User=deploy
WorkingDirectory=/var/www/my_vscode_portfolio/backend
EnvironmentFile=/var/www/my_vscode_portfolio/backend/.env
ExecStart=/var/www/my_vscode_portfolio/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-api
sudo systemctl start portfolio-api
```

---

## 4. Containerization with Docker & Docker Compose

### 4.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### 4.2 Production Docker Compose (`docker-compose.prod.yml`)
```yaml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: portfolio_backend
    restart: always
    environment:
      - DATABASE_URL=postgresql+psycopg2://user:pass@ep-xyz.neon.tech/neondb?sslmode=require
      - SECRET_KEY=your-production-secret-key-here
      - BACKEND_CORS_ORIGINS=["https://punlork.dev","https://admin.punlork.dev"]
    ports:
      - "8000:8000"
    volumes:
      - ./backend/uploads:/app/uploads
```

---

## 5. Reverse Proxy & SSL Configuration (Nginx & Caddy)

### 5.1 Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/portfolio-api`)
```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
}
```

---

## 6. Continuous Integration & Continuous Deployment (CI/CD)

Create `.github/workflows/deploy.yml` in the project root:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Test Frontend
        run: |
          cd frontend
          npm ci
          npm test -- --watchAll=false

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          python -m pytest tests/
```

---

## 7. Zero-Downtime Rollout & Health Checks

The backend exposes an automated health probe at `/health`:
* **HTTP Endpoint:** `GET /health`
* **Expected Response:** `200 OK` → `{"status": "healthy"}`
* Use this URL for uptime monitors (e.g. UptimeRobot, BetterStack) and load-balancer readiness probes.

---

## 8. Universal Reusability Notes

To adapt this deployment guide for another architecture:
1. Update Section 2 if utilizing AWS S3/CloudFront, Cloudflare Pages, or Firebase Hosting.
2. Update Section 3 for Kubernetes (EKS/GKE), ECS, or serverless functions (AWS Lambda).
3. Preserve the Dockerfile structure, reverse proxy headers, and CI/CD validation gates.
