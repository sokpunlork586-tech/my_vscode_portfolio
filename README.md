# Full-Stack VS Code Portfolio Workspace

A modern, full-stack developer portfolio and content management system featuring a **VS Code-themed interactive frontend**, an **Admin Dashboard**, and a high-performance **FastAPI backend**.

---

## 📁 Repository Structure

```
my_vscode_portfolio/
├── frontend/           # Interactive VS Code-styled developer portfolio (Next.js 14, React 18, TypeScript)
├── admin-dashboard/    # Administrative portal for managing projects, skills, and messages (Next.js, Tailwind CSS)
├── backend/            # REST API service (Python FastAPI, SQLAlchemy, PostgreSQL)
└── run-services.ps1    # PowerShell automation script to start backend & admin dashboard
```

---

## 🚀 Quick Start

### 1. Frontend (VS Code Developer Portfolio)
```bash
cd frontend
npm install
npm run dev
```
Available at: [http://localhost:3000](http://localhost:3000)

### 2. Backend API (FastAPI)
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```
Available at: [http://localhost:3001](http://localhost:3001)

### 4. Running Backend & Admin Services Together (Windows)
Run the helper script in PowerShell:
```powershell
.\run-services.ps1
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, React-JSS, FontAwesome
- **Admin Dashboard:** Next.js, React, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Pydantic, Passlib, JWT
- **Tooling & DevOps:** Git, Docker Compose, PowerShell

---

## 👤 Author

**Punlork Sok**  
- Website: [punlork.dev](https://punlork.dev)  
- GitHub: [@sokpunlork586-tech](https://github.com/sokpunlork586-tech)
