import logging
from pathlib import Path
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.education import Education
from app.models.user import User
from app.schemas.education import EducationCreate, EducationUpdate, EducationResponse

logger = logging.getLogger("education")
router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
EDUCATION_MD_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "tabs" / "education.md"


def sync_education_to_markdown(db: Session) -> None:
    try:
        items = db.query(Education).order_by(Education.order.asc(), Education.id.asc()).all()
        lines = ["### My [academic] background\n"]
        for edu in items:
            link = edu.url or "#"
            lines.append(f"- [{edu.institution}]({link})\n")
            lines.append(f"  - {edu.degree}")
            if edu.field_of_study:
                lines.append(f"  - {edu.field_of_study}")
            lines.append(f"  - {edu.start_date} - {edu.end_date}")
            if edu.grade:
                lines.append(f"  - Grade: {edu.grade}")
            if edu.description:
                lines.append(f"  - {edu.description}")
            lines.append("")

        EDUCATION_MD_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(EDUCATION_MD_PATH, "w", encoding="utf-8") as f:
            f.write("\n".join(lines).strip() + "\n")
    except Exception as e:
        logger.warning(f"Could not sync education.md: {e}")


@router.get("", response_model=List[EducationResponse])
def list_education(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
) -> Any:
    query = db.query(Education)
    if search and isinstance(search, str):
        s = f"%{search}%"
        query = query.filter(
            (Education.institution.ilike(s)) |
            (Education.degree.ilike(s)) |
            (Education.field_of_study.ilike(s)) |
            (Education.description.ilike(s))
        )
    return query.order_by(Education.order.asc(), Education.id.asc()).all()


@router.get("/{id}", response_model=EducationResponse)
def get_education(
    id: int,
    db: Session = Depends(get_db),
) -> Any:
    edu = db.query(Education).filter(Education.id == id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    return edu


@router.post("", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_education(
    edu_in: EducationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    edu = Education(**edu_in.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    sync_education_to_markdown(db)
    return edu


@router.put("/{id}", response_model=EducationResponse)
def update_education(
    id: int,
    edu_in: EducationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    edu = db.query(Education).filter(Education.id == id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")

    update_data = edu_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(edu, field, val)

    db.commit()
    db.refresh(edu)
    sync_education_to_markdown(db)
    return edu


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    edu = db.query(Education).filter(Education.id == id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")

    db.delete(edu)
    db.commit()
    sync_education_to_markdown(db)
    return None
