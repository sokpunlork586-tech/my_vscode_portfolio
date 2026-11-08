# Security Architecture & Hardening Guide

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** OWASP Top 10 Security Architecture & Hardening Checklist  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Security Philosophy & Threat Model](#1-security-philosophy--threat-model)
- [2. Password Hashing & Cryptography (Bcrypt)](#2-password-hashing--cryptography-bcrypt)
- [3. Token Authentication Architecture (JWT)](#3-token-authentication-architecture-jwt)
- [4. Role-Based Access Control (RBAC)](#4-role-based-access-control-rbac)
- [5. Cross-Origin Resource Sharing (CORS) Defense](#5-cross-origin-resource-sharing-cors-defense)
- [6. Injection Attack Prevention (SQL & XSS)](#6-injection-attack-prevention-sql--xss)
- [7. File Upload Hardening](#7-file-upload-hardening)
- [8. Security Auditing & Dependency Scanning](#8-security-auditing--dependency-scanning)
- [9. Incident Response & Secret Revocation](#9-incident-response--secret-revocation)
- [10. Universal Reusability Notes](#10-universal-reusability-notes)

---

## 1. Security Philosophy & Threat Model

The platform follows a **Defense in Depth** approach:
* **Zero Trust Data Access:** No input from the client is trusted without validation via Pydantic.
* **Least Privilege:** Unauthenticated public requests can only access read-only routes (`GET /api/v1/projects`).
* **Stateless Revocable Auth:** Credentials are exchanged for short-lived cryptographically signed tokens.
* **No Secret Leakage:** Database credentials and API tokens are never written into client-accessible code bundles or git tracking.

---

## 2. Password Hashing & Cryptography (Bcrypt)

All user passwords are encrypted using **bcrypt** with work factor cost salt before persistence:

```python
# backend/app/core/security.py
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
```

* **No Plaintext Persistence:** Plaintext passwords never enter database tables or debug logs.
* **Rainbow Table Resistance:** Dynamic salts ensure identical passwords generate distinct cryptographic hashes.

---

## 3. Token Authentication Architecture (JWT)

Authenticated sessions utilize standard JSON Web Tokens:
* **Algorithm:** `HS256` (HMAC SHA-256)
* **Secret Salt:** Cryptographically strong `SECRET_KEY` (minimum 32 bytes).
* **Token Expiration:** Set via `ACCESS_TOKEN_EXPIRE_MINUTES` (defaults to 1440 minutes / 24 hours in development; recommended 60 minutes in production).

---

## 4. Role-Based Access Control (RBAC)

The `users` table enforces distinct permission tiers via `UserRole`:

```python
class UserRole(str, enum.Enum):
    ADMIN = "admin"   # Full create, read, update, delete, user management
    EDITOR = "editor" # Content edit and creation privileges
    VIEWER = "viewer" # Read-only CMS access
```

Endpoints verify roles via dependency injection:
```python
def check_admin_role(current_user: User = Depends(get_current_active_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user
```

---

## 5. Cross-Origin Resource Sharing (CORS) Defense

The FastAPI backend uses an origin regular expression validator to restrict cross-site communication:

* **Development:** Restricts access strictly to local ports on loopback IP (`127.0.0.1` and `localhost`).
* **Production:** Strict whitelist containing authorized origin domains:
  ```python
  BACKEND_CORS_ORIGINS = [
      "https://punlork.dev",
      "https://admin.punlork.dev"
  ]
  ```

---

## 6. Injection Attack Prevention (SQL & XSS)

### 6.1 SQL Injection Defense
The platform strictly uses **SQLAlchemy 2.0 ORM** parameterized queries. No raw string concatenations (`"SELECT * FROM users WHERE id = " + user_input`) are permitted.

### 6.2 Cross-Site Scripting (XSS) Defense
* **React Auto-Escaping:** Next.js and React automatically escape variables rendered within JSX templates.
* **Markdown Sanitization:** Dynamic markdown parsed via `react-markdown` uses strict component mapping to block dangerous inline script tags.

---

## 7. File Upload Hardening

Media uploads in `backend/app/api/v1/endpoints/upload.py` follow strict security boundaries:
1. **Extension Whitelisting:** Accepts only image extensions (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`).
2. **Path Traversal Protection:** Filenames are sanitized via UUIDs or strict slug checks, preventing `../` directory traversal.
3. **Execution Prevention:** The `uploads/` directory is served strictly as static assets, preventing script execution.

---

## 8. Security Auditing & Dependency Scanning

Run regular dependency audits to identify known CVE vulnerabilities:

### Node.js Audits:
```powershell
cd frontend; npm audit
cd ..\admin-dashboard; npm audit
```

### Python Audits:
```powershell
cd backend
pip install pip-audit
pip-audit
```

---

## 9. Incident Response & Secret Revocation

If credentials or secrets are compromised:
1. **Rotate `SECRET_KEY`:** Update `SECRET_KEY` in `backend/.env`. All active user sessions are instantly invalidated.
2. **Rotate Database Password:** In the Neon Console, reset the database user password and update `DATABASE_URL`.
3. **Audit Admin Accounts:** Query the `users` table to verify no unauthorized accounts were provisioned.

---

## 10. Universal Reusability Notes

To reuse this security guide:
1. Update Section 4 if utilizing OAuth2 / OIDC providers (e.g. Auth0, Google Identity, Clerk, Supabase Auth).
2. Adjust the password hashing algorithms if using Argon2id or PBKDF2.
3. Preserve the OWASP vulnerability mitigations and incident response runbook.
