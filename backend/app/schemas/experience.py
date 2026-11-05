from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ExperienceBase(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    employment_type: Optional[str] = "Full-time"
    start_date: str
    end_date: str = "Present"
    is_current: bool = True
    description: str
    technologies: str = ""
    company_url: Optional[str] = None
    order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    technologies: Optional[str] = None
    company_url: Optional[str] = None
    order: Optional[int] = None


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
