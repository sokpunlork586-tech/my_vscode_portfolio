from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    dashboard,
    projects,
    skills,
    messages,
    users,
    intro,
    profile,
    education,
    experience,
    certificates,
    contact,
    upload,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])
api_router.include_router(experience.router, prefix="/experience", tags=["Experience"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(intro.router, prefix="/intro", tags=["Intro / Greeter"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile & Sidebar"])
