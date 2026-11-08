# System Requirements & Prerequisites

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Applicable across Bare-Metal, Virtualized, and Containerized Environments  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Hardware Requirements](#1-hardware-requirements)
- [2. Operating System Compatibility](#2-operating-system-compatibility)
- [3. Runtime Environments & Tools](#3-runtime-environments--tools)
- [4. Network Ports & Firewall Rules](#4-network-ports--firewall-rules)
- [5. External Cloud Services](#5-external-cloud-services)
- [6. Development IDEs & Extensions](#6-development-ides--extensions)
- [7. Verification Checklist](#7-verification-checklist)
- [8. Universal Reusability Notes](#8-universal-reusability-notes)

---

## 1. Hardware Requirements

| Specification | Minimum (Development) | Recommended (Production / Build) |
| :--- | :--- | :--- |
| **Processor (CPU)** | 2 Cores (x86_64 or ARM64) | 4 Cores or higher |
| **Memory (RAM)** | 4 GB | 8 GB – 16 GB |
| **Disk Storage** | 5 GB available SSD storage | 20 GB available SSD storage |
| **Network** | 5 Mbps broadband connection | 100 Mbps low-latency uplink |

---

## 2. Operating System Compatibility

The codebase is engineered for cross-platform compatibility across major operating systems:

* **Microsoft Windows:** Windows 10 / Windows 11 (tested on build 26100.x with native PowerShell 5.1 & PowerShell 7+).
* **Linux:** Ubuntu 20.04+, Debian 11+, Fedora 38+, Arch Linux, Alpine Linux (container target).
* **macOS:** macOS Monterey (12.0) or later (Apple Silicon M1/M2/M3 & Intel x86_64).
* **Windows Subsystem for Linux (WSL2):** Ubuntu on WSL2 supported.

---

## 3. Runtime Environments & Tools

### 3.1 Node.js & JavaScript Runtime
* **Node.js:** `>= 18.18.0` LTS (Recommended: `v20.x` LTS or `v22.x` LTS).
* **npm:** `>= 9.0.0` (Included with Node.js) or **pnpm** `>= 8.0.0`.
* **TypeScript:** `5.6.x` (managed via project dependencies).

### 3.2 Python Runtime
* **Python:** `>= 3.10.0` (Verified on `Python 3.13.7` and `Python 3.12.x`).
* **pip:** `>= 23.0.0`.
* **C++ Compiler / Build Tools (Windows only):** Required for building native Python wheels (e.g. `psycopg2`). Alternatively, pre-compiled `psycopg2-binary` is utilized in `requirements.txt`.

### 3.3 Version Control
* **Git:** `>= 2.30.0`.

---

## 4. Network Ports & Firewall Rules

The application suite occupies three standard development ports:

| Service | Port | Protocol | Scope | Direction | Purpose |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **Portfolio Frontend** | `3000` | HTTP | Local / Public | Inbound | Next.js portfolio website |
| **Admin Dashboard** | `3001` | HTTP | Local / Private | Inbound | Next.js admin workbench |
| **FastAPI Backend** | `8000` | HTTP | Local / API | Inbound | REST API & Swagger UI |
| **Local PostgreSQL** | `5432` | TCP | Local (Docker) | Inbound | Optional local database container |
| **Neon PostgreSQL** | `5432` / `6543` | TCP / TLS | Cloud | Outbound | Neon serverless database connection |

> [!NOTE]
> Ensure local security suites or firewalls do not block loopback binding on `127.0.0.1` or ports `3000`, `3001`, and `8000`.

---

## 5. External Cloud Services

| Service | Status in Project | Purpose |
| :--- | :---: | :--- |
| **Neon Serverless PostgreSQL** | `[PENDING]` | Primary production cloud database engine (PostgreSQL 16). |
| **Vercel / Netlify** | `[OPTIONAL]` | Recommended hosting platform for Next.js frontend and admin apps. |
| **Render / Railway / Fly.io** | `[OPTIONAL]` | Recommended container hosting for the FastAPI ASGI backend. |
| **GitHub** | `[ACTIVE]` | Remote source code repository and version control. |

---

## 6. Development IDEs & Extensions

* **Google Antigravity IDE:** Fully supported with built-in terminal sandbox and agent skills.
* **Visual Studio Code:**
  * Recommended Extensions:
    * *Python* (`ms-python.python`)
    * *Pylance* (`ms-python.vscode-pylance`)
    * *ESLint* (`dbaeumer.vscode-eslint`)
    * *Tailwind CSS IntelliSense* (`bradlc.vscode-tailwindcss`)
    * *Prettier - Code Formatter* (`esbenp.prettier-vscode`)

---

## 7. Verification Checklist

Execute the following commands in your terminal to verify system readiness:

### Windows PowerShell:
```powershell
node -v          # Expected: v18.18.0 or higher
npm -v           # Expected: 9.0.0 or higher
python --version # Expected: Python 3.10.0 or higher
git --version    # Expected: git version 2.30.0 or higher
```

### Linux / macOS / Bash:
```bash
node -v
npm -v
python3 --version
git --version
```

---

## 8. Universal Reusability Notes

To reuse this requirements document:
1. Adjust the Runtime Environments section to specify your language versions (e.g. Go 1.22, Rust 1.78, OpenJDK 21).
2. Update the Port Mapping table to reflect your service port allocations.
3. Update the Hardware Requirements depending on whether your project requires GPU acceleration or high RAM for ML/AI workloads.
