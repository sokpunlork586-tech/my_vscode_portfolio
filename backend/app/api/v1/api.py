from fastapi import APIRouter
from app.api.v1.endpoints import auth, dashboard, projects, skills, messages, users, intro, profile

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(intro.router, prefix="/intro", tags=["Intro / Greeter"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile & Sidebar"])
