from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class SkillBase(BaseModel):
    name: str = "New Skill"
    category: str = "Frontend"
    proficiency: int = Field(default=80, ge=0, le=100)
    icon: Optional[str] = None
    order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = Field(default=None, ge=0, le=100)
    icon: Optional[str] = None
    order: Optional[int] = None


class SkillResponse(SkillBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
