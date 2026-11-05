import logging
from pathlib import Path
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.skill import Skill
from app.models.user import User
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse

logger = logging.getLogger("skills")
router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
SKILLS_MD_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "tabs" / "skills.md"


def sync_skills_to_markdown(db: Session) -> None:
    try:
        skills = db.query(Skill).order_by(Skill.category.asc(), Skill.order.asc(), Skill.name.asc()).all()
        categories: dict[str, list[Skill]] = {}
        for s in skills:
            categories.setdefault(s.category, []).append(s)

        lines = ["### Technical Skills\n"]
        for cat, items in categories.items():
            lines.append(f"#### {cat}\n")
            for item in items:
                lines.append(f"- **{item.name}** — {item.proficiency}%")
            lines.append("")

        SKILLS_MD_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(SKILLS_MD_PATH, "w", encoding="utf-8") as f:
            f.write("\n".join(lines).strip() + "\n")
    except Exception as e:
        logger.warning(f"Could not sync skills.md: {e}")


@router.get("", response_model=List[SkillResponse])
def list_skills(
    db: Session = Depends(get_db)
) -> Any:
    return db.query(Skill).order_by(Skill.category.asc(), Skill.order.asc()).all()


@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_in: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    existing = db.query(Skill).filter(Skill.name == skill_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists.")
    
    skill = Skill(**skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    sync_skills_to_markdown(db)
    return skill


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill_in: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = skill_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(skill, field, val)

    db.commit()
    db.refresh(skill)
    sync_skills_to_markdown(db)
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    sync_skills_to_markdown(db)
    return None

