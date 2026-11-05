import logging
from pathlib import Path
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.experience import Experience
from app.models.user import User
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse

logger = logging.getLogger("experience")
router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
EXPERIENCE_MD_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "tabs" / "experience.md"


def sync_experience_to_markdown(db: Session) -> None:
    try:
        items = db.query(Experience).order_by(Experience.order.asc(), Experience.id.asc()).all()
        lines = ["### Professional Experience\n"]
        for exp in items:
            comp_link = f"[{exp.company}]({exp.company_url})" if exp.company_url else exp.company
            date_range = f"{exp.start_date} - {exp.end_date}"
            lines.append(f"- **{exp.position}** @ {comp_link} *({date_range})*\n")
            if exp.location:
                lines.append(f"  - Location: {exp.location}")
            if exp.employment_type:
                lines.append(f"  - Type: {exp.employment_type}")
            for line in exp.description.splitlines():
                clean_l = line.strip().lstrip("-").strip()
                if clean_l:
                    lines.append(f"  - {clean_l}")
            if exp.technologies:
                formatted_tags = ", ".join(f"`{t.strip()}`" for t in exp.technologies.split(",") if t.strip())
                lines.append(f"  - Tech Stack: {formatted_tags}")
            lines.append("")

        EXPERIENCE_MD_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(EXPERIENCE_MD_PATH, "w", encoding="utf-8") as f:
            f.write("\n".join(lines).strip() + "\n")
    except Exception as e:
        logger.warning(f"Could not sync experience.md: {e}")


@router.get("", response_model=List[ExperienceResponse])
def list_experience(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
) -> Any:
    query = db.query(Experience)
    if search and isinstance(search, str):
        s = f"%{search}%"
        query = query.filter(
            (Experience.position.ilike(s)) |
            (Experience.company.ilike(s)) |
            (Experience.description.ilike(s)) |
            (Experience.technologies.ilike(s))
        )
    return query.order_by(Experience.order.asc(), Experience.id.asc()).all()


@router.get("/{id}", response_model=ExperienceResponse)
def get_experience(
    id: int,
    db: Session = Depends(get_db),
) -> Any:
    exp = db.query(Experience).filter(Experience.id == id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")
    return exp


@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp_in: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    exp = Experience(**exp_in.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    sync_experience_to_markdown(db)
    return exp


@router.put("/{id}", response_model=ExperienceResponse)
def update_experience(
    id: int,
    exp_in: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    exp = db.query(Experience).filter(Experience.id == id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")

    update_data = exp_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(exp, field, val)

    db.commit()
    db.refresh(exp)
    sync_experience_to_markdown(db)
    return exp


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    exp = db.query(Experience).filter(Experience.id == id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")

    db.delete(exp)
    db.commit()
    sync_experience_to_markdown(db)
    return None
