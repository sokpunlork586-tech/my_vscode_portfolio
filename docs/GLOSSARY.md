# Technical Glossary & Architectural Terminology

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** Master Reference of Software Engineering, SRE & Cloud Terms  
**Date:** November 7, 2026  

---

## Master Alphabetical Terminology

### A
* **ASGI (Asynchronous Server Gateway Interface):** The modern Python standard interface between async-capable web servers and Python web applications, used by Uvicorn and FastAPI.
* **Authentication (AuthN):** The mechanism of validating an identity (e.g., verifying email and bcrypt-hashed password).
* **Authorization (AuthZ):** The mechanism of determining whether an authenticated entity has permission to perform an action (e.g. RBAC).

### B
* **Bcrypt:** A password hashing function based on the Blowfish cipher that incorporates dynamic salts and an adjustable work factor cost to resist rainbow tables and brute-force attacks.
* **Breakpoint:** CSS media query screen width thresholds (e.g. `sm: 640px`, `md: 768px`, `lg: 1024px`) used to adapt responsive user interfaces.

### C
* **CORS (Cross-Origin Resource Sharing):** A browser security protocol that restricts HTTP requests initiated from scripts outside the origin domain.
* **CRUD (Create, Read, Update, Delete):** The four foundational storage functions for persistent database records.
* **CSR (Client-Side Rendering):** Rendering web interface components directly in the browser's DOM using JavaScript.

### D
* **DDL (Data Definition Language):** SQL statements that define database schema structures, tables, and indexes (e.g. `CREATE TABLE`, `ALTER TABLE`).
* **Deterministic Hydration:** Ensuring that server-side generated HTML and client-side hydrated DOM produce identical class names and component trees on initial load.
* **DJB2 / FNV Hashing:** Fast non-cryptographic string hashing algorithms utilized in this project to generate deterministic JSS style class identifiers from style rule bodies.

### E
* **ETL (Extract, Transform, Load):** A data pipeline process that extracts records from a source database (e.g. SQLite), transforms schemas/types, and loads them into a target database (e.g. Neon PostgreSQL).

### F
* **FastAPI:** A modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints and Pydantic.

### H
* **HS256:** HMAC with SHA-256, a symmetric cryptographic algorithm used for signing JSON Web Tokens with a shared secret key.
* **Hydration:** The React process where client-side JavaScript attaches event listeners and state to the server-rendered HTML markup.

### I
* **ISR (Incremental Static Regeneration):** Next.js architecture allowing static pages to be updated in the background without rebuilding the entire application.

### J
* **JSS (JavaScript Style Sheets):** A CSS-in-JS library that allows styling components using JavaScript objects with dynamic theme token injection.
* **JWT (JSON Web Token):** An open standard (RFC 7519) that defines a compact, URL-safe means for securely transmitting claims between parties as a JSON object.

### M
* **MCP (Model Context Protocol):** An open standard created to connect AI models with external tools, APIs, and databases (e.g. `@neondatabase/mcp-server-neon`).
* **Monorepo:** A software development strategy where code for multiple distinct applications (frontend, admin dashboard, backend) lives in a single repository.

### N
* **Neon PostgreSQL:** A serverless, cloud-native PostgreSQL service that separates compute from storage, enabling instant branching and automatic scale-to-zero.

### O
* **OpenAPI (Swagger):** A specification for machine-readable interface files for describing, producing, consuming, and visualizing RESTful web services.
* **ORM (Object-Relational Mapping):** A programming technique for converting data between incompatible type systems using object-oriented paradigms (e.g. SQLAlchemy).

### P
* **PgBouncer:** A lightweight, high-performance connection pooler for PostgreSQL that minimizes the memory and CPU overhead of concurrent connections.
* **PITR (Point-in-Time Recovery):** The ability to restore a database to its exact state at any specific microsecond in the past.
* **Pydantic:** A data validation and parsing library for Python utilizing standard Python type annotations.

### R
* **RBAC (Role-Based Access Control):** An access control mechanism that assigns permissions based on user roles (`admin`, `editor`, `viewer`).
* **RPO (Recovery Point Objective):** The maximum targeted period in which data might be lost from an IT service due to a major incident.
* **RTO (Recovery Time Objective):** The targeted duration within which a business process or system must be restored after a disaster.

### S
* **Scale-to-Zero:** A serverless feature where cloud compute instances automatically suspend when idle, reducing operational costs.
* **SoC (Separation of Concerns):** A design principle for separating a computer program into distinct sections, such that each section addresses a separate concern.
* **SQLAlchemy:** The Python SQL toolkit and Object Relational Mapper that provides full enterprise-level persistence patterns.
* **SSR (Server-Side Rendering):** The ability of an application to contribute by rendering the initial HTML markup on the web server before shipping to the client.

### U
* **Uvicorn:** A lightning-fast ASGI server implementation for Python, built on `uvloop` and `httptools`.

### V
* **VACUUM:** A PostgreSQL/SQLite maintenance command that reclaims storage occupied by dead tuples and reorganizes fragmented database files.

### W
* **WAL (Write-Ahead Logging):** A standard database technique where modifications are written to a sequential append-only log before being applied to database pages.
