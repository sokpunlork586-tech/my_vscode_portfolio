import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

ADMIN_EMAIL = "admin@portfolio.com"
ADMIN_PASSWORD = "Admin1234!"


@pytest.fixture(scope="module")
def admin_token():
    res = client.post(
        "/api/v1/auth/login",
        data={"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json().get("access_token")
    assert token, "Token not found in login response"
    return token


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


def test_public_get_endpoints():
    endpoints = [
        "/api/v1/education",
        "/api/v1/experience",
        "/api/v1/certificates",
        "/api/v1/skills",
        "/api/v1/contact",
        "/api/v1/contact/socials",
        "/api/v1/projects",
        "/api/v1/intro",
    ]
    for ep in endpoints:
        res = client.get(ep)
        assert res.status_code == 200, f"GET {ep} failed: {res.status_code} {res.text}"


def test_dashboard_stats(auth_headers):
    res = client.get("/api/v1/dashboard/stats", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_projects" in data
    assert "total_skills" in data
    assert "total_messages" in data


def test_education_crud(auth_headers):
    # 1. Create
    payload = {
        "institution": "Test Academy of Technology",
        "degree": "B.S. Software Systems",
        "field_of_study": "Computer Science",
        "start_date": "2020",
        "end_date": "2024",
        "grade": "4.0 GPA",
        "description": "High performance computing and algorithms",
        "url": "https://example.com/test-academy",
        "order": 99,
    }
    create_res = client.post("/api/v1/education", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    item = create_res.json()
    item_id = item["id"]
    assert item["institution"] == payload["institution"]

    # 2. Update
    update_res = client.put(
        f"/api/v1/education/{item_id}",
        json={"institution": "Updated Academy of Tech"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["institution"] == "Updated Academy of Tech"

    # 3. Delete
    delete_res = client.delete(f"/api/v1/education/{item_id}", headers=auth_headers)
    assert delete_res.status_code == 204


def test_experience_crud(auth_headers):
    # 1. Create
    payload = {
        "company": "Test Innovators Inc",
        "position": "Lead Architecture Engineer",
        "location": "Phnom Penh / Remote",
        "employment_type": "Full-Time",
        "start_date": "2024",
        "end_date": "Present",
        "is_current": True,
        "description": "Engineered distributed backends and scalable microservices.",
        "technologies": "FastAPI, PostgreSQL, Redis, Next.js",
        "company_url": "https://example.com/test-innovators",
        "order": 99,
    }
    create_res = client.post("/api/v1/experience", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    item = create_res.json()
    item_id = item["id"]
    assert item["position"] == payload["position"]

    # 2. Update
    update_res = client.put(
        f"/api/v1/experience/{item_id}",
        json={"position": "Principal Full-Stack Engineer"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["position"] == "Principal Full-Stack Engineer"

    # 3. Delete
    delete_res = client.delete(f"/api/v1/experience/{item_id}", headers=auth_headers)
    assert delete_res.status_code == 204


def test_certificates_crud(auth_headers):
    # 1. Create
    payload = {
        "title": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "issue_date": "2024",
        "credential_id": "AWS-ARCH-99881",
        "credential_url": "https://aws.amazon.com",
        "description": "Cloud architecture and system design",
        "order": 99,
    }
    create_res = client.post("/api/v1/certificates", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    item = create_res.json()
    item_id = item["id"]
    assert item["title"] == payload["title"]

    # 2. Update
    update_res = client.put(
        f"/api/v1/certificates/{item_id}",
        json={"title": "AWS Certified Solutions Architect - Professional"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert "Professional" in update_res.json()["title"]

    # 3. Delete
    delete_res = client.delete(f"/api/v1/certificates/{item_id}", headers=auth_headers)
    assert delete_res.status_code == 204


def test_contact_and_socials(auth_headers):
    # 1. Update contact info
    update_res = client.put(
        "/api/v1/contact",
        json={
            "developer_name": "Punlork",
            "professional_title": "Senior Full-Stack Engineer",
            "availability_status": "Open to Opportunities",
        },
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["professional_title"] == "Senior Full-Stack Engineer"

    # 2. Create social link
    social_res = client.post(
        "/api/v1/contact/socials",
        json={
            "platform": "Twitter / X",
            "url": "https://twitter.com/example",
            "icon": "faTwitter",
            "username": "@example",
            "order": 5,
            "is_visible": True,
        },
        headers=auth_headers,
    )
    assert social_res.status_code == 201
    soc = social_res.json()
    soc_id = soc["id"]

    # 3. Delete social link
    del_res = client.delete(f"/api/v1/contact/socials/{soc_id}", headers=auth_headers)
    assert del_res.status_code == 204


def test_upload_endpoint(auth_headers):
    file_content = b"fake-png-image-content-for-test"
    files = {"file": ("test_icon.png", file_content, "image/png")}
    res = client.post("/api/v1/upload", files=files, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "url" in data
    assert data["url"].startswith("/uploads/")

