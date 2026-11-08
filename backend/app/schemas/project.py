from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str = "Untitled Project"
    slug: Optional[str] = None
    description: Optional[str] = ""
    category: str = "Web App"
    tags: str = ""
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    page_size: int
