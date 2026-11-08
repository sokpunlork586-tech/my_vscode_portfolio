# RESTful API Specification & Developer Reference

**Document Version:** 2.0.0  
**Applied Project:** Portfolio CMS & VS Code Web Platform (`my_vscode_portfolio`)  
**Universal Standard:** OpenAPI 3.0 / REST API Architecture  
**Date:** November 7, 2026  

---

## Table of Contents

- [1. Overview & Base URLs](#1-overview--base-urls)
- [2. Authentication & Request Headers](#2-authentication--request-headers)
- [3. Error Response Format & Status Codes](#3-error-response-format--status-codes)
- [4. Complete Endpoint Catalog](#4-complete-endpoint-catalog)
  - [4.1 Authentication Service](#41-authentication-service)
  - [4.2 Projects Management](#42-projects-management)
  - [4.3 Skills & Proficiencies](#43-skills--proficiencies)
  - [4.4 Education & Academics](#44-education--academics)
  - [4.5 Work Experience](#45-work-experience)
  - [4.6 Certificates & Credentials](#46-certificates--credentials)
  - [4.7 Contact Info & Social Links](#47-contact-info--social-links)
  - [4.8 Profile & Greeter Bio](#48-profile--greeter-bio)
  - [4.9 Contact Inquiries (Messages)](#49-contact-inquiries-messages)
  - [4.10 Dashboard & Analytics Telemetry](#410-dashboard--analytics-telemetry)
  - [4.11 File Upload Service](#411-file-upload-service)
- [5. Interactive API Testing (Swagger & ReDoc)](#5-interactive-api-testing-swagger--redoc)
- [6. Universal Reusability Notes](#6-universal-reusability-notes)

---

## 1. Overview & Base URLs

The platform exposes an asynchronous RESTful API under the `/api/v1` namespace:

* **Local Base URL:** `http://127.0.0.1:8000/api/v1`
* **Production Base URL:** `https://api.yourdomain.com/api/v1`
* **Documentation URLs:**
  * Swagger UI: `http://127.0.0.1:8000/docs`
  * ReDoc: `http://127.0.0.1:8000/redoc`
  * OpenAPI JSON: `http://127.0.0.1:8000/api/v1/openapi.json`

---

## 2. Authentication & Request Headers

Protected endpoints require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

---

## 3. Error Response Format & Status Codes

All errors return a structured JSON response:

```json
{
  "detail": "Descriptive error message"
}
```

| HTTP Status | Meaning | Scenario |
| :---: | :--- | :--- |
| `200 OK` | Success | Successful GET, PUT, or DELETE request |
| `201 Created` | Resource Created | Successful POST creation |
| `400 Bad Request` | Invalid Input | Validation or business constraint violation |
| `401 Unauthorized` | Missing / Invalid Token | Missing, invalid, or expired JWT |
| `403 Forbidden` | Access Denied | Insufficient role permissions |
| `404 Not Found` | Entity Missing | Target ID or slug does not exist |
| `422 Unprocessable`| Pydantic Schema Error | Payload fails data type validation |
| `500 Server Error` | Unhandled Error | Database exception or server panic |

---

## 4. Complete Endpoint Catalog

### 4.1 Authentication Service

#### `POST /auth/login`
Authenticates a user and issues an access token.

* **Request (Form Data / URL Encoded):**
  ```text
  username=admin@portfolio.com&password=YourPassword123!
  ```
* **Response `200 OK`:**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "role": "admin",
    "email": "admin@portfolio.com"
  }
  ```

#### `GET /auth/me`
Retrieves the currently authenticated user's profile.
* **Headers:** `Authorization: Bearer <token>`
* **Response `200 OK`:**
  ```json
  {
    "id": 1,
    "email": "admin@portfolio.com",
    "full_name": "Portfolio Administrator",
    "role": "admin",
    "is_active": true
  }
  ```

---

### 4.2 Projects Management

#### `GET /projects`
Public endpoint returning all portfolio projects ordered by `order ASC`.
* **Response `200 OK`:**
  ```json
  [
    {
      "id": 1,
      "title": "Developer Portfolio VS Code Style",
      "slug": "vscode-portfolio",
      "description": "Interactive developer portfolio modeled after VS Code editor...",
      "category": "Web App",
      "tags": "Next.js,TypeScript,React-JSS,Tailwind",
      "demo_url": "http://localhost:3000",
      "github_url": "https://github.com/example/vscode-portfolio",
      "image_url": "/projects/vscode-portfolio.png",
      "is_featured": true,
      "order": 1
    }
  ]
  ```

#### `POST /projects` (Protected: Admin/Editor)
Creates a new project record.
* **Headers:** `Authorization: Bearer <token>`
* **Request JSON:**
  ```json
  {
    "title": "Autonomous AI Agent",
    "slug": "autonomous-ai-agent",
    "description": "Multi-agent coding framework.",
    "category": "AI / ML",
    "tags": "Python,FastAPI,Docker",
    "demo_url": "https://demo.example.com",
    "github_url": "https://github.com/example/agent",
    "image_url": "/uploads/agent.png",
    "is_featured": true,
    "order": 4
  }
  ```
* **Response `201 Created`:** Created project object with auto-assigned `id`.

#### `PUT /projects/{id}` (Protected)
Updates an existing project record by ID.

#### `DELETE /projects/{id}` (Protected)
Removes a project record by ID.

---

### 4.3 Skills & Proficiencies

* `GET /skills` — Retrieve all technical skills categorized.
* `POST /skills` (Protected) — Add skill (`name`, `category`, `proficiency: 1-100`, `order`).
* `PUT /skills/{id}` (Protected) — Update skill.
* `DELETE /skills/{id}` (Protected) — Delete skill.

---

### 4.4 Education & Academics

* `GET /education` — Retrieve academic and apprenticeship milestones.
* `POST /education` (Protected) — Add degree or program record.
* `PUT /education/{id}` (Protected) — Update education record.
* `DELETE /education/{id}` (Protected) — Delete education record.

---

### 4.5 Work Experience

* `GET /experience` — Retrieve career experience.
* `POST /experience` (Protected) — Add employment record.
* `PUT /experience/{id}` (Protected) — Update employment record.
* `DELETE /experience/{id}` (Protected) — Delete employment record.

---

### 4.6 Certificates & Credentials

* `GET /certificates` — Retrieve industry credentials and certificates.
* `POST /certificates` (Protected) — Add certificate.
* `PUT /certificates/{id}` (Protected) — Update certificate.
* `DELETE /certificates/{id}` (Protected) — Delete certificate.

---

### 4.7 Contact Info & Social Links

* `GET /contact` — Retrieve main contact coordinates (email, phone, location, availability).
* `PUT /contact` (Protected) — Update contact details.
* `GET /contact/socials` — Retrieve social and repository links.
* `POST /contact/socials` (Protected) — Add social link.
* `PUT /contact/socials/{id}` (Protected) — Update social link.
* `DELETE /contact/socials/{id}` (Protected) — Delete social link.

---

### 4.8 Profile & Greeter Bio

* `GET /profile` — Retrieve Greeter hero mainline, typewriter array, and bio.
* `PUT /profile` (Protected) — Update profile copy.
* `GET /intro` — Retrieve quick introductory summary.
* `PUT /intro` (Protected) — Update intro summary.

---

### 4.9 Contact Inquiries (Messages)

#### `POST /messages` (Public)
Allows public visitors to submit inquiries from the portfolio contact form.
* **Request JSON:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Freelance Opportunity",
    "message": "We would like to hire you for a Next.js project."
  }
  ```
* **Response `201 Created`:** `{"status": "received", "id": 4}`

#### `GET /messages` (Protected)
Allows administrators to view visitor messages with read/archived status.

---

### 4.10 Dashboard & Analytics Telemetry

* `GET /dashboard/stats` (Protected) — Returns aggregated metric counters:
  ```json
  {
    "total_projects": 4,
    "total_skills": 7,
    "total_messages": 3,
    "unread_messages": 1
  }
  ```
* `GET /dashboard/overview` (Protected) — Returns comprehensive telemetry data for the CMS dashboard.

---

### 4.11 File Upload Service

#### `POST /upload/image` (Protected: Multipart)
Uploads an image asset to `backend/uploads/`.
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
* **Response `200 OK`:**
  ```json
  {
    "url": "/uploads/filename.png"
  }
  ```

---

## 5. Interactive API Testing (Swagger & ReDoc)

FastAPI automatically parses Pydantic models into interactive Swagger documentation:
1. Start the backend: `python -m uvicorn app.main:app --port 8000`
2. Open `http://127.0.0.1:8000/docs` in your browser.
3. Click **Authorize** in the upper-right corner and input your admin credentials to test protected endpoints directly.

---

## 6. Universal Reusability Notes

To adapt this API document for any other backend:
1. Replace `/api/v1` with your API root path.
2. Update Section 4 with your service's endpoint signatures.
3. Keep the HTTP status codes, error payload schemas, and authentication header patterns as universal standards.
