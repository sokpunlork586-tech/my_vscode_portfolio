# Testing Strategy & Quality Assurance Guide

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Test-Driven Development, Continuous Verification & Snapshot Testing  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Testing Strategy & Test Pyramid](#1-testing-strategy--test-pyramid)
- [2. Frontend Unit & Snapshot Testing (Jest)](#2-frontend-unit--snapshot-testing-jest)
- [3. Backend API & Integration Testing (Pytest)](#3-backend-api--integration-testing-pytest)
- [4. Static Analysis & Type Checking](#4-static-analysis--type-checking)
- [5. Test Automation in CI Pipelines](#5-test-automation-in-ci-pipelines)
- [6. Troubleshooting Common Test Failures](#6-troubleshooting-common-test-failures)
- [7. Verification Checklist](#7-verification-checklist)
- [8. Universal Reusability Notes](#8-universal-reusability-notes)

---

## 1. Testing Strategy & Test Pyramid

The platform maintains an automated test suite across both frontend presentation and backend API layers:

```mermaid
pyramid
    title Test Automation Pyramid
    "End-to-End Testing (Manual / Browser Validation)" : 10
    "Integration Testing (Pytest TestClient & DB Fixtures)" : 30
    "Unit & Snapshot Testing (Jest + React Testing Library)" : 60
```

* **Frontend Unit & Snapshot Tests:** Validates UI component rendering, theme injection, tab closing interactions, and VS Code terminal tabs.
* **Backend API Integration Tests:** Validates JWT authorization, Pydantic data validation, and CRUD responses against the database.
* **Type Safety Gates:** TypeScript compiler checks (`tsc --noEmit`) ensure zero type errors before bundling.

---

## 2. Frontend Unit & Snapshot Testing (Jest)

The `frontend` application utilizes **Jest** with **React Testing Library** and `@testing-library/jest-dom`.

### 2.1 Existing Test Suites (10 Suites, 13 Tests, 8 Snapshots)
Located in `frontend/src/**/__tests__/`:

1. `Container.spec.tsx` — Layout container padding and breakpoint boundaries.
2. `ButtonLink.spec.tsx` — Hyperlink button styling and click handling.
3. `GHButton.spec.tsx` — GitHub repository call-to-action button.
4. `Greeter.spec.tsx` — Hero mainline and typewriter headline rendering.
5. `Diploma.spec.tsx` — Academic credential badge component.
6. `SidebarsAndTerminal.spec.tsx` — VS Code sidebar collapse and terminal drawer toggles.
7. `TabClose.spec.tsx` — File tab close event handling and active tab switching.
8. `ProgressBar.spec.tsx` — Skill proficiency bar rendering.
9. `MDTab.spec.tsx` — Markdown tab parser and content styling.
10. `IconLink.spec.tsx` — Social and external icon links.

### 2.2 Executing Frontend Tests

```powershell
cd frontend

# Run all test suites once
npm test -- --watchAll=false

# Run tests in interactive watch mode
npm run test:watch

# Update outdated Jest snapshots
npm run test:update
```

Expected output:
```text
PASS src/components/__tests__/Container.spec.tsx
PASS src/components/__tests__/ButtonLink.spec.tsx
PASS src/components/__tests__/GHButton.spec.tsx
PASS src/views/__tests__/Greeter.spec.tsx
PASS src/views/__tests__/Diploma.spec.tsx
PASS src/layouts/Main/__tests__/SidebarsAndTerminal.spec.tsx
PASS src/layouts/Main/__tests__/TabClose.spec.tsx
PASS src/components/__tests__/ProgressBar.spec.tsx
PASS src/components/__tests__/MDTab.spec.tsx
PASS src/components/__tests__/IconLink.spec.tsx

Test Suites: 10 passed, 10 total
Tests:       13 passed, 13 total
Snapshots:   8 passed, 8 total
Time:        ~12s
```

---

## 3. Backend API & Integration Testing (Pytest)

The `backend` application uses **Pytest** with FastAPI's `TestClient` (backed by Starlette and HTTPX).

### 3.1 Test Architecture (`backend/tests/test_api.py`)
* Fixtures automatically obtain an admin JWT access token from `/api/v1/auth/login`.
* Injects `Authorization: Bearer <token>` into protected endpoint queries.
* Tests public GET endpoints for projects, skills, education, and contact details.

### 3.2 Executing Backend Tests

```powershell
cd backend
$env:PYTHONPATH="."
python -m pytest tests/ -v
```

Expected output:
```text
============================= test session starts =============================
platform win32 -- Python 3.13.x, pytest-8.3.x
collected 7 items

tests/test_api.py::test_public_get_endpoints PASSED                      [ 14%]
tests/test_api.py::test_dashboard_stats PASSED                           [ 28%]
tests/test_api.py::test_projects_crud PASSED                             [ 42%]
tests/test_api.py::test_skills_crud PASSED                               [ 57%]
tests/test_api.py::test_education_crud PASSED                            [ 71%]
tests/test_api.py::test_unauthorized_access PASSED                       [ 85%]
tests/test_api.py::test_health_check PASSED                              [100%]
============================== 7 passed in 1.45s ==============================
```

---

## 4. Static Analysis & Type Checking

Ensure static analysis checks pass across all codebases:

```powershell
# Frontend Typecheck & Lint
cd frontend
npm run typecheck
npm run lint

# Admin Dashboard Typecheck & Lint
cd ..\admin-dashboard
npx tsc --noEmit
npm run lint
```

---

## 5. Test Automation in CI Pipelines

Automated testing is configured to execute on every GitHub pull request:

```yaml
# Sample GitHub Actions Job
- name: Run Frontend Tests
  run: |
    cd frontend
    npm ci
    npm test -- --watchAll=false

- name: Run Backend Tests
  run: |
    cd backend
    pip install -r requirements.txt
    python -m pytest tests/
```

---

## 6. Troubleshooting Common Test Failures

### 6.1 `Snapshot Summary: 1 snapshot failed`
* **Cause:** Intentionally altered component HTML or class name formatting.
* **Fix:** Review the diff. If the change was deliberate, update snapshots with `npm run test:update`.

### 6.2 `ModuleNotFoundError: No module named 'app'`
* **Cause:** `PYTHONPATH` was not exported prior to invoking pytest.
* **Fix:** Prepend `$env:PYTHONPATH="."` in PowerShell or `PYTHONPATH=.` in Bash.

---

## 7. Verification Checklist

Before tagging a production release:
- [ ] All 10 Jest test suites pass (13/13 tests).
- [ ] All 8 Jest snapshots match.
- [ ] Pytest test suites pass cleanly.
- [ ] Frontend and Admin TypeScript compilations exit with 0 errors.

---

## 8. Universal Reusability Notes

To adapt this testing guide for other projects:
1. Replace Section 2 with your frontend testing framework (e.g. Vitest, Cypress, Playwright).
2. Replace Section 3 with your backend testing runner (e.g. Go test, JUnit, Mocha, RSpec).
3. Preserve the testing pyramid philosophy and pre-commit verification checklist.
