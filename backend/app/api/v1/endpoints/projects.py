from pathlib import Path
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, require_admin
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse

router = APIRouter()

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
PROJECTS_MD_PATH = WORKSPACE_ROOT / "frontend" / "src" / "data" / "tabs" / "projects.md"


def sync_projects_to_markdown(db: Session) -> None:
    try:
        projects = db.query(Project).order_by(Project.order.asc(), Project.id.desc()).all()
        lines = ["### Some of the projects I've worked on so far\n"]
        for p in projects:
            link = p.demo_url or p.github_url or f"#{p.slug}"
            lines.append(f"- [{p.title}]({link})\n")
            lines.append(f"  - {p.description}")
            if p.tags:
                formatted_tags = ", ".join(f"`{t.strip()}`" for t in p.tags.split(",") if t.strip())
                lines.append(f"  - {formatted_tags}")
            sublinks = []
            if p.demo_url:
                sublinks.append(f"[Live Demo]({p.demo_url})")
            if p.github_url:
                sublinks.append(f"[Source Code]({p.github_url})")
            if sublinks:
                lines.append(f"  - {' | '.join(sublinks)}")
            lines.append("")

        PROJECTS_MD_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(PROJECTS_MD_PATH, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
    except Exception as e:
        import logging
        logging.getLogger("projects").warning(f"Could not sync projects.md: {e}")


@router.get("", response_model=ProjectListResponse)
def list_projects(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
) -> Any:
    query = db.query(Project)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Project.title.ilike(search_filter)) |
            (Project.description.ilike(search_filter)) |
            (Project.tags.ilike(search_filter))
        )
    if category and category != "All":
        query = query.filter(Project.category == category)

    total = query.count()
    items = (
        query.order_by(Project.order.asc(), Project.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
) -> Any:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A project with this slug already exists.")

    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    sync_projects_to_markdown(db)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Any:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_in.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != project.slug:
        existing = db.query(Project).filter(Project.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already in use.")

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    sync_projects_to_markdown(db)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    sync_projects_to_markdown(db)
    return None

