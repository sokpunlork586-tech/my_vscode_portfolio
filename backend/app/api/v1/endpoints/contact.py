import json
import logging
from pathlib import Path
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.contact import ContactInfo, SocialLink
from app.models.user import User
from app.schemas.contact import (
    ContactInfoResponse,
    ContactInfoUpdate,
    SocialLinkCreate,
    SocialLinkUpdate,
    SocialLinkResponse,
)

logger = logging.getLogger("contact")
router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
CONTACT_MD_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "tabs" / "contact.md"
CONTACT_JSON_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "json" / "contact.json"


def sync_contact_to_files(db: Session, contact: ContactInfo) -> None:
    try:
        socials = db.query(SocialLink).filter(SocialLink.is_visible == True).order_by(SocialLink.order.asc(), SocialLink.id.asc()).all()

        # 1. Sync contact.md
        lines = [
            "### Contact Information\n",
            "Feel free to reach out for software engineering inquiries, consulting, or full-time opportunities.\n",
            "---",
            f"- **Developer:** {contact.developer_name}",
            f"- **Role:** {contact.professional_title}",
            f"- **Location:** {contact.location} ({contact.timezone})",
            f"- **Status:** {contact.availability_status}",
            f"- **Preferred Contact:** {contact.preferred_method}",
            f"- **Response Window:** {contact.response_window}",
            f"- **GitHub:** [{contact.github_url}]({contact.github_url})",
            f"- **LinkedIn:** [{contact.linkedin_url}]({contact.linkedin_url})",
            f"- **Email:** [{contact.email}](mailto:{contact.email})",
            "",
            "---",
            "",
            "#### Contact Configuration (`contact.json`)",
            "```json",
            json.dumps(
                {
                    "developer": contact.developer_name,
                    "title": contact.professional_title,
                    "email": contact.email,
                    "github": contact.github_url,
                    "preferredMethod": contact.preferred_method,
                    "responseWindow": contact.response_window,
                },
                indent=2,
            ),
            "```",
            "",
        ]
        CONTACT_MD_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONTACT_MD_PATH, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        # 2. Sync contact.json (array of ContactItem for Greeter & Layout)
        def resolve_icon_name(raw_icon: str, platform: str) -> str:
            val = (raw_icon or platform or "").lower().replace("fa", "").replace("-", "")
            if "mail" in val or "envelope" in val:
                return "envelope"
            if "github" in val:
                return "github"
            if "linkedin" in val:
                return "linkedin"
            if "goodreads" in val:
                return "goodreads"
            return "question-circle"

        json_items = []
        for s in socials:
            json_items.append({
                "name": s.platform,
                "url": s.url,
                "icon": resolve_icon_name(s.icon, s.platform),
                "isMain": "email" in s.platform.lower() or "mail" in s.url.lower(),
            })
        if not json_items:
            json_items = [
                {"name": "Email", "url": f"mailto:{contact.email}", "icon": "envelope", "isMain": True},
                {"name": "GitHub", "url": contact.github_url, "icon": "github", "isMain": False},
                {"name": "LinkedIn", "url": contact.linkedin_url, "icon": "linkedin", "isMain": False},
            ]
        CONTACT_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONTACT_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(json_items, f, indent=2)
            f.write("\n")
    except Exception as e:
        logger.warning(f"Could not sync contact files: {e}")


def get_or_create_contact_info(db: Session) -> ContactInfo:
    info = db.query(ContactInfo).first()
    if not info:
        info = ContactInfo(
            developer_name="Punlork",
            professional_title="Full-Stack & Python Developer",
            email="sokpunlork586@gmail.com",
            location="Cambodia",
            timezone="ICT (UTC+7)",
            preferred_method="Email",
            response_window="Within 24 hours",
            availability_status="Available for projects",
            github_url="https://github.com/sokpunlork586-tech",
            linkedin_url="https://linkedin.com",
        )
        db.add(info)
        db.commit()
        db.refresh(info)
    return info


@router.get("", response_model=ContactInfoResponse)
def get_contact_info(db: Session = Depends(get_db)) -> Any:
    return get_or_create_contact_info(db)


@router.put("", response_model=ContactInfoResponse)
def update_contact_info(
    info_in: ContactInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    info = get_or_create_contact_info(db)
    update_data = info_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(info, field, val)

    db.commit()
    db.refresh(info)
    sync_contact_to_files(db, info)
    return info


# --- Social Links CRUD ---

@router.get("/social-links", response_model=List[SocialLinkResponse])
def list_social_links(db: Session = Depends(get_db)) -> Any:
    return db.query(SocialLink).order_by(SocialLink.order.asc(), SocialLink.id.asc()).all()


@router.post("/social-links", response_model=SocialLinkResponse, status_code=status.HTTP_201_CREATED)
def create_social_link(
    social_in: SocialLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    social = SocialLink(**social_in.model_dump())
    db.add(social)
    db.commit()
    db.refresh(social)

    contact = get_or_create_contact_info(db)
    sync_contact_to_files(db, contact)
    return social


@router.put("/social-links/{id}", response_model=SocialLinkResponse)
def update_social_link(
    id: int,
    social_in: SocialLinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    social = db.query(SocialLink).filter(SocialLink.id == id).first()
    if not social:
        raise HTTPException(status_code=404, detail="Social link not found")

    update_data = social_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(social, field, val)

    db.commit()
    db.refresh(social)

    contact = get_or_create_contact_info(db)
    sync_contact_to_files(db, contact)
    return social


@router.delete("/social-links/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_link(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    social = db.query(SocialLink).filter(SocialLink.id == id).first()
    if not social:
        raise HTTPException(status_code=404, detail="Social link not found")

    db.delete(social)
    db.commit()

    contact = get_or_create_contact_info(db)
    sync_contact_to_files(db, contact)
    return None
