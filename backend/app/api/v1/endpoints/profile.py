import json
from pathlib import Path
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.user import User
from app.schemas.profile import ProfileData, ProfileUpdate

router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
PROFILE_JSON_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "json" / "profile.json"


def get_profile_data() -> dict:
    if PROFILE_JSON_PATH.exists():
        try:
            with open(PROFILE_JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read profile.json: {e}")

    # Fallback default profile
    return {
        "name": "Punlork",
        "fullName": "Punlork Sok",
        "role": "Full-Stack & Python Developer",
        "status": "Available for projects",
        "techStack": [
            "Python",
            "FastAPI",
            "TypeScript",
            "React 18",
            "Next.js 14",
            "PostgreSQL",
            "Node.js",
            "REST APIs",
            "Git",
        ],
        "quickNavigation": [
            {"label": "Software Engineering", "href": "/swe", "icon": "faGraduationCap"},
            {"label": "Business Administration", "href": "/ba", "icon": "faBriefcase"},
            {"label": "Core Skills (skills.js)", "href": "/skills", "icon": "faCodeBranch"},
            {"label": "Projects", "href": "/projects", "icon": "faFolderOpen"},
            {"label": "Contact (contact.json)", "href": "/contact", "icon": "faEnvelope"},
        ],
    }


@router.get("", response_model=ProfileData)
def read_profile() -> Any:
    return get_profile_data()


@router.put("", response_model=ProfileData)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    current = get_profile_data()

    if profile_in.name is not None:
        current["name"] = profile_in.name
    if profile_in.fullName is not None:
        current["fullName"] = profile_in.fullName
        # Sync with user model
        current_user.full_name = profile_in.fullName
        db.commit()
    if profile_in.role is not None:
        current["role"] = profile_in.role
    if profile_in.status is not None:
        current["status"] = profile_in.status
    if profile_in.techStack is not None:
        current["techStack"] = profile_in.techStack
    if profile_in.quickNavigation is not None:
        current["quickNavigation"] = [
            item.model_dump() if hasattr(item, "model_dump") else item
            for item in profile_in.quickNavigation
        ]

    try:
        PROFILE_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(PROFILE_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2, ensure_ascii=False)
            f.write("\n")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save profile.json: {e}")

    return current

