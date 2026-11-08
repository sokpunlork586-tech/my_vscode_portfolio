# Development Guide & Engineering Standards

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Full-Stack Web Development Best Practices & Workflow  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Development Philosophy](#1-development-philosophy)
- [2. Git Branching & Commit Conventions](#2-git-branching--commit-conventions)
- [3. Frontend Development Standards (Next.js 14)](#3-frontend-development-standards-nextjs-14)
- [4. Backend Development Standards (FastAPI & SQLAlchemy)](#4-backend-development-standards-fastapi--sqlalchemy)
- [5. Code Style & Quality Assurance](#5-code-style--quality-assurance)
- [6. Debugging & Hot Reloading](#6-debugging--hot-reloading)
- [7. Verification Checklist](#7-verification-checklist)
- [8. Universal Reusability Notes](#8-universal-reusability-notes)

---

## 1. Development Philosophy

1. **Deterministic Hydration:** Avoid non-deterministic values (random numbers, unseeded counters, client-dependent timestamps) during SSR rendering.
2. **Type Safety Across Tiers:** Strict TypeScript on the frontend; Pydantic models on the backend.
3. **Responsive by Default:** All user interface components must render cleanly across mobile (320px–430px), tablet (768px), and desktop (1024px+) viewports.
4. **Data Isolation:** Changes to CMS models must never break read-only public portfolio views.

---

## 2. Git Branching & Commit Conventions

### 2.1 Branching Strategy
* `main`: Production-ready release branch.
* `develop`: Integration branch for staging.
* `feature/<name>`: New capabilities (e.g. `feature/neon-migration`).
* `fix/<name>`: Bug fixes (e.g. `fix/mobile-drawer-overflow`).

### 2.2 Conventional Commits
All commits must follow the **Conventional Commits** specification:
```text
<type>(<scope>): <short description>

[optional body]
```

* `feat`: New feature or module (e.g. `feat(cms): add certificates CRUD manager`).
* `fix`: Bug resolution (e.g. `fix(frontend): make JSS class generation deterministic`).
* `docs`: Documentation updates (e.g. `docs: add universal technical documentation`).
* `style`: Code style, formatting, or newline normalization.
* `refactor`: Code refactoring without behavioral alterations.
* `test`: Adding or updating test suites.

---

## 3. Frontend Development Standards (Next.js 14)

### 3.1 App Router Principles
* Use Server Components (`React Server Components`) by default for static data retrieval.
* Mark interactive components with `"use client";` at the top of the file when using hooks (`useState`, `useEffect`, `useContext`) or browser events (`onClick`, `onChange`).

### 3.2 JSS & Deterministic Styling (`frontend/`)
To prevent hydration mismatch warnings like `Prop className did not match`, all dynamic class names in React-JSS must use deterministic content hashing:

```typescript
// frontend/src/components/JssRegistry/index.tsx
function createDeterministicGenerateId() {
  return function generateId(rule: any, sheet?: any) {
    const prefix = sheet?.options?.classNamePrefix || '';
    const styleHash = rule?.style ? hashString(safeSerialize(rule.style)) : '0';
    const cleanKey = (rule?.key || 'rule').replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${prefix ? prefix + '-' : ''}${cleanKey}-${styleHash}`;
  };
}
```

### 3.3 Responsive Tailwind Patterns (`admin-dashboard/`)
* Modals: Always combine `max-h-[90vh] flex flex-col` on the outer card with `overflow-y-auto flex-1` on the form body.
* Grid forms: Use `grid grid-cols-1 sm:grid-cols-2 gap-3.5` so inputs stack comfortably on narrow mobile screens.

---

## 4. Backend Development Standards (FastAPI & SQLAlchemy)

### 4.1 Creating a New API Endpoint
1. **Define SQLAlchemy Model:** Add table schema in `backend/app/models/<entity>.py`.
2. **Register in Base:** Ensure model is imported in `backend/app/models/__init__.py`.
3. **Create Pydantic Schemas:** Create Create, Update, and Response schemas in `backend/app/schemas/<entity>.py`.
4. **Create Endpoint Controller:** Add router in `backend/app/api/v1/endpoints/<entity>.py`.
5. **Register Router in API Gateway:** Include router in `backend/app/api/v1/api.py`.

### 4.2 Safe Database Dependency
Always inject database sessions using FastAPI's dependency system:
```python
@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.order.asc()).all()
```

---

## 5. Code Style & Quality Assurance

### 5.1 Frontend Verification Commands
```powershell
cd frontend
npm run typecheck   # Typecheck without emitting JS (tsc --noEmit)
npm run lint        # Next.js ESLint validation
npm test            # Run Jest test suites
```

### 5.2 Admin Dashboard Verification Commands
```powershell
cd admin-dashboard
npx tsc --noEmit    # TypeScript typechecking
npm run lint        # Next.js ESLint validation
```

### 5.3 Backend Verification Commands
```powershell
cd backend
$env:PYTHONPATH="."
python -m pytest tests/
```

---

## 6. Debugging & Hot Reloading

### 6.1 Fast Cache Purging
If Next.js encounters a corrupted chunk or missing module in `.next`, run:
```powershell
# In either frontend/ or admin-dashboard/
npm run clean
npm run dev
```

### 6.2 Interactive API Docs
Use the built-in Swagger UI at `http://127.0.0.1:8000/docs` to test endpoints, inspect schemas, and verify authorization tokens in real-time.

---

## 7. Verification Checklist

Before submitting a Pull Request:
- [ ] TypeScript compiles cleanly (`tsc --noEmit` exits with 0).
- [ ] No hydration mismatch warnings in the browser console.
- [ ] Jest and Pytest suites pass completely.
- [ ] No hardcoded passwords, tokens, or personal secrets committed.
- [ ] Conventional commit message format followed.

---

## 8. Universal Reusability Notes

To reuse this guide:
1. Update Section 3 and 4 with the specific frontend framework (e.g. Vue, Svelte, Angular) and backend framework (e.g. NestJS, Django, Spring).
2. Maintain the Git Branching & Conventional Commits standards as standard organizational policy.
