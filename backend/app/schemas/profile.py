from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class NavItem(BaseModel):
    label: str
    href: str
    icon: Optional[str] = None


class ProfileData(BaseModel):
    name: str = "Punlork"
    fullName: Optional[str] = "Punlork Sok"
    role: str = "Full-Stack & Python Developer"
    status: str = "Available for projects"
    techStack: List[str] = [
        "Python",
        "FastAPI",
        "TypeScript",
        "React 18",
        "Next.js 14",
        "PostgreSQL",
        "Node.js",
        "REST APIs",
        "Git",
    ]
    quickNavigation: Optional[List[NavItem]] = [
        {"label": "Software Engineering", "href": "/swe", "icon": "faGraduationCap"},
        {"label": "Business Administration", "href": "/ba", "icon": "faBriefcase"},
        {"label": "Core Skills (skills.js)", "href": "/skills", "icon": "faCodeBranch"},
        {"label": "Projects", "href": "/projects", "icon": "faFolderOpen"},
        {"label": "Contact (contact.json)", "href": "/contact", "icon": "faEnvelope"},
    ]


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    fullName: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    techStack: Optional[List[str]] = None
    quickNavigation: Optional[List[NavItem]] = None

